import json
from google.cloud import firestore
import random
from flask import jsonify


def getFeedbackPercent(requests):
    collection_name = 'user_feedback'
    # fetch the user email id  and check what task is requested
    request_args = requests.args
    request_json = requests.get_json(silent=True)

    ###################################################
    # Set CORS headers for the preflight request
    if requests.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Origin': '*'
    }
    flag, feedback_dict = connect_firestore_collection(collection_name)
    if flag:
      return (jsonify(feedback_dict),200,headers)
    else:
      return (jsonify({"error": "Something went wrong!!", "status":400}),400,headers)


def connect_firestore_collection(collection_name):
    # Read collection
    db = firestore.Client()
    docs = db.collection(collection_name).stream()
    total = 0
    sum = 0
    for doc in docs:
        total += 1
        feedback_dict = doc.to_dict()
        sum += feedback_dict['score']
    positive_percentage = sum / total * 100
    return True, {"positive_feedback_prcnt": positive_percentage}