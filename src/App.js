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
import Thanks from "./components/Thanks";
export const config = {
  endpoint: `https://qkart-frontend-vj56.onrender.com/api/v1`,
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
            <Route path="/thanks">
              <Thanks />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
