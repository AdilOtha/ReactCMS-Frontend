// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIZMSfiAIGvX9jMKzAi1wntDEN3HhQtnM",
  authDomain: "react-blog-app-668d1.firebaseapp.com",
  projectId: "react-blog-app-668d1",
  storageBucket: "react-blog-app-668d1.appspot.com",
  messagingSenderId: "361417206521",
  appId: "1:361417206521:web:68798d08ffee19b64c9028"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;