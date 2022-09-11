import json
import logging
import boto3
import uuid
import random
from datetime import datetime
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.INFO)

detailtable = "room_details"
bookingtable = "room_booking"
dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
dynamo_detail_table = dynamodb.Table(detailtable)
dynamo_booking_table = dynamodb.Table(bookingtable)

def lambda_handler(event, context):
    try:
        occupied_rooms = []
        room_available = []
        room_types={
            "deluxe":0,
            "suite":0,
            "family_room":0
        }
        body = json.loads(event["body"])
        booking_details = dynamo_booking_table.scan(FilterExpression='date_from = :i  AND date_to = :s',
        ExpressionAttributeValues = {':i' : body.get("date_from"), ':s' : body.get("date_to")})
        for book in booking_details["Items"]:
            occupied_rooms.append(book["room_number"])
        room_list = dynamo_detail_table.scan().get("Items")
        for room in room_list:
            if room.get("room_number") not in occupied_rooms:
                room_available.append(room)
                room_types[room.get("room_type")]+=1
                
                
        return {
            'statusCode': 200,
            'body':{
                "room_details":room_available,
                "count":room_types
                
            }
        }
    except Exception as e:
        print(e)
        return { 
            'statusCode':500, 
            'body': 'Internal server error'
            }
