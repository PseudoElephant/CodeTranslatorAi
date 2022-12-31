import { APIGatewayAuthorizerEvent, AuthResponse, Context, PolicyDocument } from 'aws-lambda'

// generatePolicy creates a policy document to allow this user on this API:
function generatePolicy (effect: string, resource: string): PolicyDocument {
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
  return policyDocument
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export async function handler (event: APIGatewayAuthorizerEvent, context: Context): Promise<AuthResponse> {
    // TODO: Validate session

    const policyDoc = generatePolicy('Allow', event.methodArn)
    const response = {
      principalId: 'user',
      policyDocument: policyDoc,
      context: {
        userId: '2681b6a8-35f5-4ec4-89e5-3acb8fe2a977', // TODO: Get user id from session
      }
    } as AuthResponse

    return response
}