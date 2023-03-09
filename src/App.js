import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products"
import ipConfig from "./ipConfig.json";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Checkout from "./components/Checkout";
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path="/" exact>
              <Products />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/checkout">
              <Checkout />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
