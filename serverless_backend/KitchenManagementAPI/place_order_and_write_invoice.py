import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime

dynamoClient = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    body = json.loads(event['body'])
    
    data = json.loads(json.dumps(body))
    
    order_length = len(data['order_details'])
    
    dishes = data['order_details']

    try:
        response1 = dynamoClient.scan(TableName = 'food_orders', ConsistentRead = True)
        item_count = response1['Count']
        new_order = int(item_count) + 1
        
        order = {
            'order_details': {
                'L': []
            },
            'order_id': {
                'N': str(new_order)
            },
            'user_id': {
                'S': data['user_id']
            },
            'room_id': {
                'N': data['room_id']
            },
            'order_status': {
                'S': 'Preparing'
            },
            'ordered_at': {
                'S': str(datetime.now())
            },
        }
        
        for obj in data['order_details']:  
            order['order_details']['L'].append({
                'M': {
                    'dish_id': {
                        'N': str(obj['dish_id'])
                    },
                    'quantity': {
                        'N': str(obj['quantity'])
                    }
                }
            })

        response2 = dynamoClient.put_item(TableName = 'food_orders',
                Item = order,
                ConditionExpression = 'attribute_not_exists(order_id)'
        )
        
        if response2['ResponseMetadata']['HTTPStatusCode'] == 200:
            response3 = dynamoClient.scan(TableName = 'menu', ConsistentRead = True)
            order_amount = 0
            
            for obj in data['order_details']:
                for item in response3['Items']:
                    if obj['dish_id'] == item['dish_id']['N']:
                        order_amount = order_amount + float(item['price']['N'])*float(obj['quantity'])
                        
            x = datetime.now()
            y = str(x.strftime("%M")) + str(x.strftime("%S")) + str(x.strftime("%f"))
            
            response4 = dynamoClient.put_item(TableName = 'invoices',
                    Item = {
                        'invoice_id': {
                            'N': y
                        },
                        'user_id_room_id': {
                            'S': str(data['user_id']) + "_" + str(data['room_id'])
                        },
                        'order_id': {
                            'N': str(new_order)
                        },
                        'invoice_amount': {
                            'N': str(order_amount)
                        },
                        'created_at': {
                            'S': str(datetime.now())
                        }
                        
                    },
                    ConditionExpression = 'attribute_not_exists(invoice_id)'
            )
        else:
            return (json.dumps({ 
            'statusCode':500, 
            'body': 'Internal server error'
            }))
        
        return (json.dumps({'statusCode': 200,
                'order_id': new_order,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'message': 'Order placed and invoice generated successfully!'}))
                
    except Exception as e:
        print(e)
        return (json.dumps({ 
            'statusCode':500, 
            'body': 'Internal server error'
            }))
