import ReactDOM from 'react-dom';
import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from '../UI/CheckOut';

const Cart = (props) => {
	const [orderConfirmed, setOrderConfirmed] = useState(false);

	const cartCtx = useContext(CartContext);

	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;

	const cartItemRemoveHandler = (id) => {
		cartCtx.removeItem(id);
	};

	const cartItemAddHandler = (item) => {
		cartCtx.addItem(item);
	};

	const orderClickHandler = () => {
		setOrderConfirmed(true);
	};

	const toastContent = (
		<ToastContainer
			position='top-right'
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
		/>
	);

	const notify = () => {
		toast.success('Thank you for ordering our meals', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	const notifyError = () => {
		toast.error('Something error Happen Please try again', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	const orderConfirmHandler = (userData) => {
		const orderInfo = {
			users: userData,
			orders: cartCtx.items,
		};

		const option = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderInfo),
		};

		fetch(
			`https://meals-react-1357d-default-rtdb.firebaseio.com/order-info.json`,
			option,
		)
			.then((response) => response.json())
			.then(
				() =>
					new Promise((resolve, reject) => {
						notify();
						setTimeout(() => {
							resolve();
						}, 5000);
					}),
			)
			.then(() => props.onClose())
			.then(() => cartCtx.resetItem())
			.catch((error) => notifyError());
	};

	const cartItems = (
		<ul className={classes['cart-items']}>
			{cartCtx.items.map((item) => (
				<CartItem
					key={item.id}
					name={item.name}
					amount={item.amount}
					price={item.price}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const modalBtn = (
		<div className={classes.actions}>
			<button className={classes['button--alt']} onClick={props.onClose}>
				Close
			</button>
			{hasItems && (
				<button onClick={orderClickHandler} className={classes.button}>
					Order
				</button>
			)}
		</div>
	);

	return (
		<>
			{ReactDOM.createPortal(toastContent, document.getElementById('toast'))}
			<Modal onClose={props.onClose}>
				{cartItems}
				<div className={classes.total}>
					<span>Total Amount</span>
					<span>{totalAmount}</span>
				</div>
				{orderConfirmed && (
					<Checkout onConfirm={orderConfirmHandler} onClose={props.onClose} />
				)}
				{!orderConfirmed && modalBtn}
			</Modal>
		</>
	);
};

export default Cart;
