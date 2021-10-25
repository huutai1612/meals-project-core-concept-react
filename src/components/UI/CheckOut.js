import { Fragment, useContext } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useInput from '../../hooks/use-input';
import CartContext from '../../store/cart-context';
import classes from './Checkout.module.css';

const isNotEmpty = (value) => value.trim() !== '' && value.trim().length > 3;

const Checkout = (props) => {
	const cartCtx = useContext(CartContext);

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

	const {
		inputValue: name,
		isValid: isNameValid,
		hasError: isNameError,
		inputBlurHandler: nameBlurHandler,
		inputChangedHandler: nameChangedHandler,
	} = useInput(isNotEmpty);

	const {
		inputValue: street,
		isValid: isStreetValid,
		hasError: isStreetError,
		inputBlurHandler: streetBlurHandler,
		inputChangedHandler: streetChangedHandler,
	} = useInput(isNotEmpty);

	const {
		inputValue: postalCode,
		isValid: isPostalCodeValid,
		hasError: isPostalCodeError,
		inputBlurHandler: postalCodeBlurHandler,
		inputChangedHandler: postalCodeChangedHandler,
	} = useInput(isNotEmpty);

	const {
		inputValue: city,
		isValid: isCityValid,
		hasError: isCityError,
		inputBlurHandler: cityBlurHandler,
		inputChangedHandler: cityChangedHandler,
	} = useInput(isNotEmpty);

	let isFormValid = false;

	if (isNameValid && isStreetValid && isPostalCodeValid && isCityValid) {
		isFormValid = true;
	}

	const confirmHandler = (event) => {
		event.preventDefault();
		const orderInfo = {
			name: name,
			street: street,
			postalCode: postalCode,
			city: city,
			orderInfo: cartCtx.items,
		};

		const option = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderInfo),
		};
		if (!isFormValid) {
			return;
		}
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
			.catch((error) => console.log(error));
	};

	const nameClasses = isNameError ? classes.invalid : classes.control;
	const streetClasses = isStreetError ? classes.invalid : classes.control;
	const postalClasses = isPostalCodeError ? classes.invalid : classes.control;
	const cityClasses = isCityError ? classes.invalid : classes.control;

	return (
		<Fragment>
			{ReactDOM.createPortal(toastContent, document.getElementById('toast'))}
			<form className={classes.form} onSubmit={confirmHandler}>
				<div className={nameClasses}>
					<label htmlFor='name'>Your Name</label>
					<input
						type='text'
						id='name'
						value={name}
						onBlur={nameBlurHandler}
						onChange={nameChangedHandler}
					/>
					{isNameError && (
						<p className={classes['error-text']}>Name is required</p>
					)}
				</div>
				<div className={streetClasses}>
					<label htmlFor='street'>Street</label>
					<input
						type='text'
						id='street'
						value={street}
						onBlur={streetBlurHandler}
						onChange={streetChangedHandler}
					/>
					{isStreetError && (
						<p className={classes['error-text']}>Street is required</p>
					)}
				</div>
				<div className={postalClasses}>
					<label htmlFor='postal'>Postal Code</label>
					<input
						type='text'
						id='postal'
						value={postalCode}
						onBlur={postalCodeBlurHandler}
						onChange={postalCodeChangedHandler}
					/>
					{isPostalCodeError && (
						<p className={classes['error-text']}>Postal Code is required</p>
					)}
				</div>
				<div className={cityClasses}>
					<label htmlFor='city'>City</label>
					<input
						type='text'
						id='city'
						value={city}
						onBlur={cityBlurHandler}
						onChange={cityChangedHandler}
					/>
					{isCityError && (
						<p className={classes['error-text']}>City is required</p>
					)}
				</div>
				<div className={classes.actions}>
					<button type='button' onClick={props.onClose}>
						Cancel
					</button>
					<button disabled={!isFormValid} className={classes.submit}>
						Confirm
					</button>
				</div>
			</form>
		</Fragment>
	);
};

export default Checkout;
