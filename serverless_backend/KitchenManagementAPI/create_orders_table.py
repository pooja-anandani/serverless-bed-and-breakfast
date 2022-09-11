import json
import boto3
from botocore.exceptions import ClientError
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

dynamoClient = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    table_name = 'food_orders'

    try:
        table = dynamoClient.create_table(
            TableName = table_name,
            KeySchema = [
                {
                    'AttributeName': 'order_id',
                    'KeyType': 'HASH'
                },
                ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'order_id',
                    'AttributeType': 'N'
                },
            ],
            ProvisionedThroughput = {
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5,
                }
            )
        return {
            'statusCode': 200,
            'body': json.dumps('Table created successfully!')
    }
    except ClientError as err:
            logger.error(
                "Couldn't create table %s. Here's why: %s: %s", table_name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise err
