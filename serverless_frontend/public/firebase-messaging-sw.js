importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDmdSd--Sodp4knTdxf8WO9dm03eeHKDks",
    authDomain: "serverless-project-356720.firebaseapp.com",
    projectId: "serverless-project-356720",
    storageBucket: "serverless-project-356720.appspot.com",
    messagingSenderId: "469039084743",
    appId: "1:469039084743:web:a42af82c682226a9597ae2",
    measurementId: "G-86815MTDRZ"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});