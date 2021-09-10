import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './containers/Login/Login';
import GroceryDashboard from './containers/GroceryDashboard/GroceryDashboard';
import ViewGrocery from './containers/ViewGrocery/ViewGrocery';
import Register from './containers/Register/Register';
import PrivateRoute from './utils/helpers';
import './App.scss';

const App = () => {
  return (
    <div className={'grocery'}>
      <div className={'grocery-wrap'}>
        <div className={'grocery-lines'}>
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
        <div className={'grocery-ballpen'}>
          <div></div>
        </div>
        <BrowserRouter>
          <PrivateRoute path="/" exact component={GroceryDashboard} /> 
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/view-grocery" exact component={ViewGrocery} />
          
        </BrowserRouter>
      </div>
    </div>
  
  );
}

export default App;
