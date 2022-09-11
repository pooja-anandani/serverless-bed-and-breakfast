/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = async (event, context) => {

    var admin = require("./firebaseAdmin");
    const db = require("./db");

    const message = event.data
        ? Buffer.from(event.data, 'base64').toString()
        : 'Invalid Message';
        
    console.log('MESSAGE RECIEVED FROM PUB SUB !!');
    console.log(message);

    const request = JSON.parse(message);
    const email = request.email;
    let fcm;

    const getFcm = () => {
        return new Promise(resolve => {
            const usersDb = db.collection('userfcm');
            const docRef = usersDb.doc(request.email);
            docRef.get().then((results) => {
                if (results.exists) {
                    const data = results.data();
                    fcm = data.fcm;
                    console.log('FCM Fetched!')
                    resolve();
                }
            }).catch((err) => {
                console.log(err);
                resolve();
            });
        });
    }

    const sendNotification = () => {
        return new Promise(resolve => {
            console.log('Sending notification');
            var payload = {
                notification: {
                    title: "Message from Kitchen!",
                    body: "Your food is ready!"
                },
                data: {
                    email: email,
                    order_id: request.order_id.toString()
                }
            };

            var options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
            };

            console.log('FCM IS ' + fcm);
            const res = admin.messaging().sendToDevice(fcm, payload, options)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                    return;
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                    return;
                });
        });
    }

    await getFcm();
    await sendNotification();
    console.log('Message sent scuccessfully !');
};

