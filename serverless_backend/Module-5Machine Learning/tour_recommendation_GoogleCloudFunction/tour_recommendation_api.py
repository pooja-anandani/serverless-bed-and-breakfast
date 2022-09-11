from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from google.cloud import firestore
from flask import jsonify
import nltk
import pandas as pd
nltk.download("stopwords")
# [START aiplatform_predict_tabular_classification_sample]
from typing import Dict

def hello_world(requests):
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
    ###################################################
    if request_args and "duration" in request_args:
        duration = request_args['duration']
    # handle params in json body
    elif request_json and "duration" in request_json:
        duration = request_json['duration']
    else:
        duration = None
        return (jsonify({"message": "Something went wrong", "status":400}),400,headers)
    api_endpoint = "us-central1-aiplatform.googleapis.com"
    project="316308500182"
    endpoint_id="166694758863863808"
    location="us-central1"
    instance_dict = { "duration": duration}
    client_options = {"api_endpoint": api_endpoint}
    client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
    instance = json_format.ParseDict(instance_dict, Value())
    instances = [instance]
    parameters_dict = {}
    parameters = json_format.ParseDict(parameters_dict, Value())
    endpoint = client.endpoint_path(project=project, location=location, endpoint=endpoint_id)
    response = client.predict(endpoint=endpoint, instances=instances, parameters=parameters)
    print(" deployed_model_id:", response.deployed_model_id)
    predictions = response.predictions
    for prediction in predictions:
        print(" prediction:", dict(prediction))
        print(prediction)

    df = pd.DataFrame(dict(prediction))
    tour_class = df['classes'].iloc[df[['scores']].idxmax()]
    flag, recommended_tour = connect_firestore_collection("tour_package_details", tour_class.values[0])
    print(recommended_tour)
    return (jsonify(recommended_tour),200,headers)


# Connect to Firestore collection and fetch data
# Read any collection documents
def connect_firestore_collection(collection_name, tour_class):
    # Read collection
    db = firestore.Client()
    users_ref = db.collection(collection_name).document(tour_class)
    doc = users_ref.get()
    if doc.exists:
        result_dict = doc.to_dict()
        return True, result_dict
    else:
        return False, {}