import json
import boto3
from botocore.exceptions import ClientError
from pathlib import Path

dynamoClient = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    table_name = 'menu'
    filename = Path('menu_list.json').resolve()
    with open(filename) as f:
        data = json.load(f)

    try:       
        for obj in data['dishes']:
            response = dynamoClient.put_item(
                TableName = table_name,
                Item = {
                    'dish_id': {
                        'N': obj['dish_id']
                    },
                    'dish_name': {
                        'S': obj['dish_name']
                    },
                    'price': {
                        'N': obj['price']
                    }
                },
                ConditionExpression='attribute_not_exists(dish_id)'
            )
            
        return {
            'statusCode': 200,
            'body': json.dumps('Data added successfully!')
    }
    except ClientError as err:
        raise err
