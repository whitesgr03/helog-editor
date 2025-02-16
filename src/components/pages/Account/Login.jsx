// Packages
import { useState } from 'react';

// styles
import styles from './Login.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

export const Login = () => {
	const [loading, setLoading] = useState(false);

	const handleSocialLogin = async provider => {
		setLoading(true);

		window.location.assign(
			`${import.meta.env.VITE_RESOURCE_URL}/account/login/${provider}`,
		);
	};

	return (
		<div className={styles.account}>
			<div className={styles.wrap}>
				<h3 className={styles.title}>User Sign in</h3>
				<div className={styles.container}>
					{loading && <Loading text={'Loading...'} />}
					<button
						className={styles['federation-button']}
						onClick={() => handleSocialLogin('google')}
					>
						<div className={styles.google}>
							<img src={googleIcon} alt="Google icon" />
						</div>
						Sign in with Google
					</button>
					<button
						className={styles['federation-button']}
						onClick={() => handleSocialLogin('facebook')}
					>
						<div className={styles.facebook}>
							<img src={facebookIcon} alt="Facebook icon" />
						</div>
						Sign in with Facebook
					</button>
				</div>
			</div>
		</div>
	);
};
