import { S3EventRecord, S3Handler, S3Event } from 'aws-lambda'
import { updatSpendingImageUrl } from '../../businessLogic/spendings'
import * as querystring from 'querystring'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateS3ImageURL')

const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: S3Handler = async (event: S3Event) => {
    logger.log('Processing S3 event ', JSON.stringify(event))
    for (const record of event.Records) {
        await processImage(record)
    }
}

async function processImage(record: S3EventRecord) {
    const key = querystring.unescape(record.s3.object.key)
    const split = key.split(':')
    const userId = split[0]
    const spendingId = split[1]
    logger.info('Processing S3 item with key: ', key)
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${record.s3.object.key}`
    await updatSpendingImageUrl(imageUrl, userId, spendingId)
}