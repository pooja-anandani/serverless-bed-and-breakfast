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
    datetimeFormat = "%Y/%M/%d"
    try:
        body = json.loads(event["body"])
        room_details = dynamo_detail_table.scan(FilterExpression= Key("room_number").eq(body.get("room_number")))

        room_price = room_details['Items'][0].get("room_price")
        room_type = room_details['Items'][0].get("room_type")
        duration = datetime.strptime(body.get("to_date"), datetimeFormat) \
                  - datetime.strptime(body.get("from_date"), datetimeFormat)
        total_price = room_price * duration.days
        booking_number = random.randint(10000,99999)
        dynamo_booking_table.put_item(
            Item={
                "booking_id": str(uuid.uuid4()),
                "booking_number": booking_number,
                "room_number": body.get("room_number"),
                "date_from": body.get("from_date"),
                "date_to": body.get("to_date"),
                "user_id": body.get("user_id"),
                "adults": body.get("adults"),
                "children": body.get("children"),
                "total_stay_price": total_price,
                "booking_origin":body.get("booking_origin"),
                "is_checkout":body.get("is_checkout")
            })
        return customResponse(201, body={
            "date_from": body.get("from_date"),
            "date_to":body.get("to_date"),
            "room_type": room_type,
            "booking_number":booking_number
        })
    except Exception as e:
        print(e)
        return customResponse(502, body="Error")


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
