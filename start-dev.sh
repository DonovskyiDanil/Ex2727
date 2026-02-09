#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################

set -e

REQUIRED_DOCKER_VERSION="23.0.1"
COMPOSE_FILE="docker-compose-dev.yaml"
SERVER_SERVICE="server-dev"

# Check Docker version >= 23.0.1 (portable version compare)
check_docker_version() {
  if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH."
    exit 1
  fi
  local version
  version=$(docker version --format '{{.Server.Version}}' 2>/dev/null) || true
  if [ -z "$version" ]; then
    version=$(docker version 2>/dev/null | grep "Version" | head -1 | sed -n 's/.*Version: \([0-9.]*\).*/\1/p')
  fi
  if [ -z "$version" ]; then
    echo "Error: Could not determine Docker version. Ensure Docker daemon is running."
    exit 1
  fi
  local req_major req_minor req_patch v_major v_minor v_patch
  IFS=. read -r req_major req_minor req_patch <<< "$REQUIRED_DOCKER_VERSION"
  IFS=. read -r v_major v_minor v_patch <<< "$version"
  req_major=${req_major:-0}; req_minor=${req_minor:-0}; req_patch=${req_patch:-0}
  v_major=${v_major:-0}; v_minor=${v_minor:-0}; v_patch=${v_patch:-0}
  if [ "$v_major" -lt "$req_major" ] || \
     { [ "$v_major" -eq "$req_major" ] && [ "$v_minor" -lt "$req_minor" ]; } || \
     { [ "$v_major" -eq "$req_major" ] && [ "$v_minor" -eq "$req_minor" ] && [ "$v_patch" -lt "$req_patch" ]; }; then
    echo "Error: Docker version must be >= $REQUIRED_DOCKER_VERSION. Current: $version"
    exit 1
  fi
  echo "-----> Docker version: $version (OK)"
}

started_at=$(date +"%s")

check_docker_version

echo "-----> Building and starting containers"
docker compose --file "$COMPOSE_FILE" up -d --build

echo "-----> Waiting for server to be ready..."
sleep 10

echo "-----> Running application migrations"
docker compose --file "$COMPOSE_FILE" exec -T "$SERVER_SERVICE" npx sequelize-cli db:migrate

echo "-----> Running application seeds"
docker compose --file "$COMPOSE_FILE" exec -T "$SERVER_SERVICE" npx sequelize-cli db:seed:all
echo "<----- Seeds created"

ended_at=$(date +"%s")
minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"
echo "       Application: frontend http://localhost:5000, API http://localhost:3000"
echo "       View logs: docker compose --file $COMPOSE_FILE logs -f"
