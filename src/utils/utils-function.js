export const onUpdateHandler = (registration) => {
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

export const commonCondition = (authUser) => !!authUser;