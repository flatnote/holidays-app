import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC5bPhG7665uJceRNV0v3yrbNqTEBrlH2Y",
  authDomain: "react-chat-628e6.firebaseapp.com",
  databaseURL: "https://react-chat-628e6.firebaseio.com",
  projectId: "react-chat-628e6",
  storageBucket: "react-chat-628e6.appspot.com",
  messagingSenderId: "647454043009",
  appId: "1:647454043009:web:aee4e243cdcfcad2"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider();
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
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  askForPermissioToReceiveNotifications = async () => {
    try {
      const messaging = app.messaging();
      await messaging.requestPermission();
      const token = await messaging.getToken();
      // console.log("token is:", token);

      return token;
    } catch (error) {
      console.error(error);
    }
  };
}

export default Firebase;
