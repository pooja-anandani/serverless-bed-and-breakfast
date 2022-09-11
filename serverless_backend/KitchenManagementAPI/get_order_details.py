import json
import boto3
from boto3.dynamodb.conditions import Key

dynamoClient = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    body = json.loads(event['body'])
    data = json.loads(json.dumps(body))
    user_id = data['user_id']
    room_id = data['room_id']
    
    try:
        response = dynamoClient.scan(
            TableName = 'food_orders',
            ExpressionAttributeValues = {
                ':a': {
                    'S': user_id,
                },
                ':b': {
                    'N': room_id,
                },
            },
            FilterExpression = 'user_id = :a AND room_id = :b',
            )["Items"]
            
        if len(response) == 0:
            return (json.dumps({'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'message': 'No orders for this user!'}))
        else:
            return (json.dumps({'statusCode': 200,
                    'body': response,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'message': 'Order details retrieved successfully!'}))
        
    except Exception as e:
        print(e)
        return (json.dumps({ 
            'statusCode':500, 
            'body': 'Internal server error'
            }))