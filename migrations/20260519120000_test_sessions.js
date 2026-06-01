/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('test_sessions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().index();
    table.integer('test_id').notNullable();
    table.integer('subject_id').notNullable();
    table.integer('class').notNullable();
    table.timestamp('started_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('ends_at', { useTz: true }).notNullable();
    table.timestamp('completed_at', { useTz: true }).nullable();
    table.string('status', 20).notNullable().defaultTo('active');
    table.jsonb('answers').nullable();
    table.integer('grade').nullable();
    table.index(['user_id', 'status']);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('test_sessions');
};
