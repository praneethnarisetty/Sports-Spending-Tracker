import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJbNZ9udf9FAlYMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi0zYm1lcjAtNC5hdXRoMC5jb20wHhcNMjAwNDA0MDUzNTM1WhcNMzMx
MjEyMDUzNTM1WjAhMR8wHQYDVQQDExZkZXYtM2JtZXIwLTQuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwbLkyMD8AkY/CsKVDrvC/+jI
hDoKM/XPo5I4izLXM659FfflkwUxk/IxDFaQjvY5ep8PFZXfcAJ9D5tmlaLHsDzX
YEmRRv6ZMmxMhCBdGmX3u81apkYVlQXpl5Vl8yjRTOd9RYA2ymogL9lxD3FcI0E/
Uqbl7E/mWGVUryigl5h8DfynNb0tgPN7Q4qL3xw7U1sPKJBs/KgPF3VR2Kr40Z9W
RTFQ+i+2y23xAO6jCZkNR6rfCKjk7mSTugcpl72fRfq77LEaNv1U0XA70sD2x6+G
g9ufrab7ZKkdIwzFsVDRXOzkDbkl/TXiuoxrD2zOBbO0WHkYwiCVjmlhYwA4fQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTG3zagKLgQDf95OH3w
XEfOYseGdDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAAfpNiyZ
UQvdWucGCK2EqMb7YJ1Y9MXB/zC0jC77aetda9L4KVwoQCkMNuGfNz7sb4eX0wgL
vHmR5Wo1XY2xA+F+2bgTFAMlV4mVrAr0Xl7Q/zDB9gGwuYScQT+nJbggbJ5FTSIa
cuoBRgJ4LOVUCCQA1D33iHL6RYI3zTMfeFvpouIKMnBf0D/ERwSxYbb/Z98YSd89
NFeOBV18isCnPMrGlczQKBb+3PPeDIHuf/XihE7aVxKvyGInYzZv92c0vMTJV+e3
J0aXj6eoaHmobm2QfmG7IsEPFloc1RivXO9rXhVccAHiPVDsKcZx7jguHAf+a7/W
5QltCyN1Hgarcac=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(
    token,           // Token from an HTTP header to validate
    cert,            // A certificate copied from Auth0 website
    { algorithms: ['RS256'] } // We need to specify that we use the RS256 algorithm
  ) as JwtPayload;
}