import json
import re
import boto3
import simplejson as json
import pandas as pd
from google.cloud import storage

storage_client = storage.Client()

def hello_world(request):
    session = boto3.Session(
        aws_access_key_id='ASIAY76GNEAWI76MQELT',
        aws_secret_access_key='0IUnhhC4tyTsAEGIMYkCwiQMDcn+RZHS5mw5awek',
        aws_session_token='FwoGZXIvYXdzEDQaDKnm8HgCcIfZ9fQtQSLAAZh6KincQPJlDtcw24y7ny0J3cBPCTdeDhjHk1TtmqKV8X/cObMmjgPZMNAIz+MdVuEC8ktb0Ax390yIu8+PzLfB594dKU14P1ZcJfI89X5+PDNcq0p6yjoM7wULM1Qopv9fyq3deUm41qHFhuWC2kdxzT82MBoLkZ6iwkQiaoQ6QGuoJOh0lio7yUal4qOPXehCindAWpQ3Cl9mld/gDaqlZpJXwBFHWP8pgotksnNdc5bHoyFXGitCOP02xiCQPyiltu2WBjItjl09LBaa60j0Y7G9b1ZdBp/k4IbNzqWEbZDEE5Nn4mt/yyZEw72PFfE31ym9',
        region_name='us-east-1'
    )
    dynamodb = session.resource('dynamodb')
    bucket = storage_client.get_bucket('visualization-bucket-b00871849')
    
    order_table = dynamodb.Table('userlogs')
    order_response = order_table.scan()
    result1 = order_response['Items']
    df1 = pd.DataFrame(result1)
    file_name ='/tmp/userlogs.csv'
    df1.to_csv(file_name, index=False)
    blob = bucket.blob('userlogs.csv')
    blob.upload_from_filename(file_name)
    
    return {
        'statusCode': 200,
        'message': 'Files uploaded to cloud storage!'
    }
