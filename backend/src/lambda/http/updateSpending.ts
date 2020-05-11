import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { UpdateSpendingRequest } from '../../requests/UpdateSpendingRequest'
import { updateSpending } from '../../businessLogic/spendings'
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateSpending')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const spendingId = event.pathParameters.spendingId
  const updatedSpending: UpdateSpendingRequest = JSON.parse(event.body)
  const jwtToken = parseAuthorizationHeader(event.headers.Authorization)
  const spendingUpdate = await updateSpending(spendingId, updatedSpending, jwtToken)

  logger.info('updated spending', spendingUpdate)
  return {
    statusCode: 200,
    body: JSON.stringify({
      item: updateSpending
    }, null, 2)
  }
})

handler.use(cors())
