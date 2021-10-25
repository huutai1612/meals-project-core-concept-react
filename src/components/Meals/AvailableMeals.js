import { useState, useEffect } from 'react';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const option = {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
	},
};

const AvailableMeals = () => {
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState(null);

	useEffect(() => {
		fetch(
			`https://meals-react-1357d-default-rtdb.firebaseio.com/meals.json`,
			option,
		)
			.then((response) => response.json())
			.then(transformData)
			.catch((error) => {
				const newError = new Error('Something is Error while getting meals.');
				setHttpError(newError.message);
			});
	}, []);

	const transformData = (data) => {
		const dataTransformed = [];
		for (const key in data) {
			dataTransformed.push({
				id: key,
				name: data[key].name,
				price: data[key].price,
				description: data[key].description,
			});
		}
		setMeals(dataTransformed);
		setIsLoading(false);
	};

	const mealsList = httpError ? (
		<h3 className={classes['text-error']}>{httpError}</h3>
	) : (
		meals.map((meal) => (
			<MealItem
				key={meal.id}
				id={meal.id}
				name={meal.name}
				description={meal.description}
				price={meal.price}
			/>
		))
	);

	const loadingContent = (
		<li>
			<h3>Loading Meals ....</h3>
		</li>
	);

	return (
		<section className={classes.meals}>
			<Card>
				<ul>{isLoading ? loadingContent : mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
