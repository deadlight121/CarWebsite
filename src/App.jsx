import "./App.css";
import { apiJwtToken } from "./api-token.js";

function App() {
  const HandleClick = async () => {
    try {
      const res = await fetch("/api/makes", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiJwtToken}`, // пока локально можно
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
    } finally {
    }
  };

  return (
    <>
      <div>
        <button onClick={HandleClick}>here</button>
      </div>
    </>
  );
}

export default App;
