import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime


dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
dynamo_orders_table = dynamodb.Table('food_orders')

def lambda_handler(event, context):
    try:
        print
        ('Starting Service')
        body = json.loads(event["body"])
        orderId = body.get('order_id')
        statusCode = body.get('status')
        print(orderId,statusCode)
        
        UpdateExpression = 'SET order_status = :val1'
        ExpressionAttributeValues = {
                ':val1': statusCode
            }
        
        
        dynamo_orders_table.update_item( Key={'order_id': orderId},
        ConditionExpression = 'attribute_exists(order_id)',
        UpdateExpression = UpdateExpression,
        ExpressionAttributeValues = ExpressionAttributeValues)
        
        print('Updated')
        
    except Exception as e:
        print(e)
        return customResponse(502, body="Error")
    
    return customResponse(200)


def customResponse(statuscode, body=None):
    response = {
        "status_code": statuscode,
        "headers": {
            "content-type": "application/json"
        }

    }
    if body:
        response["body"] = body
    return response
    
