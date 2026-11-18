module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DO $$
      DECLARE
        sequence_record RECORD;
        max_id BIGINT;
      BEGIN
        FOR sequence_record IN
          SELECT table_schema,
                 table_name,
                 column_name,
                 pg_get_serial_sequence(
                   format('%I.%I', table_schema, table_name),
                   column_name
                 ) AS sequence_name
            FROM information_schema.columns
           WHERE table_schema = current_schema()
             AND (column_default LIKE 'nextval%' OR is_identity = 'YES')
        LOOP
          EXECUTE format(
            'SELECT COALESCE(MAX(%I), 0) FROM %I.%I',
            sequence_record.column_name,
            sequence_record.table_schema,
            sequence_record.table_name
          ) INTO max_id;

          IF max_id > 0 THEN
            PERFORM setval(sequence_record.sequence_name::regclass, max_id, true);
          ELSE
            PERFORM setval(sequence_record.sequence_name::regclass, 1, false);
          END IF;
        END LOOP;
      END
      $$;
    `);
  },
  down: async () => {},
};
