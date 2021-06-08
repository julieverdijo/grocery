import * as actionTypes from '../actionTypes/actionTypes';
import { firebaseAuth } from '../../firebase';
import { LOGIN } from '../../utils/constants';



const initialState = {
  auth: localStorage.getItem(LOGIN),
};


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        auth: action.auth
      }
    case actionTypes.LOGOUT:
      return {
        ...state,
        auth: null
      }
    default:
      return state;
  }
}

export default reducer;