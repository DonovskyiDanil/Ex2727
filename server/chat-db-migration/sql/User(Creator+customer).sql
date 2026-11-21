SELECT COALESCE(
  json_object_agg(role, cnt),
  '{}'::json
) AS users_by_role
FROM (
  SELECT role, COUNT(*)::int AS cnt
  FROM public."Users"
  GROUP BY role
) sub;