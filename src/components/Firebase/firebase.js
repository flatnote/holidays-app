import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "holidays-a62c9.firebaseapp.com",
  databaseURL: "https://holidays-a62c9.firebaseio.com",
  projectId: "holidays-a62c9",
  storageBucket: "holidays-a62c9.appspot.com",
  messagingSenderId: "165226763574",
  appId: "1:165226763574:web:cf1e9e857ee2fe8f428f97",
  measurementId: "G-KTTMTJ7P8L"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.messaging = app.messaging();
  }

  database = () => this.db;

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  chatMessage = () => this.db.ref("message");

  events = () => this.db.ref("events");

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then(snapshot => {
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
      await this.messaging.requestPermission();
      const token = await this.messaging.getToken();
      console.log("token is:", token);

      return token;
    } catch (error) {
      console.error(error);
    }
  };

  onMessage = () => {
    this.messaging.onMessage(payload => {
      console.log("Message received. ", payload);
    });
  };
}

export default Firebase;
