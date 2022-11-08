import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('name');
        table.integer('age_group')
        table.float('weight')
        table.integer('height')
        table.integer('gender')
        table.integer('sleep')
        table.integer('exercise')
        table.integer('alcohol')
        table.integer('smoke');
        table.integer('glucose');
        table.integer('blood-pressure');
        table.integer('insulin');
        table.integer('pedigree');
        table.integer('actual_age')
        table.string('session_id');
    })

}

export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('users')
    
}

