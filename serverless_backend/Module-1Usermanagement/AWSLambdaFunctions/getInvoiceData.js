const AWS = require('aws-sdk');


var dynDB = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});



exports.handler = async (event) => {
    
    
    
    
    const body = JSON.parse(event.body);
    let userId = body.userId;
    let roomId = body.roomId;
    
    
    const user_room_string=userId+"_"+roomId;
    
    const filterParam = {
        // Define table to scan
        "TableName": "invoices",
        "FilterExpression": "#user_id_room_id = :user_id_room_idValue",

        "ExpressionAttributeNames": {
            "#user_id_room_id": "user_id_room_id"
        },
        "ExpressionAttributeValues": {
            ":user_id_room_idValue": { "S": user_room_string }
        }
    }
    
    
    let invoiceData=[];
    let data=null;
    let finalResponse = {
        dataFetched: false,
        invoiceList:null
    };
    
    try{
        data = await dynDB.scan(filterParam).promise();
        
        data.Items.forEach(function(invoice){
            invoiceData.push(invoice);
        });
        console.log("Data retrieved succesfully");
        finalResponse.dataFetched=true;
        finalResponse.invoiceList=invoiceData;
        
    }catch(err){
        finalResponse.dataFetched=false;
        console.log("Erro while retrieving data");
    }
    
    
    
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(finalResponse),
    };
    return response;
};
