import * as actionTypes from '../actionTypes/actionTypes';
import { LOGIN } from '../../utils/constants';


export const authLogin = (userEmail) => {
  localStorage.setItem(LOGIN, userEmail);
  return {
    type: actionTypes.LOGIN,
    auth: userEmail
  };
}

export const authLogout = () => {
  localStorage.removeItem(LOGIN);
  return {
    type: actionTypes.LOGOUT,
    auth: null
  }
}