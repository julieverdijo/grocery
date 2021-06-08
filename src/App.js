import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Login from './containers/Login/Login';
import GroceryDashboard from './containers/GroceryDashboard/GroceryDashboard';
import ViewGrocery from './containers/ViewGrocery/ViewGrocery';
import Register from './containers/Register/Register';
import PrivateRoute from './utils/helpers';
import { firebaseAuth } from './firebase';
import { authLogin } from './redux/actions/auth';
import { authLogout } from './redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.login.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // useEffect(() => {
  //   firebaseAuth.onAuthStateChanged(function(user) {
  //     if (user) {
  //       dispatch(authLogin(user.email));
  //       // <Redirect to="/" />
  //       console.log('user signed in');
  //       setIsLoggedIn(true);
  //     } else {
  //       dispatch(authLogout());
  //       console.log('user signed out');
  //       setIsLoggedIn(false);
  //     }
  //   });
  // });

  console.log(auth)
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
