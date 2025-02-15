// Packages
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './Alert.module.css';

export const Alert = ({ alert, onAlert }) => {
	const [pause, setPause] = useState(false);
	const [cancel, setCancel] = useState(false);
	const timer = useRef('');
	const startTime = useRef(0);
	const remainingTime = useRef(0);

	// The lastAlert state will store the last alert data before the alert array is set to empty,
	// to prevent the message and error class from disappearing before the alert block is hidden.
	const [lastAlert, setLastAlert] = useState({});

	const endAlert = () => {
		remainingTime.current = 0;
		clearTimeout(timer.current);

		const nextAlert = alert[1] ? [alert[1]] : [];

		nextAlert.length === 0 && !cancel && setLastAlert(alert[0]);

		onAlert(nextAlert);
		setCancel(false);
	};

	const startTimer = () => {
		startTime.current = Date.now();
		remainingTime.current === 0 && (remainingTime.current = alert[0].delay);
		timer.current && clearTimeout(timer.current);
		timer.current = setTimeout(() => endAlert(), remainingTime.current);
	};

	const handleTransitionend = () => {
		alert.length === 1 && !pause && startTimer();
		alert.length > 1 && endAlert();
		alert.length === 0 && setLastAlert({});
	};
	const handlePauseTimer = () => {
		setPause(true);
		clearTimeout(timer.current);

		remainingTime.current !== 0 &&
			(remainingTime.current -= Date.now() - startTime.current);
	};
	const handleContinueTimer = () => {
		setPause(false);
		alert.length === 1 && startTimer();
	};
	return (
		<div
			onClick={() => setCancel(true)}
			onTransitionEnd={handleTransitionend}
			onMouseEnter={handlePauseTimer}
			onMouseLeave={handleContinueTimer}
			className={`${styles.alert} ${alert.length === 1 && !cancel ? styles.active : ''} ${
				alert[0]?.error || lastAlert.error ? styles.error : ''
			}`}
		>
			<p>{alert[0]?.message || lastAlert.message}</p>
		</div>
	);
};

Alert.propTypes = {
	alert: PropTypes.array,
	onAlert: PropTypes.func,
};
