function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeToPush(publicVapidKey) {
  const registration = await navigator.serviceWorker.ready;

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    console.log("Already subscribed:", existingSubscription);
    return;
  }

  const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  console.log("Subscribed successfully:", subscription);

  await fetch("https://2547-180-190-145-56.ngrok-free.app/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Subscription sent to backend");
}

export async function unsubscribeFromPush() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers are not supported.");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    try {
      const success = await subscription.unsubscribe();
      if (success) {
        console.log("🛑 Unsubscribed successfully:", subscription);

        await fetch("https://2547-180-190-145-56.ngrok-free.app/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        console.log("🧹 Backend unsubscribed too.");
      } else {
        console.warn("Unsubscribe failed.");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
    }
  } else {
    console.log("User is not subscribed.");
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
