var AWSObject = require('aws-sdk');
var SNSObject = new AWSObject.SNS();



async function subscribeToTopic(params) {
    return new Promise(function(resolve, reject) {
        SNSObject.subscribe(params, function(err, data) {
            if (err) {
                resolve(false);
                console.log("Error while subscribing to topic");
            } else {
                console.log("Subscribe succesfully");
                console.log(data.SubscriptionArn);
                resolve(data.SubscriptionArn);
            }
        })
    });

}


async function setAttr(params) {
    return new Promise(function(resolve, reject) {
        SNSObject.setSubscriptionAttributes(params, function(err, data) {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                resolve(false);
            }
        })
    });

}



exports.handler = async (event) => {
    
    
    let emailData=JSON.parse(event.body);
    
    console.log(emailData.email);
    let arnLink = 'arn:aws:sns:us-east-1:618354516012:emailNotification';
    
    let body;
    let statusCode = '200';
    
    try {

        const subParam = {
            Protocol: 'email',
            TopicArn: arnLink,
            Endpoint: emailData.email,
            ReturnSubscriptionArn: true
        }
        
        console.log("before subscribeToTopic");
        var subArn =await subscribeToTopic(subParam);
        console.log(subArn);
        console.log("after subscribeToTopic");
        
        console.log("Seting subscruption topics");
        
        //Set filter policy to send email to only one user
        var filterAttr = {
            AttributeName: 'FilterPolicy',
            SubscriptionArn: subArn,
            AttributeValue: '{ \"email\": [ \"' + emailData.email + '\" ] }'
        };
        
        
        let subAttr=await setAttr(filterAttr);
          console.log("Seting subscruption attributes");
        
        body={userSub:true};
        
         
        
    } catch (error) {
        console.log(error)

    }
    return {
        statusCode,
        body
    };


};