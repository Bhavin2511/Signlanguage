import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmI5dE4PcJrFFYhKc59680addiVtHtWfo",
  authDomain: "silentvoice-8b5b2.firebaseapp.com",
  projectId: "silentvoice-8b5b2",
  storageBucket: "silentvoice-8b5b2.firebasestorage.app",
  messagingSenderId: "580467609045",
  appId: "1:580467609045:web:72208d62529d70243b015c",
  measurementId: "G-0MDCMCV1W1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;