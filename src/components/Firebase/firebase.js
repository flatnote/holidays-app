import "firebase/auth";
import "firebase/database";
import "firebase/messaging";
import "firebase/firestore";

import app from "firebase/app";
import { module } from "./detectDevice";

const firebaseConfig = {
  apiKey: "AIzaSyD68cwiSy_j9GGUCGWo8zJCNkTE5UPvVvw",
  authDomain: "holidays-a62c9.firebaseapp.com",
  databaseURL: "https://holidays-a62c9.firebaseio.com",
  projectId: "holidays-a62c9",
  storageBucket: "holidays-a62c9.appspot.com",
  messagingSenderId: "165226763574",
  appId: "1:165226763574:web:cf1e9e857ee2fe8f428f97",
  measurementId: "G-KTTMTJ7P8L",
};

const iOS = () => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") !== -1) {
    if (ua.indexOf("chrome") > -1) {
      return false; // Chrome
    } else {
      return true; // Safari
    }
  }

  return false;
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    console.log(iOS() || isSafari());
    this.auth = app.auth();
    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.messaging = iOS() || isSafari() ? null : app.messaging();
    this.firestore = app.firestore();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  user = (uid) => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  chatMessage = () => this.db.ref("message");

  events = () => this.db.ref("events");

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then((snapshot) => {
            // const dbUser = snapshot.val();

            // // default empty roles
            // if (!dbUser.roles) {
            //   dbUser.roles = [];
            // }

            // // merge auth and db user
            // authUser = {
            //   uid: authUser.uid,
            //   email: authUser.email,
            //   ...dbUser
            // };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  askForPermissioToReceiveNotifications = async () => {
    try {
      if (this.messaging) {
        await this.messaging.requestPermission();
        const token = await this.messaging.getToken();
        // console.log("token is:", token);

        const e = module.init();

        this.firestore
          .collection("fcmTokens")
          .doc(token)
          .set({
            uid: this.auth.currentUser.uid,
            navigator: {
              userAgent: navigator.userAgent,
              appVersion: navigator.appVersion,
              platform: navigator.platform,
              vendor: navigator.vendor,
            },
            os: { ...e.os },
            browser: { ...e.browser },
          });

        return token;
      }
      return null;
    } catch (error) {
      console.error(error);
    }
  };

  onMessage = () => {
    if (this.messaging) {
      this.messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
      });
    }
  };
}

export default Firebase;
