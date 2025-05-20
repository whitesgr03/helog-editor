// Packages
import { useState, useRef } from 'react';

// Styles
import styles from './Alert.module.css';

// Context
import { useAlert, useAppDataAPI } from './AppContext';

export const Alert = () => {
	const alert = useAlert();
	const { onAlert } = useAppDataAPI();
	const [pause, setPause] = useState(false);
	const timer = useRef();
	const startTime = useRef(0);
	const remainingTime = useRef(0);

	// The lastAlert state will store the last alert data before the alert array is set to empty,
	// to prevent the message and error class from disappearing before the alert block is hidden.
	const [lastAlert, setLastAlert] = useState({});

	const endAlert = () => {
		remainingTime.current = 0;
		clearTimeout(timer.current);

		const nextAlert = alert[1] ? [alert[1]] : [];

		nextAlert.length === 0 && setLastAlert(alert[0]);

		onAlert(nextAlert);
	};

	const startTimer = () => {
		startTime.current = Date.now();
		remainingTime.current === 0 && (remainingTime.current = alert[0].delay);
		clearTimeout(timer.current);
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
			onClick={endAlert}
			onTransitionEnd={handleTransitionend}
			onMouseEnter={handlePauseTimer}
			onMouseLeave={handleContinueTimer}
			className={`${styles.alert} ${alert.length === 1 ? styles.active : ''} ${
				lastAlert.error || alert[0]?.error ? styles.error : ''
			}`}
			data-testid="alert"
		>
			<p data-testid="message">{lastAlert.message || alert[0]?.message}</p>
		</div>
	);
};
