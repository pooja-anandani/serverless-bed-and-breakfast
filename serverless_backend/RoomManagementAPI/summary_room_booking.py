import json
import boto3
from boto3.dynamodb.conditions import Key


bookingtable = "room_booking"
dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
dynamo_booking_table = dynamodb.Table(bookingtable)

def lambda_handler(event, context):
     http_method = event["requestContext"]["http"]["method"]
     if http_method=="GET":
          checkout_details = dynamo_booking_table.scan(FilterExpression= Key("is_checkout").eq(False))["Items"]
          return {'statusCode': 200, 'body': checkout_details }
     elif http_method=="POST":
          body = json.loads(event.get("body"))
          room_details = dynamo_booking_table.scan(FilterExpression= Key("user_id").eq(body.get("user_id")))["Items"]
          return {
                 'statusCode': 200,
                 'body': room_details
             }
     elif http_method=="PATCH":
          body = json.loads(event.get("body"))
          response = dynamo_booking_table.update_item(Key={'booking_id': body.get("booking_id"),"room_number":body.get("room_number")},UpdateExpression="set is_checkout = :r",
          ExpressionAttributeValues={':r': True },
          ReturnValues="UPDATED_NEW")
          return {'statusCode': 200, 'body': response }
     
