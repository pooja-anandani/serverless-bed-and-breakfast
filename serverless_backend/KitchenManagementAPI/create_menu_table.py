import json
import boto3
from botocore.exceptions import ClientError

dynamoClient = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    table_name = 'menu'
    
    try:
        table_created = dynamoClient.create_table(
            TableName = table_name,
            KeySchema = [
                {
                    'AttributeName': 'dish_id',
                    'KeyType': 'HASH'
                },
                ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'dish_id',
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
        raise err
