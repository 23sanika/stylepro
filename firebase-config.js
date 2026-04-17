const firebaseConfig = {
  apiKey: "AIzaSyDheuebTPhiiTVos6EmsdnicxjU4XtCiXc",
  authDomain: "stylepro-36485.firebaseapp.com",
  projectId: "stylepro-36485",
  storageBucket: "stylepro-36485.firebasestorage.app",
  messagingSenderId: "503903603703",
  appId: "1:503903603703:web:81ac16b7933c08f2d4fcf2",
  measurementId: "G-8Z2KPFQ1T9"
};

// Initialize Firebase (Compat Version)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
