from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from google.cloud import firestore
from flask import jsonify
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords


def predict_text_sentiment_analysis_sample(requests):
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
    if request_args and "feedback" in request_args and "email" in request_args:
        feedback = request_args['feedback']
        email = request_args['email']
    # handle params in json body
    elif request_json and "feedback" in request_json and "email" in request_args:
        feedback = request_json['feedback']
        email = request_args['email']
    else:
        feedback = None
        email = None
        return (jsonify({"message": "Something went wrong", "status":400}),400,headers)
        
    # remove stopwords from content
    STOPWORDS = set(stopwords.words('english'))
    content =  ' '.join([word for word in feedback.split() if word not in STOPWORDS])
    # content = "The Chicago Bears is a great football team!"
    api_endpoint = "us-central1-aiplatform.googleapis.com"
    project="754849930108"
    endpoint_id="2632872951686365184"
    location="us-central1"
    client_options = {"api_endpoint": api_endpoint}
    client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
    instance = predict.instance.TextSentimentPredictionInstance(content=content,).to_value()
    instances = [instance]
    parameters_dict = {}
    parameters = json_format.ParseDict(parameters_dict, Value())
    endpoint = client.endpoint_path(project=project, location=location, endpoint=endpoint_id)
    response = client.predict(endpoint=endpoint, instances=instances, parameters=parameters)
    print(" deployed_model_id:", response.deployed_model_id)
    predictions = response.predictions
    for prediction in predictions:
        print(" prediction:", dict(prediction))
        print(prediction['sentiment'])

    # insert feedback firestore
    doc_value = {"feedback": feedback, "score": prediction['sentiment']}
    load_feedback_firestore("user_feedback", email, doc_value)

    return (jsonify({"message": "Prediction completed.", "status":200, "score": prediction['sentiment']}),200,headers)


# [END aiplatform_predict_text_sentiment_analysis_sample]

def load_feedback_firestore(collection_name, email, doc_value):
    db = firestore.Client()
    doc_ref = db.collection(collection_name).document(email)
    doc_ref.set(doc_value)