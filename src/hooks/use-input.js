import { useState } from 'react';

const useInput = (validate) => {
	const [inputValue, setInputValue] = useState('');
	const [isTouch, setIsTouch] = useState(false);

	const isValid = validate(inputValue);
	const hasError = !isValid && isTouch;

	const inputBlurHandler = () => setIsTouch(true);
	const inputChangedHandler = (event) => setInputValue(event.target.value);

	return {
		inputValue,
		isValid,
		hasError,
		inputBlurHandler,
		inputChangedHandler,
	};
};

export default useInput;
