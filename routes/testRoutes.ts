import express, { Request, Response } from "express";
import fetch from 'cross-fetch'
import { logger } from "../util/logger";

export const testRoutes = express.Router();

testRoutes.post('/suicide', testSuicide)
testRoutes.post('/heart', testHeartDisease)
testRoutes.post('/diabetes', testDiabetes)

async function testSuicide(req: Request, res: Response) {
    try {
        logger.debug('before sending test data')
        const testData = req.body.text
        
        const fetchRes = await fetch('http://localhost:8000/index/test/suicide', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([testData])
        })

        if (fetchRes.status >= 400) {
            throw new Error('"Bad response from test server"')
        }

        const result = await fetchRes.json()

        res.json({
            status: true,
            result: result
        });

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            msg: 'ERR005: Something Went Wrong When Sending Test Data'
        })
    }
}

async function testHeartDisease(req: Request, res: Response) {
    try {
        logger.debug('before sending test data')
        const testData = req.body
        
        const fetchRes = await fetch('http://localhost:8000/index/test/heart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([testData])
        })

        if (fetchRes.status >= 400) {
            throw new Error('"Bad response from test server"')
        }

        const result = await fetchRes.json()

        res.json({
            status: true,
            result: result
        });

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            msg: 'ERR005: Something Went Wrong When Sending Test Data'
        })
    }
}

async function testDiabetes(req: Request, res: Response) {
    try{
        logger.debug('before sending test data')
        const testData = req.body

        const fetchRes = await fetch('http://localhost:8000/index/test/diabetes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([testData])
        })
        
        if (fetchRes.status >= 400) {
            throw new Error('"Bad response from test server"')
        }

        const result = await fetchRes.json()

        res.json({
            status: true,
            result: result
        });

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            msg: 'ERR006: Error of sending test data.'
        })
    }
}

async function testStrokes(req: Request, res: Response) {
    try{
        logger.debug('before sending test data')
        const testData = req.body

        const fetchRes = await fetch('http://localhost:8000/index/test/stroke', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([testData])
        })
        
        if (fetchRes.status >= 400) {
            throw new Error('"Bad response from test server"')
        }

        const result = await fetchRes.json()

        res.json({
            status: true,
            result: result
        });

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            msg: 'ERR006: Error of sending test data.'
        })
    }
}