/**
 * Таблица пользователей: регистрация при покупке аттестации.
 */
exports.up = async function up(knex) {
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 255).notNullable();
      table.string("phoneNumber", 32).notNullable().unique();
      table.string("password", 255).notNullable();
      table.string("email", 255);
      table.string("child_first_name", 255);
      table.string("child_last_name", 255);
      table.string("payer_full_name", 255);
      table.jsonb("purchased_classes").notNullable().defaultTo(knex.raw("'[]'::jsonb"));
    });
    return;
  }

  const addColumn = async (name, fn) => {
    const col = await knex.schema.hasColumn("users", name);
    if (!col) {
      await knex.schema.alterTable("users", (t) => fn(t));
    }
  };

  await addColumn("email", (t) => t.string("email", 255));
  await addColumn("child_first_name", (t) => t.string("child_first_name", 255));
  await addColumn("child_last_name", (t) => t.string("child_last_name", 255));
  await addColumn("payer_full_name", (t) => t.string("payer_full_name", 255));
  await addColumn("purchased_classes", (t) =>
    t.jsonb("purchased_classes").notNullable().defaultTo(knex.raw("'[]'::jsonb")),
  );
};

exports.down = async function down(knex) {
  const hasUsers = await knex.schema.hasTable("users");
  if (hasUsers) {
    /* не удаляем таблицу — могли быть данные до миграции */
  }
};
