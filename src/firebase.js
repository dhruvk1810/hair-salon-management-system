// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2Q3b5ymo3HSnlYqAYHn4JY50H1mG291g",
  authDomain: "hsmsystem-57b58.firebaseapp.com",
  projectId: "hsmsystem-57b58",
  storageBucket: "hsmsystem-57b58.firebasestorage.app",
  messagingSenderId: "91093867567",
  appId: "1:91093867567:web:99bca49bfb8bb65d16fada",
  measurementId: "G-V7XFZTWW4R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };