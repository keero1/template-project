import { useState } from "react";
import reactLogo from "./assets/react.svg";
import appLogo from "/favicon.svg";
import PWABadge from "./PWABadge.jsx";
import "./App.css";
import { subscribeToPush, unsubscribeFromPush } from "./notification.js";

function App() {
  const [count, setCount] = useState(0);

  const handleNotifyClick = () => {
    console.log("Notification button clicked");
    subscribeToPush(
      "BMHfaVvFNdU5WUktSPJmSZPobXrvmLcZGoqdHruwJBAHu3lF44LfNIoTVFLVwX8lDTXDdmto9dfftT29cUM0zuo"
    );
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={appLogo} className="logo" alt="StudioBase logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>StudioBase</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handleNotifyClick}>Enable Notifications</button>
        <button onClick={unsubscribeFromPush}>Unsubscribe Notifications</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PWABadge />
    </>
  );
}

export default App;
