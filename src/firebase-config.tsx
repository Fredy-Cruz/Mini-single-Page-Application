import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // Importa getDatabase

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY, 
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // Crea una instancia de Firebase Realtime Database
