const AWSObject = require('aws-sdk');
var SNSObject = new AWSObject.SNS();



async function sendEmail(emailParam) {

    return new Promise(function(resolve, reject) {

        console.log("params" + emailParam)
        SNSObject.publish(emailParam, function(err, data) {
            if (err) {
                console.log(err);
                resolve(false);
            }
            else {
                console.log(data);
                resolve(true);
            }
        });
    });
}








exports.handler = async (event) => {


    let emailData = JSON.parse(event.body);

    let email = emailData.email;
    let cipherKey = emailData.key;
    let topicArn = "arn:aws:sns:us-east-1:618354516012:emailNotification";

    let message = "You are registred succesfully.Here is your cipherKey: " + cipherKey + ". Please user this cipher key for three step ";
    let subject = "Cipher key notification";

    var emailParam = {
        Message: message,
        MessageAttributes: {
            'email': {
                DataType: 'String',

                StringValue: email
            }

        },
        MessageStructure: 'string',
        Subject: subject,
        TopicArn: topicArn
    };


    await sendEmail(emailParam);


    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify({emailSent:true
}),
    };
    return response;
};
