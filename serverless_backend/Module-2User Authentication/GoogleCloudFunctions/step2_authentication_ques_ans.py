import json
from google.cloud import firestore
import random
from flask import jsonify

def authentication_step2(requests):
    collection_name = u'users_question_answer'
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
    ###################################################
    # handle params in url
    if request_args and "email" in request_args and "task" in request_args:
        email = request_args['email']
        task = request_args['task']
    # handle params in json body
    elif request_json and "email" in request_json and "task" in request_args:
        email = request_json['email']
        task = request_json['task']
    else:
        email = None
        task = None

    if task == "READ":
        random_question = 'q' + str(random.randint(1, 3))
        flag, ques, ans = connect_firestore_collection(collection_name, email, random_question)
        if flag:
            return (jsonify({"email":email, "question":ques, "answer":ans, "status":200}),200,headers)
        else:
            return (jsonify({"email":email, "error": "Email Not Found", "status":400}),200,headers)
    elif task == "WRITE":
        if request_args and 'ques_ans_values' in request_args:
            doc_value = request_args['ques_ans_values']
        elif request_json and 'ques_ans_values' in request_json:
            doc_value = request_json['ques_ans_values']
        else:
            return (jsonify({"error":"'ques_ans_values' key NOT FOUND. THIS KEY IS MANDATE IF THE TASK IS WRITE OPERATION.", "status":400}),200,headers)

        # firestore details here
        db = firestore.Client()
        doc_ref = db.collection(collection_name).document(email)
        d = json.loads(doc_value)
        doc_ref.set(d)
        return (jsonify({"message": "Inserted Successfully in the Collection.", "status":200}),200,headers)
    else:
        return (jsonify({"message": "Invalid Email or Task Received from frontend. Should be either READ or WRITE (all in caps)", "status":400}),200,headers)


# Connect to Firestore collection and fetch data
# Read any collection documents
def connect_firestore_collection(collection_name, email_id, q_number):
    # Read collection
    db = firestore.Client()
    users_ref = db.collection(collection_name).document(email_id)
    doc = users_ref.get()
    if doc.exists:
        result_dict = doc.to_dict()
        random_question = result_dict[q_number]["question"]
        answer = result_dict[q_number]["answer"]
        return True, random_question, answer
    else:
        return False, "", ""

