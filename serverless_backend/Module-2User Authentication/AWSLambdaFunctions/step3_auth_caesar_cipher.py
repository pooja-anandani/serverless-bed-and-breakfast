import string
import boto3
from boto3.dynamodb.conditions import Key
import json


def lambda_handler(event, context):
    try:
        body = event['body']
        json_acceptable_string = body.replace("'", "\"")
        body = json.loads(json_acceptable_string)
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600'
        }
        input_word = body['input']
        key_step = body['key']
        if key_step:
            all_alphabets = (string.ascii_lowercase, string.ascii_uppercase, string.digits)

            def shift(alphabet):
                return alphabet[key_step:] + alphabet[:key_step]
        
            shifted_all_alphabets = tuple(map(shift, all_alphabets))
            joined_aphabets = ''.join(all_alphabets)
            joined_shifted_all_alphabets = ''.join(shifted_all_alphabets)
            table = str.maketrans(joined_aphabets, joined_shifted_all_alphabets)
            decrypted_word = input_word.translate(table)
            return {
                'statusCode': 200,
                'body': decrypted_word
            }
        else:
            return {
                'statusCode': 400,
                'body': "Something went wrong!"
            }
    except Exception as e:
        print(e)
        return {
            'statusCode': 404,
            'body': str(e)
        }
