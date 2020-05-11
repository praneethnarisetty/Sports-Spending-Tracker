import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS) as any

import { SpendingLog } from '../models/SpendingLog'
import { SpendingLogUpdate } from '../models/SpendingLogUpdate'

const logger = createLogger('spendingAccess')

export class SpendingAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly spendingTable = process.env.SPENDING_TABLE) { }


    async getAllSpendings(userId: string): Promise<SpendingLog[]> {
        logger.info('Getting Spendings for userId', userId)

        const result = await this.docClient.query({
            TableName: this.spendingTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items;
        return items as SpendingLog[]
    }


    async createSpending(spending: SpendingLog): Promise<SpendingLog> {
        logger.info('Creating Spending Log for userId', spending.userId)

        await this.docClient.put({
            TableName: this.spendingTable,
            Item: spending
        }).promise()

        return spending
    }

    async updateSpending(spendingId: string, spending: SpendingLogUpdate, userId: string): Promise<SpendingLogUpdate> {
        logger.info('Updating spending for userId and spendingId', userId, spendingId)
        await this.docClient.update({
            TableName: this.spendingTable,
            Key: {
                spendingId,
                userId
            },
            UpdateExpression: "set #name = :name, #date = :date, category = :category, amount = :amount",
            ExpressionAttributeNames: {
                "#name": "name",
                "#date": "date"
            },
            ExpressionAttributeValues: {
                ":name": spending.name,
                ":date": spending.date,
                ":category": spending.category,
                ":amount": spending.amount
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return spending

    }

    async updateSpendingImageUrl(imageUrl: string, userId: string, spendingId: string): Promise<any> {
        logger.info('Updating Spending attachmentUrl for userId and spendingId', userId, spendingId, imageUrl)
        await this.docClient.update({
            TableName: this.spendingTable,
            Key: {
                spendingId,
                userId
            },
            UpdateExpression: "set attachmentUrl = :imageUrl",
            ExpressionAttributeValues: {
                ":imageUrl": imageUrl
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return null

    }

    async deleteSpending(spendingId: string, userId: string): Promise<any> {
        logger.info('deleting Spendiong for userId and spendingId', userId, spendingId)

        await this.docClient.delete({
            TableName: this.spendingTable,
            Key: {
                spendingId,
                userId
            }
        }).promise()
        return null
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}