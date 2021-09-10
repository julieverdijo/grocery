import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { firebaseDB, fb} from '../../firebase';
import { Link } from 'react-router-dom';
import './ViewGrocery.scss';

import moment from 'moment';

const ViewGrocery = () => {
	const [startDate, setStartDate] = useState(new Date(moment().format("YYYY-MM-DD")));
  const [endDate, setEndDate] = useState(null);
	const [list, setList] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const timestamp1 = fb.Timestamp.fromDate(new Date(startDate));
	const timestamp2 = fb.Timestamp.fromDate(new Date(moment(startDate).add(1,'days').format("YYYY-MM-DD")));

	useEffect(() => {
		const unsubscribe = firebaseDB.collection('groceries').where('date', '>', timestamp1).where('date', '<' , timestamp2).where('complete', '==', true)
			.onSnapshot(snapshot => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
					}))
				setList(data);
				setLoading(false);
			})
		return () => unsubscribe()
	},[])

	useEffect(() => {
		if(startDate) {
			const unsubscribe = firebaseDB.collection('groceries').where('date', '>', timestamp1).where('date', '<' , timestamp2).where('complete', '==', true)
			.onSnapshot(snapshot => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
					}))
				setList(data);
				setLoading(false);
			}, (error) => {
	       console.log(error);
	    })
	    return () => unsubscribe()
		}

		if(startDate && endDate) {
			const startDateTimestamp = fb.Timestamp.fromDate(new Date(startDate));
			const endDateTimestamp = fb.Timestamp.fromDate(new Date(moment(endDate).add(1,'days').format("YYYY-MM-DD")));
			const unsubscribeEndDate = firebaseDB.collection('groceries').where('date', '>', startDateTimestamp).where('date', '<' , endDateTimestamp).where('complete', '==', true)
			.onSnapshot(snapshot => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
					}))
				setList(data);
				setLoading(false);
			}, (error) => {
	       console.log(error);
	    })
	    return () => unsubscribeEndDate()
		}
	}, [startDate, endDate])


	useEffect(() => {
		if(list.length) {
			setTotal(list.map(item => item.total).reduce((prev, next) => prev + next))
		}
		else {
			setTotal(0);
		}
	}, [list])

	const handleDateRangeOnChange = dates => {
		const [start, end] = dates;
	  setStartDate(start);
	  setEndDate(end);
	};

	return (
		<>
		<div className="grocery-view-mainwrap">
			<div className="grocery-view-wrap">
			<div className="grocery-date-wrap">
				<DatePicker
		      selected={startDate}
		      onChange={handleDateRangeOnChange}
		      startDate={startDate}
		      endDate={endDate}
		      selectsRange
		      inline
		    />
		    <p>Grand Total: {parseFloat(total).toFixed(2)}</p>
			</div>
			{loading ? <p>Loading...</p> : (
				<div className="grocery-list-view">
				<div className="grocery-list-header">
					<p>Name</p>
					<p>Price</p>
					<p>Quantity</p>
					<p>Total</p>
					<p>Completed</p>
				</div>
				{list.length ? list.map((item, index) => {
					return (
						<div className="grocery-list-item" key={index}>
							<p>{item.name}</p>
							<p>{parseFloat(item.price).toFixed(2)}</p>
							<p>{item.quantity}</p>
							<p>{parseFloat(item.total).toFixed(2)}</p>
							<p>{item.complete ? 'yes' : 'no'}</p>
						</div>
					)
				}) : <p>no data</p>}
				
			</div>
			)}
			</div>
			
		</div>
		<div className='grocery-buttons'>
			<Link to="/" className="grocery-btn-default">Back to dashboard</Link>
		</div>
		</>
	)
}

export default ViewGrocery;