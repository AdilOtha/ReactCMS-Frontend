import './App.css';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import { Route, Switch } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { NonProtectedRoute } from "./components/Auth/NonProtectedRoute";

function App() {
  return (
    <div className="App">
      <Switch>
        <NonProtectedRoute exact path="/" component={Login} />
        <NonProtectedRoute exact path="/register" component={Register} />        
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default App;
