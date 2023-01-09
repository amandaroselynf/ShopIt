import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
// import {
//   getFirestore
// } from "firebase/firestore"
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9IUcJuYPQHsfS53M1ehrGVAGzcw3XSh4",
    authDomain: "reactnativempma.firebaseapp.com",
    projectId: "reactnativempma",
    storageBucket: "reactnativempma.appspot.com",
    messagingSenderId: "272523576628",
    appId: "1:272523576628:web:33709096eae82232961161"
  };
  
  // const app = initializeApp(firebaseConfig)

  // export const db = getFirestore(app)
  if (!firebase.apps.length) 
  {
      firebase.initializeApp(firebaseConfig)
  } else {
    firebase.app()
  }
  firebase.firestore().settings({ timestampsInSnapshot: true, merge: true});
  export { firebase };
  