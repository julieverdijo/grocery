import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAB3WrpBuuzwus2ZaPq6OgSeKjc78wSlf8",
	authDomain: "grocery-dac76.firebaseapp.com",
	projectId: "grocery-dac76",
	storageBucket: "grocery-dac76.appspot.com",
	messagingSenderId: "248564756776",
	appId: "1:248564756776:web:c961b4011889e2aa28a01d",
	measurementId: "G-XQ5L97712G"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const firebaseAuth = firebase.auth();
export const firebaseDB = firebase.firestore();
export const fb = firebase.firestore;