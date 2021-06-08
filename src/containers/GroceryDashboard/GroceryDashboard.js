import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { firebaseDB, fb } from '../../firebase';
import GroceryItem from '../../components/GroceryItem/GroceryItem';
import Logout from '../Logout/Logout';
import './GroceryDashboard.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';


const GroceryDashboard = (props) => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [newItem, setNewItem] = useState('');
	const itemsArr = [];
	const auth = useSelector(state => state.login.auth);
	const [startDate, setStartDate] = useState(new Date(moment().format("YYYY-MM-DD")));
	const timestamp1 = fb.Timestamp.fromDate(new Date(startDate));
	const timestamp2 = fb.Timestamp.fromDate(new Date(moment(startDate).add(1,'days').format("YYYY-MM-DD")));

	useEffect(() => {
		const unsubscribe = firebaseDB.collection('groceries').orderBy('date', 'desc').where('date', '>', timestamp1).where('date', '<' , timestamp2).onSnapshot(snapshot => {
			const data = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}))
			setItems(data);
			setLoading(false);
		})
		return () => unsubscribe()
	},[])


	useEffect(() => {
		if(items.length) {
			setTotal(items.map(item => item.total).reduce((prev, next) => prev + next))

		}
	}, [items])
	

	const handleChange = (e) => {
		setNewItem(e.target.value);
	}

	

	const handleSubmit = (e) => {
		e.preventDefault();
		firebaseDB.collection('groceries').add({
			name: newItem,
			price: 0,
			quantity: 1,
			total: 0,
			complete: false,
			date: fb.Timestamp.fromDate(new Date()),
		})
		.then(() => {
			setNewItem('');
		})
	}

	const handleDelete = (id) => {
		console.log(id);
		firebaseDB.collection('groceries').doc(id).delete();
	}

	const handleComplete = (id, complete) => {
		firebaseDB.collection('groceries').doc(id).update({
			complete: !complete,
		})
	}

	console.log(auth);
	return (
		<>
			<div className={'grocery-content'}>
				<div className={'grocery-container'}>
					<form onSubmit={handleSubmit} className={'grocery-add-form'}>
						<div className={'grocery-heading-area'}>
							<h2 className={'grocery-heading'}>My Groceries</h2>
							
						</div>
						<div className={'grocery-add-item'}>
							<input type="text" value={newItem} onChange={handleChange} name="name" placeholder="Item name" className={'input-text grocery-input-text'}/>
							<button className={'grocery-add-item-btn'}>Add Item</button>
						</div>
					</form>
					{items.length ? loading ? <p>Loading...</p> : (
						<ul className={'grocery-list'}>
							{items.map(item => (
								<GroceryItem
									key={item.id}
									id={item.id}
									item={item}
									items={items}
									setItems={setItems}
									handleDelete={handleDelete}
									handleComplete={handleComplete}
								/>
							))}
						</ul>
					) : <p>you don't have grocery list for today, start adding</p>}
					
					

					
				</div>
			</div>
			<div className={'grocery-buttons'}>
				<Logout />
				<Link className="grocery-view-btn grocery-btn-default" to="/view-grocery">View Completed Grocery</Link>

			</div>
			<p className={'grocery-total'}><span>Grand Total:</span> {parseFloat(total).toFixed(2)}</p>
		</>
	)
}

export default GroceryDashboard;