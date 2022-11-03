import express, { Request, Response } from "express";
import { knex } from "../app";
import { logger } from "../util/logger";

export const infoRoutes = express.Router();

infoRoutes.post('/', saveInfo)
infoRoutes.delete('/', deleteInfo)

async function saveInfo(req: Request, res: Response) {

    try {
        logger.debug('before reading DB')

        const name = req.body.name
        const height = req.body.height
        const weight = req.body.weight
        const ageGroup = req.body.ageGroup
        const gender = req.body.gender
        const smoke = req.body?.smoke
        const sleep = req.body?.sleep
        const exercise = req.body?.exercise
        const alcohol = req.body?.alcohol
        const cookieID = req.cookies['connect.sid']

        const userID = (await knex.select('id').from('users').where('session_id', cookieID))[0]

        if (!!userID){
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
            }).into('users')
        }

        res.json({ status: true });

    } catch (e) {
        logger.error(e)
        res.status(500).json({ msg: 'ERR002: Failed Save User Info' })
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
        res.status(500).json({ msg: 'ERR004: Unable to Delete User Info' })
    }

}