import json
import boto3
from botocore.exceptions import ClientError

dynamoClient = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    table_name = 'invoices'

    try:
        table = dynamoClient.create_table(
            TableName = table_name,
            KeySchema = [
                {
                    'AttributeName': 'invoice_id',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'user_id_room_id',
                    'KeyType': 'RANGE'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'invoice_id',
                    'AttributeType': 'N'
                },
                {
                    'AttributeName': 'user_id_room_id',
                    'AttributeType': 'S'
                }
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
            raise err
