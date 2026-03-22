import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHJy4nxrVFbW8aN3w_icufQFLrTdoRp0A",
  authDomain: "numismatics-web-app.firebaseapp.com",
  projectId: "numismatics-web-app",
  storageBucket: "numismatics-web-app.firebasestorage.app",
  messagingSenderId: "118555096262",
  appId: "1:118555096262:web:073409fddac5b26ef313c7",
  measurementId: "G-FWD1S4F3RT"
};

// Initialize Firebase only if it hasn't been initialized already (necessary for Next.js SSR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
