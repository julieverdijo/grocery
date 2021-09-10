import React, { useRef } from 'react';
import { firebaseDB } from '../../firebase';
import './GroceryItem.scss';
import check from '../../assets/images/check-mark.png';
import remove from '../../assets/images/remove.png';

const GroceryItem = ({ item, items, id, setItems, handleDelete, handleComplete, ...props }) => {
	const priceRef = useRef(null);
	const quantityRef = useRef(null);
	
	const handleChange = (e) => {
		if(e.target.value) {
			firebaseDB.collection('groceries').doc(item.id).update({
				[e.target.name]: e.target.value,
				total: parseInt(priceRef.current.value) * parseInt(quantityRef.current.value)
			})
		}
	}

	return (
		<li id={item.id} className={'grocery-item'}>
			<input
				type="text"
				name="name"
				defaultValue={item.name}
				onChange={handleChange}
				className={item.complete ? 'complete grocery-item-input' : 'grocery-item-input'}
			/>
			<input
				type="text"
				name="price"
				defaultValue={parseFloat(item.price).toFixed(2)}
				onChange={handleChange}
				ref={priceRef}
				className={item.complete ? 'complete grocery-item-input' : 'grocery-item-input'}
			/>
			<input
				type="text"
				name="quantity"
				defaultValue={item.quantity}
				onChange={handleChange}
				ref={quantityRef}
				className={item.complete ? 'complete grocery-item-input' : 'grocery-item-input'}
			/>
			<span className={'grocery-item-total'}>{parseFloat(item.total).toFixed(2)}</span>
			<img src={check} className={'grocery-item-complete'} onClick={() => handleComplete(item.id, item.complete)} alt=""/>
			<img src={remove} className={'grocery-item-delete'} onClick={() => handleDelete(item.id)} alt=""/>
		</li>
	)
}

export default GroceryItem;