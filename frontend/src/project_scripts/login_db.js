import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyC-ib62fjrfWgq7jis-8EngXAfRnEaV2t4",
  authDomain: "blood-bank-3f5d5.firebaseapp.com",
  projectId: "blood-bank-3f5d5",
  storageBucket: "blood-bank-3f5d5.appspot.com",
  messagingSenderId: "934584022747",
  appId: "1:934584022747:web:da72b3e3d80a408030befe",
};
initializeApp(firebaseConfig);
const db = getFirestore();

async function login_form() {
  const login_id = document.getElementById("login-id").value;
  const login_password = document.getElementById("Login-Password").value;
  return await login_check_admin(login_id, login_password);
}
async function login_check_admin(login_id, login_password) {
  var flag;
  const querySnapshot = await getDocs(collection(db, "AdminLogin"));
  querySnapshot.forEach((doc) => {
    if (doc.id === login_id) {
      const pass = doc.data().Password;
      if (pass === login_password) {
        flag = 1;
      } else {
        flag = 0;
        alert("login_ID and Password doesn't match.");
      }
    } else {
      flag = 0;
      alert("Login_ID invalid.");
    }
  });
  if (flag) {
    return new Promise((res) => {
      res(true);
    });
  }
  return new Promise((res) => {
    res(false);
  });
}
async function login_page() {
  return await login_form();
}

export { login_page };
