import json
import re
import boto3
import simplejson as json
import pandas as pd
from google.cloud import storage

storage_client = storage.Client()

def hello_world(request):
    session = boto3.Session(
        aws_access_key_id='ASIAY76GNEAWOQEUVCUI',
        aws_secret_access_key='v9Azq7Cn8ZL+3cLsASYJDyFBczeWi5vND4k0sYec',
        aws_session_token='FwoGZXIvYXdzEOT//////////wEaDK4kmOGS+NY7DXDRHCLAAcTRDhmQC4TGHxYLNnId0/y08oOS7TGRFu1RgfLgY28Q0nGPwydHEqGuztG948OcqzSSVLaAp8E1S4I8TO7yDi1zeQcAs0hJ96abHVBrR5PKKMKxzi8ERvokCdZFjNzHC+isd1CRzj89+vJUKg8bMAKEAX+yhpj3hmhQGWMG4NiMFzBo/csY5PLkbKDKv5F7hse31dKZc9aJB7pYTT+s/aKbZkEtma/MrVFcxTT+l+VfsK6dvoEuWFg2xndSq+57pCj489uWBjItwARUBrAiJSWYoJYpoSKXYpuzTX8cVAcP9laKPDxCvNwVfG3JywFNwLWMR3eF',
        region_name='us-east-1'
    )
    dynamodb = session.resource('dynamodb')
    bucket = storage_client.get_bucket('visualization-bucket-b00871849')
    
    order_table = dynamodb.Table('food_orders')
    order_response = order_table.scan()
    result1 = order_response['Items']
    df1 = pd.DataFrame(result1)
    file_name ='/tmp/food_orders.csv'
    df1.to_csv(file_name, index=False)
    blob = bucket.blob('food_orders.csv')
    blob.upload_from_filename(file_name)

    menu = [
    {
      "dish_id": 101,
      "dish_name": "Murgh Tikka Masala",
      "price": 20.00
    },
    {
      "dish_id": 102,
      "dish_name": "French Toast Combo",
      "price": 10.00
    },
    {
      "dish_id": 103,
      "dish_name": "Fish Moilee",
      "price": 35.00
    },
    {
      "dish_id": 104,
      "dish_name": "Vegie Omelet",
      "price": 8.35
    },
    {
      "dish_id": 201,
      "dish_name": "Banana Split",
      "price": 11.00
    },
    {
      "dish_id": 202,
      "dish_name": "Apple Strudel",
      "price": 42.00
    },
    {
      "dish_id": 203,
      "dish_name": "Sticky Toffee Pudding",
      "price": 72.00
    },
    {
      "dish_id": 204,
      "dish_name": "Pancakes",
      "price": 7.35
    },
    {
      "dish_id": 301,
      "dish_name": "Spring Water",
      "price": 32.00
    },
    {
      "dish_id": 302,
      "dish_name": "Lemonade, Lemon Squash",
      "price": 18.00
    },
    {
      "dish_id": 303,
      "dish_name": "Coke, Diet Coke, Coke Zero",
      "price": 14.00
    },
    {
      "dish_id": 304,
      "dish_name": "Sparkling Mineral Water",
      "price": 38.35
    }
  ]

    output = []

    for i in range(len(df1)):
        for item in menu:
            for x in range(len(df1.iloc[i]['order_details'])):
                if int(df1.iloc[i]['order_details'][x]['dish_id']) == item['dish_id']:
                    data = {"dishname": item['dish_name'], "quantity": int(df1.iloc[i]['order_details'][x]['quantity'])}
                    output.append(data)

    df2 = pd.DataFrame(output)
    file_name2 ='/tmp/dishes_stat.csv'
    df2.to_csv(file_name2, index=False)
    blob2 = bucket.blob('dishes_stat.csv')
    blob2.upload_from_filename(file_name2)

    booking_table = dynamodb.Table('room_booking')
    booking_response = booking_table.scan()
    result2 = booking_response['Items']
    df_temp = pd.DataFrame(result2)
    df3 = df_temp['booking_origin']
    file_name ='/tmp/room_bookings.csv'
    df3.to_csv(file_name, index=False)
    blob3 = bucket.blob('room_bookings.csv')
    blob3.upload_from_filename(file_name)
    
    return {
        'statusCode': 200,
        'message': 'Files uploaded to cloud storage!'
    }
