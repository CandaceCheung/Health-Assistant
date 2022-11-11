import express, { Request, Response } from "express";
import fetch from 'cross-fetch'
import { logger } from "../util/logger";

export const testRoutes2 = express.Router();

testRoutes2.post('/suicide', testSuicide)
testRoutes2.post('/heart', testHeartDisease)
testRoutes2.post('/diabetes', testDiabetes)
testRoutes2.post('/stroke', testStroke)
testRoutes2.post('/lung', testLung)

async function testLung(req: Request, res: Response) {
    try {
        logger.debug('before sending test data')
        const testData = req.body
        
        const fetchRes = await fetch('https://health-assistant-ai.frankieyip.world/index/test/lung', {
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
        
        if (fetchRes.status !== 200){
            res.json({
                status: false,
                msg: 'ERR008: Something Went Wrong When Sending Test Data to Model'
            })
        } else{
            res.json({
                status: true,
                result: result
            });
        }

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            status: false,
            msg: 'ERR005: Something Went Wrong When Sending Test Data to Server'
        })
    }
}

async function testSuicide(req: Request, res: Response) {
    try {
        logger.debug('before sending test data')
        const testData = req.body.text
        
        const fetchRes = await fetch('https://health-assistant-ai.frankieyip.world/index/test/suicide', {
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
        
        if (fetchRes.status !== 200){
            res.json({
                status: false,
                msg: 'ERR008: Something Went Wrong When Sending Test Data to Model'
            })
        } else{
            res.json({
                status: true,
                result: result
            });
        }

    } catch (e) {
        logger.error(e)
        res.status(400).json({
            status: false,
            msg: 'ERR005: Something Went Wrong When Sending Test Data to Server'
        })
    }
}

async function testHeartDisease(req: Request, res: Response) {
    try {
        logger.debug('before sending test data')
        const testData = req.body
        
        const fetchRes = await fetch('https://health-assistant-ai.frankieyip.world/index/test/heart', {
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
            status: false,
            msg: 'ERR005: Something Went Wrong When Sending Test Data'
        })
    }
}

async function testDiabetes(req: Request, res: Response) {
    try{
        logger.debug('before sending test data')
        const testData = req.body

        const fetchRes = await fetch('https://health-assistant-ai.frankieyip.world/index/test/diabetes', {
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
            status: false,
            msg: 'ERR006: Error of sending test data.'
        })
    }
}

async function testStroke(req: Request, res: Response) {
    try{
        logger.debug('before sending test data')
        const testData = req.body

        const fetchRes = await fetch('https://health-assistant-ai.frankieyip.world/index/test/stroke', {
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
            status: false,
            msg: 'ERR007: Error of sending test data.'
        })
    }
}