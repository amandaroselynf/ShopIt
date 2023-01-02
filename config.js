import firebase from 'firebase/compat/app';
// import { initializeApp } from "firebase/app";
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
  
  if (!firebase.apps.length) 
  {
      firebase.initializeApp(firebaseConfig)
    } else {
      firebase.app()
    }
   
  export { firebase };
  