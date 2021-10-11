import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

 const firebaseConfig = {
    apiKey: "AIzaSyAi961k6LqOtvlrocbIXbSPW5vWrhrsPkY",
    authDomain: "testapp-d17ff.firebaseapp.com",
    projectId: "testapp-d17ff",
    storageBucket: "testapp-d17ff.appspot.com",
    messagingSenderId: "23183655089",
    appId: "1:23183655089:web:b240c5239dd5844abe6290",
    measurementId: "G-TFXYPLL7T7"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };