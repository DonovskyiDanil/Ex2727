# Ex2026-main — Fullstack Exam Clone Project

Fullstack crowdsourcing platform built with React, Node.js, Express, Sequelize (PostgreSQL), and MongoDB, customized and optimized as part of the final examination project.



##  How to Run Docker Containers

```bash
docker compose -f docker-compose-dev.yaml up --build

```

* **Frontend Workspace:** http://localhost:3000
* **Backend API Infrastructure:** http://localhost:5001

---

##  Environment Variables Setup

### Root /.env

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=todo-dev

```

### Backend /server/.env

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=todo-dev
POSTGRES_HOST=ex2026-main-db-dev-1
MONGO_HOST=ex2026-main-mongo-dev-1
PORT=5001
STATIC_PATH=public/images
JWT_SECRET=asdasdasd4as5d4as8d7a8sd4as65d4a8sd7asd4as56d4
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_secure_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
API_URL=http://localhost:3000

```

---

##  Demo Credentials

* **Universal Password:** pass123

| User Role | Email Account | Assigned Name | Primary Role Action inside Demo Workflow |
| --- | --- | --- | --- |
| **Customer** | qwerty@gmail.com | Danylo Donovskyi | Creates and pays for contests. Selects the final winner. |
| **Creator** | anna@test.com | Anna Smirnova | Browses active listings and submits design/text proposals. |
| **Moderator** | mod@test.com | Alex Mod | Reviews pending offers. Filters and grants approval privileges. |

---

##  Bug Fixes & Refactoring

* **React Refactoring:** All legacy class components converted to functional components using modern React Hooks. Unused imports, dead code, and redundant libraries removed.
* **PostgreSQL Sequence Synchronization:** Resolved `SequelizeUniqueConstraintError` occurring during contest creation due to hardcoded seeder IDs. Fixed by fast-forwarding the internal sequence generator:

```bash
docker exec -it ex2026-main-db-dev-1 psql -U postgres -d todo-dev -c "SELECT setval('\"Contests_id_seq\"', (SELECT MAX(id) FROM \"Contests\") + 10);"

```

---

##  Features Summary

* **Layout updates:** Built an adaptive `/how-it-works` view accessible via header menus (`CONTESTS -> How It Works`). Created a reusable `ButtonGroup` layout component on `/startContest/nameContest`.
* **Events Page & Timer Manager:** Developed the `/events` workspace using custom React hooks to manage dynamic countdown alerts. Timers are automatically cleared on unmount to prevent memory leaks, and state persists across reloads via `localStorage`.
* **Error Logging Architecture:** Created an asynchronous logging middleware (`server/utils/errorLogFunction.js`) that outputs errors into `error.log` using a structured JSON layout: `{message, time, code, stackTrace}`.
* **Log Rotation Cron Job:** Implemented an automated daemon rotation script (`errorLogSchedule.js`) running via `node-cron`. It copies logs to a timestamped file, maps them to a simplified layout `{message, code, time}`, and flushes the primary file.
* **Moderation Flow:** Expanded access control with a dedicated `moderator` role and private panel. Submitted offers initialize as `pending`. Customers cannot view offers until they are verified; unapproved assets show a fallback state: *"There is no suggestion at this moment"*. Status transitions trigger email logs to the creator via `nodemailer`.
* **Chat Architecture Migration:** Described custom Sequelize models and data migrations to translate all chat interactions out of MongoDB documents directly into structured, relational PostgreSQL tables.

---

## SQL & No-SQL Tasks

All required examination scripts are localized under the following project workspace definitions:

* `server/db-no-sql/query.mongodb.js`: A case-insensitive single aggregation pipeline counting document matches containing the term "паровоз" inside the `Messages` collection.
* `server/db-sql/countOfUsers.sql`: Returns user distribution analytics aggregated directly by assignment role configurations (`{admin: 40, customer: 22, ...}`).
* `server/db-sql/customerCashback.sql`: Calculates and updates a 10% cashback balance credit for customers who purchased services during the winter holiday window (December 25 - January 14).
* `server/db-sql/payoutWithMaxRating.sql`: Identifies the top 3 highest-rated creators and issues an automated $10 prize adjustment to their active account balances.
* `server/db-sql/UML_Chat_Migration.png`: Relational database mapping diagram illustrating the migration of chat logs and foreign key bindings to the `Users` table.

```

```