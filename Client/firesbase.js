// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "chopnow-a30ab.firebaseapp.com",
  projectId: "chopnow-a30ab",
  storageBucket: "chopnow-a30ab.appspot.com",
  messagingSenderId: "156146337402",
  appId: "1:156146337402:web:7ce14e98167c8edff99dc3",
  measurementId: "G-2VGKG79B53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth}