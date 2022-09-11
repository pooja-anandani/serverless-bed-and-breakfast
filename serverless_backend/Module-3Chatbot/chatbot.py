import json
import boto3
import urllib3
import base64
client = boto3.client('dynamodb')
result = {}
intent=""
userid=""
dishid =""
quantity=""
res=""

def lambda_handler(event, context):
    intent=(event['sessionState']['intent']['name'])
    print('the intent is : ',intent)
    if intent=='Greetings':
        global userid
        userid=(event['sessionState']['intent']['slots']['userid']['value']['originalValue'])
        user(userid)
        return result
    elif intent=='foodmenu':
        menu()
        return result
    elif intent=='kitchen':
        room=(event['sessionState']['intent']['slots']['roomno']['value']['originalValue'])
        dishid=(event['sessionState']['intent']['slots']['dishid']['value']['originalValue'])
        quantity=(event['sessionState']['intent']['slots']['quantity']['value']['originalValue'])
        kitchen_order(userid,room,dishid,quantity)
        return result
    elif intent=='booking':
        room_type=(event['sessionState']['intent']['slots']['type']['value']['originalValue'])
        from_d=(event['sessionState']['intent']['slots']['from_date']['value']['originalValue'])
        to_d=(event['sessionState']['intent']['slots']['to_date']['value']['originalValue'])
        adults=(event['sessionState']['intent']['slots']['adults']['value']['originalValue'])
        child=(event['sessionState']['intent']['slots']['children']['value']['originalValue'])
        book_room(userid,room_type,from_d,to_d,adults,child)
        return result
    elif intent=='rooms':
        from_d=(event['sessionState']['intent']['slots']['from_date']['value']['originalValue'])
        to_d=(event['sessionState']['intent']['slots']['to_date']['value']['originalValue'])
        print(from_d,to_d)
        rooms_available(from_d,to_d)
        return result


def user(userid):
        url="https://utldvdhmgdkio37seuceohchji0wagxi.lambda-url.us-east-1.on.aws/"
        data = {
                 "user_id":str(userid)
                }
        param = json.dumps(data)
        http = urllib3.PoolManager()
        res = http.request('POST', url, headers={'Content-Type': 'application/json'}, body=param)
        final = res.data.decode('utf-8')
        x = final.split(",")
        final=x[1].replace("{","").replace("\"","")
        final=final.split(":")
        final=final[1].replace("}","")
        print("Final:",final)
        if final==" success":
            res="Press 1 for Menu, Press 2 for placing order, Press 3 for Searching available Room, Press 4 for Booking Room"
            global result

            result ={
                     "messages": [
                      {
                      "content": res,
                      "contentType": "PlainText"
                      }
                     ],
                     "sessionState": {
                      "dialogAction": {
                      "type": "Close"
                      },
                      "intent": {
                      "name": "Greetings",
                      "state": "Fulfilled",
                      "confirmationState": "None"
                      }
                     }
                    }
            return result
        else:
            message="Sorry I can't find your details in our records please contact our support center on 902-983-2007"
            print(message);
            result ={
                     "messages": [
                      {
                      "content": message,
                      "contentType": "PlainText"
                      }
                     ],
                     "sessionState": {
                      "dialogAction": {
                      "type": "Close"
                      },
                      "intent": {
                      "name": "Greetings",
                      "state": "Fulfilled",
                      "confirmationState": "None"
                      }
                     }
                    }
            return result

def menu():
    url="https://jxwvbh2m2visbklkd3nji57nqm0finyy.lambda-url.us-east-1.on.aws/"
    http = urllib3.PoolManager()
    res = http.request('GET', url,headers={'Content-Type': 'application/json'})
    final = res.data.decode('utf-8')
    final = json.loads(final)
    final = final["menu"]
    final = json.dumps(final)
    final =final.replace("[","").replace("{","").replace("]","").replace("},","\n").replace("}","").replace("'","").replace("\"","").replace("room_details:","").replace("S:","").replace("N:","")
    print(final)
    global result

    result ={
             "messages": [
              {
              "content": final,
              "contentType": "PlainText"
              }
             ],
             "sessionState": {
              "dialogAction": {
              "type": "Close"
              },
              "intent": {
              "name": "foodmenu",
              "state": "Fulfilled",
              "confirmationState": "None"
              }
             }
            }
    return result

def kitchen_order(userid,room,dishid,quantity):
    message='Hello ', userid, ' You are in Room Number: ',room, '.'
    msg=''.join(message)
    print(msg)
    print(dishid,quantity)
    url="https://q7rplzgt5w6ab6rcd726pr3p3q0xkarb.lambda-url.us-east-1.on.aws/"
    data = {
              "user_id": str(userid),
              "room_id": str(room),
              "order_details": [
                {
                  "dish_id": str(dishid),
                  "quantity": str(quantity)
                }
              ]
            }
    param = json.dumps(data)
    http = urllib3.PoolManager()
    res = http.request('POST', url, headers={'Content-Type': 'application/json'}, body=param)
    final = res.data.decode('utf-8')
    x = final.split(",")
    x=x[1].replace("\"","")
    x=x.split(":")
    x=x[1]
    print("K...:",x)
    res="Your Order Invoice Number is :"+x
    global result

    result ={
             "messages": [
              {
              "content": res,
              "contentType": "PlainText"
              }
             ],
             "sessionState": {
              "dialogAction": {
              "type": "Close"
              },
              "intent": {
              "name": "kitchen",
              "state": "Fulfilled",
              "confirmationState": "None"
              }
             }
            }
    return result
            
def book_room(userid,room_type,from_d,to_d,adults,child):
    url1="https://b2oyp36udfmiumo4dipadmlqqe0xmvwl.lambda-url.us-east-1.on.aws/"
    data1={
         "date_from": str(from_d),
         "date_to": str(to_d)
    }
    param1 = json.dumps(data1)
    http = urllib3.PoolManager()
    res1 = http.request('POST', url1, headers={'Content-Type': 'application/json'}, body=param1)
    final1 = json.loads(res1.data.decode('utf-8'))
    final2=final1.get("room_details")
    for i in final2:
        print(i)
        if(room_type==i.get("room_type")):
            room_details_final=i
            break
    url="https://cyu6sjpffpdxrxaltsrw5wdjfi0lbkjn.lambda-url.us-east-1.on.aws/"
    data={
         "room_number": room_details_final.get("room_number"),
         "from_date": str(from_d),
         "to_date": str(to_d),
         "user_id": str(userid),
         "adults": adults,
         "children": child,
         "booking_origin":"bot"
    }
    param = json.dumps(data)
    print("Line 212...:",param)
    http = urllib3.PoolManager()
    res = http.request('POST', url, headers={'Content-Type': 'application/json'}, body=param)
    final = res.data.decode('utf-8')
    print("Final....:",final)
    x = final.split("y")
    y = x[2].split(",")
    z=y[0].split("\"")
    res="Your Booking Number"+z[3]
    global result
    
    result ={
             "messages": [
              {
              "content": res,
              "contentType": "PlainText"
              }
             ],
             "sessionState": {
              "dialogAction": {
              "type": "Close"
              },
              "intent": {
              "name": "booking",
              "state": "Fulfilled",
              "confirmationState": "None"
              }
             }
            }
    return result
            
def rooms_available(from_d,to_d):
        url="https://b2oyp36udfmiumo4dipadmlqqe0xmvwl.lambda-url.us-east-1.on.aws/"
        data={
             "date_from": str(from_d),
             "date_to": str(to_d)
        }
        param = json.dumps(data)
        print(param)
        http = urllib3.PoolManager()
        res = http.request('POST', url, headers={'Content-Type': 'application/json'}, body=param)
        final = json.loads(res.data.decode('utf-8'))
        print("this is available room response",final)
        final=str(final['count'])
        final = final.replace("[","").replace("{","").replace("]","").replace("},","\n").replace("}","").replace("'","").replace("\"","").replace("room_details:","").replace("deluxe:","deluxe rooms").replace("suite","suite rooms").replace("family_room:","family rooms")
        final = "Number of rooms available for the given date are "+final+" Please press 4 to book a room"
        print("Final: ",final)
        global result
        
        result ={
                 "messages": [
                  {
                  "content": final,
                  "contentType": "PlainText"
                  }
                 ],
                 "sessionState": {
                  "dialogAction": {
                  "type": "Close"
                  },
                  "intent": {
                  "name": "booking",
                  "state": "Fulfilled",
                  "confirmationState": "None"
                  }
                 }
                }
        return result