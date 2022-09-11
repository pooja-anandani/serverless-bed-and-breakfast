// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ReactSession } from 'react-client-session';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmdSd--Sodp4knTdxf8WO9dm03eeHKDks",
  authDomain: "serverless-project-356720.firebaseapp.com",
  projectId: "serverless-project-356720",
  storageBucket: "serverless-project-356720.appspot.com",
  messagingSenderId: "469039084743",
  appId: "1:469039084743:web:a42af82c682226a9597ae2",
  measurementId: "G-86815MTDRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging();
export const requestForToken = () => {
  ReactSession.setStoreType('localStorage');
  return getToken(messaging, { vapidKey: 'BGzxl1H7ceQmhAzjEW2FZQm9jZlrKnWOYto7-79lNqONao0VGOrok_5_Vbolz0Bl_GuKPzEvB29spTjXRI-17cI' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);

        const email = ReactSession.get('email');
        if (email && email !== '') {
          const requestBody = {
            email: email,
            fcm: currentToken
          }
          axios.post('https://us-central1-serverless-project-356720.cloudfunctions.net/updateFCM', requestBody).then((response) => {
            if (response.status === 200) {
              console.log('FCM Updated');
            } else {
              console.log('FCM Update failed');
            }
          }).catch((err) => {
            console.log(err);
            console.log('FCM Update failed');
          });
        }

        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });