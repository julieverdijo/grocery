import React from 'react';
import { firebaseAuth } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authLogout } from '../../redux/actions/auth';


const Logout = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const handleLogout = () => {
		firebaseAuth.signOut().then(() => {
		  dispatch(authLogout());
		  history.push('/login');
		}).catch((error) => {
		  console.log(error);
		});
	}
	
	return (
		<div>
			<button onClick={handleLogout} className="grocery-btn-default">Logout</button>
		</div>
	)
}

export default Logout;