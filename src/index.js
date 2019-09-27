import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Firebase, { FirebaseContext } from "./components/Firebase";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "../node_modules/sweetalert2/dist/sweetalert2.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

function onUpdateHandler(registration) {
  // Make sure that any new version of a service worker will take over the page
  // and become activated immediately.
  const waitingServiceWorker = registration.waiting;
  if (waitingServiceWorker) {
    waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
  }

  const link = document.createElement("a");
  link.classList.add("update-notification");
  link.setAttribute("href", "#");
  link.innerHTML =
    "Update is available. please close this app and open it again.";

  link.addEventListener("click", e => {
    e.preventDefault();
    window.location.reload();
  });

  document.querySelector("body").appendChild(link);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: onUpdateHandler
});
