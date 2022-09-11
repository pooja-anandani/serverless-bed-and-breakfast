/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.updateFcm = (req, res) => {

  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', '*');
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Request-Headers', '*');
  res.set('Access-Control-Max-Age', '86400');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.status(204).send('');
    return;
  }

  const request = req.body;
  const email = request.email;
  const fcm = request.fcm;

  const admin = require("firebase-admin");
  const db = require("./db");

  const usersDb = db.collection('userfcm');
  const docRef = usersDb.doc(request.email);
  const fcmBody = {
    fcm: fcm
  }
  docRef.set(fcmBody).then((results) => {
    console.log('FCM Added');
  }).catch((err) => {
    console.log(err);
  });

  const response = {
    status: 200,
    message: 'Fcm updated'
  }
  res.status(200).send(response);
};

