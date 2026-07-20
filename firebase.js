import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAJFd52U2d6wPqmnbNIGSjScBVDVuzv58",
  authDomain: "raki-bag-shop.firebaseapp.com",
  projectId: "raki-bag-shop",
  storageBucket: "raki-bag-shop.firebasestorage.app",
  messagingSenderId: "321542575164",
  appId: "1:321542575164:web:87e3ac5b436aff1dc95f39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
