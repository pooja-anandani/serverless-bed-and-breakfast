import json
import boto3
from botocore.exceptions import ClientError

dynamoClient = boto3.client('dynamodb')

def lambda_handler(event, context):

    try:
        response = dynamoClient.scan(TableName = 'menu')

        return (json.dumps({'statusCode': 200,
                'menu': response['Items'],
                'headers': {
                    'Content-Type': 'application/json'
                },
                'message': 'Menu list retrieved successfully!'}))
        
    except ClientError as err:
        return (json.dumps({'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'message': err.message}))
