import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainContainer from "./screens";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      toast.error("Right-click is disabled.");
    };

    const handleKeyDown = (event) => {
      const keysToDisableWithCtrl = [
        "I",
        "J",
        "U",
        "C",
        "S",
        "H",
        "F",
        "P",
        "A",
      ];
      const keysToDisableWithoutCtrl = ["F12"];

      if (
        (event.ctrlKey || event.metaKey) &&
        keysToDisableWithCtrl.includes(event.key.toUpperCase())
      ) {
        event.preventDefault();
        toast.error(`Ctrl+${event.key.toUpperCase()} is disabled.`);
      }

      if (keysToDisableWithoutCtrl.includes(event.key.toUpperCase())) {
        event.preventDefault();
        toast.error(`${event.key.toUpperCase()} is disabled.`);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      <Provider store={store}>
        <MainContainer />
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
