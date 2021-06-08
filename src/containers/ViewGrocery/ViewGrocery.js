import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { firebaseDB, fb} from '../../firebase';
import { Link } from 'react-router-dom';
import './ViewGrocery.scss';

import moment from 'moment';

function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum/1000;
}

const ViewGrocery = () => {
	const [viewByDate, setViewByDate] = useState(new Date(moment().format("YYYY-MM-DD")));
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
				console.log(timestamp2)
				setList(data);
				setLoading(false);
			})
		return () => unsubscribe()
	},[])

	useEffect(() => {
		if(startDate) {
			firebaseDB.collection('groceries').where('date', '>', timestamp1).where('date', '<' , timestamp2).where('complete', '==', true)
			.onSnapshot(snapshot => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
					}))
				console.log(timestamp2)
				setList(data);
				setLoading(false);
			})
		}

		if(startDate && endDate) {
			const startDateTimestamp = fb.Timestamp.fromDate(new Date(startDate));
			const endDateTimestamp = fb.Timestamp.fromDate(new Date(moment(endDate).add(1,'days').format("YYYY-MM-DD")));
			firebaseDB.collection('groceries').where('date', '>', startDateTimestamp).where('date', '<' , endDateTimestamp).where('complete', '==', true)
			.onSnapshot(snapshot => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
					}))
				console.log(startDateTimestamp)
				console.log(endDateTimestamp);
				setList(data);
				setLoading(false);
			})
		}
	}, [startDate, endDate])


	useEffect(() => {
		if(list.length) {
			setTotal(list.map(item => item.total).reduce((prev, next) => prev + next))
		}
	}, [list])

	const handleDateRangeOnChange = dates => {
		
	  const [start, end] = dates;
	  setStartDate(start);
	  setEndDate(end);
	};

	const handleDeleteAll = () => {
		let ref = firebaseDB.collection('groceries')
		firebaseDB.collection('groceries').onSnapshot(snapshot => {
		    snapshot.docs.forEach(doc => {
		        ref.doc(doc.id).delete()
		        console.log(doc);
		        // .catch(error => {
		        //     console.log(error)
		        // })
		    })
		})

	}

	console.log(startDate);
	console.log(endDate);
	console.log(list);
	
	//console.log(moment(viewByDate).add(1,'days').format("YYYY-MM-DD"));
	
	return (
		<>
		<div className="grocery-view-mainwrap">
			<div className="grocery-view-wrap">
			<div className="grocery-date-wrap">
				{/*<DatePicker closeOnScroll={true} selected={viewByDate} onChange={date => setViewByDate(date)} />*/}
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
			<button className='grocery-btn-default' onClick={handleDeleteAll}>Delete All</button>
		</div>
		</>
	)
}

export default ViewGrocery;