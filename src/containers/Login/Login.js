import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { firebaseAuth } from '../../firebase';
import { authLogin } from '../../redux/actions/auth';
import { Link } from 'react-router-dom';
import './Login.scss';


const Login = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();
	const dispatch = useDispatch();
	const [formValid, setFormValid] = useState(true);
	const [errors, setErrors] = useState({
    email: '',
    password: '',
    message: '',
  });

	const handleChange = (e) => {
		if(e.target.name === 'email') {
			setEmail(e.target.value);
		}
		else {
			setPassword(e.target.value);
		}
	}

	const authenticateUser = (email, password) => {
		firebaseAuth.signInWithEmailAndPassword(email, password)
	  .then((userCredential) => {
	    let user = userCredential.user;
	    dispatch(authLogin(user.email));
	    history.push('/');
	  })
	  .catch((error) => {
	    console.log(error);
	    setErrors((prevState) => ({
	        ...prevState,
	        message: error.message,
	    }))
	  });

	}

	const handleValidation = (name, value) => {
		let _errors = errors;
		const validEmailRegex = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
		switch(name) {
			case 'email':
			_errors.email = value.length === 0 ? 'Please add email' : validEmailRegex.test(value) ? '' : 'Email is not valid';
				break;
      case 'password':
       _errors.password = value.length === 0 ? 'Add Password' : (value.length < 6 ) ? 'Password must be 6 characters long' : ''
        break;
      default:
        break;
		}
		setErrors((prevState) => ({
        ...prevState,
        ..._errors
    }))
	}

	const handleBlur = (e) => {
		handleValidation(e.target.name, e.target.value);
	}

	useEffect(() => {
		let valid = true;
		Object.values(errors).forEach(val => val.length > 0 && (valid = false));
		setFormValid(valid);
	}, [errors])

	useEffect(() => {
		if(email === '' && password === '') {
			setFormValid(false);
		}
	},[email, password])

	return (
		<div className="login-wrapper">
		<div className={'login-form'}>
			<h2 className="login-heading">Login</h2>
			<div className={'form-field'}>
				<label className={'form-label'}>Email</label>
				<input 
					type="text"
					className={'form-input'}
					name="email"
					onChange={handleChange}
					onBlur={handleBlur}
					autoComplete="email"
				/>
				{errors.email ? <p className="form-error">{errors.email}</p>
          : null
        }
			</div>
			<div className={'form-field'}>
				<label className={'form-label'}>Password</label>
				<input 
					type="password" 
					className={'form-input'}
					name="password"
					onChange={handleChange}
					onBlur={handleBlur}
					autoComplete="password"
				/>
				{errors.password ? <p className="form-error">{errors.password}</p>
          : null
        }
			</div>
			<div className={'form-field'}>
				<button 
					className={'form-button'}
					disabled={!formValid ? true: false}
					onClick={() => authenticateUser(email, password)}
				>
					Login
				</button>
				<p>No account yet? <Link to="/register">Register here</Link></p>
				<p className="error-message">{errors.message}</p>
			</div>
		</div>
		</div>
	)
	
}

export default Login;