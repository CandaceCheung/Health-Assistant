import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('name');
        table.integer('age_group');
        table.float('weight');
        table.integer('height');
        table.integer('gender');
        table.integer('sleep');
        table.integer('exercise');
        table.integer('alcohol');
        table.integer('smoke');
        table.integer('actual_age');
        table.string('session_id');
        table.integer('smoke_check');
        table.integer('stroke');
        table.integer('heart_attack');
        table.integer('cholesterol_check');
        table.integer('cholesterol_high');
        table.integer('blood_pressure');
        table.integer('fruit');
        table.integer('veggies');
        table.integer('exercise_check');
        table.integer('exercise_days');
        table.integer('mental_health');
        table.integer('drinker');
        table.integer('general_health');
    })

}

export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('users')
    
}

