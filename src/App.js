import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />}>
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;