import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateSpendingRequest } from '../../requests/CreateSpendingRequest'
import { createspending } from '../../businessLogic/spendings';
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createSpending')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newSpending: CreateSpendingRequest = JSON.parse(event.body)

  const jwtToken = parseAuthorizationHeader(event.headers.Authorization)
  const item = await createspending(newSpending, jwtToken)

  logger.info("Created new spending", item)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item
    }, null, 2)
  }
})

handler.use(cors())
