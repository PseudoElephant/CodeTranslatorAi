import { getSessionFromSessionId, getUserIdFromSession } from '@/storage/session'
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent, AuthResponse, Context, PolicyDocument } from 'aws-lambda'

// generatePolicy creates a policy document to allow this user on this API:
const  generatePolicyRespinse = (effect: string, resource: string, context? : APIGatewayAuthorizerResult["context"]): APIGatewayAuthorizerResult => {
  const policyDocument = {} as PolicyDocument
  if (effect && resource) {
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne: any = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
  }
  return {
    principalId: 'user',
    policyDocument,
    context,
  } 
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export async function handler (event: APIGatewayRequestAuthorizerEvent, context: Context): Promise<AuthResponse> {
    const sessionId =  event.headers?.['Authorization'] || ""

    if (!sessionId) {
      return generatePolicyRespinse('Deny', event.methodArn)
    }

    let session
    try {
      session = await getSessionFromSessionId(sessionId)
    } catch (e) {
      return generatePolicyRespinse('Deny', event.methodArn)
    }

    if (session.expires < new Date()) {
      return generatePolicyRespinse('Deny', event.methodArn)
    }

    let userId

    try { 
      userId = await getUserIdFromSession(sessionId)
    } catch (e) {
      return generatePolicyRespinse('Deny', event.methodArn)
    }
  
  return generatePolicyRespinse('Allow', event.methodArn, { userId })
}