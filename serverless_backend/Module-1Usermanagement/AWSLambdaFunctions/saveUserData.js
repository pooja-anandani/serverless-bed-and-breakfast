const AWS = require('aws-sdk');



var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});



async function saveUserData(userId,cognitoId) {

    var usersdata = {
        'user_id': {
            S: userId
        },
        'cognito_id ': {
            S: cognitoId
        }
    
    };


    var params = {
        TableName: 'users',
        Item: usersdata
    };


    

    return new Promise(function(resolve, reject) {

        dynamodb.putItem(params, function(err, data) {
            if (err) {
                console.log(err)
                resolve(false);
            }
            else {
                resolve(true);
            }
        })


    });
}



exports.handler = async (event) => {
    
    
    const body = JSON.parse(event.body);
    console.log("body data is");
    console.log(body);
    
    let userid=body.userId;
    let cusid=body.cusId;
    
    console.log("inside lambda function");    
    
    let customResponse = {
        docInserted: false
    };
    
    
        try{
            
           // await saveCipherKey(userid,cognitoId,cipherKey);
            await saveUserData(userid,cusid);
            console.log("Data saved successfully");
            customResponse.docInserted=true;
            
        }catch(err){
            customResponse.docInserted=false;
            console.log("Error while inserting document in dynamodb:users");
        }
    
    
    
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(customResponse),
    };
    return response;
};
