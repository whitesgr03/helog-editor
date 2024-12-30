// Packages
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './Alert.module.css';

export const Alert = ({ alert, onCloseAlert }) => {
	const [activeAlert, setActiveAlert] = useState(false);
	const [pauseAlert, setPauseAlert] = useState(false);
	const timerId = useRef(null);
	const start = useRef(null);
	const remaining = useRef(null);

	const handleTransitionend = () => !activeAlert && onCloseAlert();
	const handlePause = e => {
		const target = e.target.closest(`.${styles.alert}`);
		e.type === 'mouseover' && target && setPauseAlert(true);
		e.type === 'mouseout' && target && setPauseAlert(false);
	};

	useEffect(() => {
		setTimeout(() => setActiveAlert(true), 50);
	}, []);

	useEffect(() => {
		const setTimer = delay => {
			start.current = Date.now();
			!remaining.current && (remaining.current = delay);
			timerId.current = setTimeout(
				() => setActiveAlert(false),
				remaining.current,
			);
		};

		const pauseTimer = () => {
			remaining.current -= Date.now() - start.current;
			clearTimeout(timerId.current);
		};

		pauseAlert ? pauseTimer() : setTimer(2000);

		return () => {
			clearTimeout(timerId.current);
		};
	}, [alert, pauseAlert]);
	return (
		<div
			onTransitionEnd={handleTransitionend}
			onMouseOver={handlePause}
			onMouseOut={handlePause}
			className={`${styles.alert} ${activeAlert ? styles.active : ''} ${
				alert.error ? styles.error : ''
			}`}
		>
			<p>{alert.message}</p>
		</div>
	);
};

Alert.propTypes = {
	alert: PropTypes.object,
	onCloseAlert: PropTypes.func,
};
