import express, { Request, Response } from "express";
import { knex } from "../app";
import { InfoService } from "../service/InfoService";
import { logger } from "../util/logger";
import ErrorCode from "../error-code.json";

export const infoRoutes = express.Router();

infoRoutes.get('/', getInfo)
infoRoutes.post('/', saveInfo)
infoRoutes.post('/name', saveNameOnly)
infoRoutes.delete('/', deleteInfo)

const infoService = new InfoService(knex);

async function getInfo(req: Request, res: Response) {
    try {
        logger.debug('before reading DB')

        const cookieID = req.cookies['connect.sid']
        console.log("cookieID", cookieID)
        const userID = await infoService.get(cookieID)

        if (userID !== undefined) {
            const result = (await knex.select('*')
                .from('users')
                .where('id', userID.id))[0]

            console.log(result)

            const obj = {
                name: result.name,
                height: result.height,
                weight: result.weight,
                ageGroup: result.age_group,
                gender: result.gender,
                smoke: result.smoke,
                sleep: result.sleep,
                exercise: result.exercise,
                alcohol: result.alcohol,
                actualAge: result.actual_age,
                stroke: result.stroke,
                heartAttack: result.heart_attack,
                cholesterolCheck: result.cholesterol_check,
                cholesterolHigh: result.cholesterol_high,
                bloodPressure: result.blood_pressure,
                fruit: result.fruit,
                veggies: result.veggies,
                exerciseDays: result.exercise_days,
                mentalHealth: result.mental_health,
                generalHealth: result.general_health,
                anxiety: result.anxiety,
                fatigue: result.fatigue,
                shortBreath: result.short_breath,
                swallow: result.swallow,
                chestPain: result.chest_pain,
                hypertension: result.hypertension,
                heartDisease: result.heartDisease,
                smokingStatus: result.smokingStatus
            }

            res.json({
                status: true,
                data: obj
            })
        } else {
            res.status(404).json({
                status: false,
                msg: 'No Saved Info'
            })
        }

    } catch (e) {
        logger.error(e);
        res.status(500).json({
            status: false,
            msg: 'ERR006: Failed to Get User Info'
        });
    }
}

async function saveNameOnly(req: Request, res: Response) {
    try {
        logger.debug('before DB query')

        const cookieID = req.cookies['connect.sid']
        const name = req.body.name

        const userID = (await knex.select('id').from('users').where('session_id', cookieID))[0]

        if (!!userID) {
            await knex('users').update({
                session_id: cookieID,
                name: name,
            }).where('id', userID.id)
        } else {
            await knex.insert({
                session_id: cookieID,
                name: name,
            }).into('users')
        }

        res.json({
            status: true,
            msg: 'save successful'
        })

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            status: false,
            msg: 'ERR007: Unable to Save User Name'
        })
    }
}

async function saveInfo(req: Request, res: Response) {

    try {
        logger.debug('before reading DB')

        const name = req.body?.name
        const height = req.body?.height
        const weight = req.body?.weight
        const ageGroup = req.body?.ageGroup
        const gender = req.body?.gender
        const smoke = req.body?.smoke
        const sleep = req.body?.sleep
        const exercise = req.body?.exercise
        const alcohol = req.body?.alcohol
        const actualAge = req.body?.actualAge
        const stroke = req.body?.stroke
        const heartAttack = req.body?.heartAttack
        const cholesterolCheck = req.body?.cholesterolCheck
        const cholesterolHigh = req.body?.cholesterolHigh
        const bloodPressure = req.body?.bloodPressure
        const fruit = req.body?.fruit
        const veggies = req.body?.veggies
        const exerciseDays = req.body?.exerciseDays
        const mentalHealth = req.body?.mentalHealth
        const generalHealth = req.body?.generalHealth
        const cookieID = req.cookies['connect.sid']
        const anxiety = req.body?.anxiety
        const fatigue = req. body?.fatigue
        const cough = req.body?.cough
        const shortBreath = req.body?.shortBreath
        const swallow = req.body?.swallow
        const chestPain = req.body?.chestPain
        const hypertension = req.body?.hypertension
        const heartDisease =  req.body?.heartDisease
        const smokingStatus =  req.body?.smokingStatus

        const userID = (await knex.select('id').from('users').where('session_id', cookieID))[0]
        console.log(userID,height)
 
        if (!!userID) {
            await knex('users').update({
                session_id: cookieID,
                name: name,
                height: height,
                weight: weight,
                age_group: ageGroup,
                gender: gender,
                smoke: smoke,
                exercise: exercise,
                sleep: sleep,
                alcohol: alcohol,
                actual_age: actualAge,
                stroke: stroke,
                heart_attack: heartAttack,
                cholesterol_check: cholesterolCheck, 
                cholesterol_high: cholesterolHigh,
                blood_pressure: bloodPressure,
                fruit: fruit,
                veggies: veggies,
                exercise_days: exerciseDays,
                mental_health: mentalHealth,
                general_health: generalHealth,
                anxiety: anxiety,
                fatigue: fatigue,
                cough: cough,
                short_breath: shortBreath,
                swallow: swallow,
                chest_pain: chestPain,
                hypertension: hypertension,
                heartDisease: heartDisease,
                smokingStatus: smokingStatus

            }).where('id', userID.id)
        } else {
            await knex.insert({
                session_id: cookieID,
                name: name,
                height: height,
                weight: weight,
                age_group: ageGroup,
                gender: gender,
                smoke: smoke,
                exercise: exercise,
                sleep: sleep,
                alcohol: alcohol,
                actual_age: actualAge,
                stroke: stroke,
                heart_attack: heartAttack,
                cholesterol_check: cholesterolCheck, 
                cholesterol_high: cholesterolHigh,
                blood_pressure: bloodPressure,
                fruit: fruit,
                veggies: veggies,
                exercise_days: exerciseDays,
                mental_health: mentalHealth,
                general_health: generalHealth,
                anxiety: anxiety,
                fatigue: fatigue,
                cough: cough,
                short_breath: shortBreath,
                swallow: swallow,
                chest_pain: chestPain,
                hypertension: hypertension,
                heartDisease: heartDisease,
                smokingStatus: smokingStatus

            }).into('users')
        }

        res.json({ status: true });

    } catch (e) {
        logger.error(e)
        res.status(500).json({
            status: false,
            msg: 'ERR002: Failed Save User Info'
        })
    }
}

async function deleteInfo(req: Request, res: Response) {
    try {
        logger.debug('before reading DB')

        const cookieID = req.cookies["connect.sid"]

        await knex('users')
            .where('session_id', cookieID)
            .delete()

        res.json({ status: true });

    } catch (e) {
        logger.error(e)
        res.status(500).json({
            status: false,
            msg: `ERR004: ${ErrorCode.ERR004}`
        })
    }
}

