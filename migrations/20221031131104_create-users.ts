import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('name');
        table.string('email')
        table.dateTime('birthday')
        table.float('weight')
        table.integer('height')
    })

}


export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('users')
}

