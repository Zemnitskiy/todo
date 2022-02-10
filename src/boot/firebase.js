import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCICjpG6kt2q08ajfJUw5rNE3cmUzW7OJk",
  authDomain: "to-do-d57eb.firebaseapp.com",
  projectId: "to-do-d57eb",
  storageBucket: "to-do-d57eb.appspot.com",
  messagingSenderId: "994864761905",
  appId: "1:994864761905:web:8afd33c6edbb0ed3571910",
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);

// Get a reference to the database service
let db = getFirestore();

export default db;
