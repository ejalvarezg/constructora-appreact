// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Objeto de configuración provisto por la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDA3t-hTE8rBLYWys-APYtLPqmNrPkRhnw",
  authDomain: "constructora-reactjs.firebaseapp.com",
  projectId: "constructora-reactjs",
  storageBucket: "constructora-reactjs.firebasestorage.app",
  messagingSenderId: "1015807313291",
  appId: "1:1015807313291:web:81e29140c9a19be7ba1b8e"
};

// Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Representamos y exportamos la base de datos para usarla en los componentes
export const db = getFirestore(app);