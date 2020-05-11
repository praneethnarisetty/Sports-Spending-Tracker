import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteSpending } from '../../businessLogic/spendings'
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteSpending')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const spendingId = event.pathParameters.spendingId
  if (!spendingId) {
    logger.info("spending id is not provided")
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Please provide spending id in the url path"
      })
    }
  }

  const jwtToken = parseAuthorizationHeader(event.headers.Authorization)
  await deleteSpending(spendingId, jwtToken)

  logger.info("deleted spending", spendingId)

  return {
    statusCode: 200,
    body: null
  }
})

handler.use(cors())