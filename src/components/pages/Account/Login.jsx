// Packages
import { Navigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

// styles
import imageStyles from '../../../styles/image.module.css';
import styles from './Login.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

export const Login = () => {
	const { user } = useOutletContext();

	const [loading, setLoading] = useState(false);

	const handleSocialLogin = async provider => {
		setLoading(true);

		window.location.assign(
			`${import.meta.env.VITE_RESOURCE_URL}/account/login/${provider}`,
		);

		setLoading(false);
	};

	return (
		<>
			{user ? (
				<Navigate to="/" replace={true} />
			) : (
				<div className={styles.account}>
					<h3 className={styles.title}>User Sign in</h3>
					<div className={styles.container}>
						{loading && <Loading text={'Submitting...'} />}
						<div className={styles.federation}>
							<button
								className={styles['federation-button']}
								onClick={() => handleSocialLogin('google')}
							>
								<div className={`${imageStyles} ${styles.google}`}>
									<img src={googleIcon} alt="Google icon" />
								</div>
								Sign in with Google
							</button>
							<button
								className={styles['federation-button']}
								onClick={() => handleSocialLogin('facebook')}
							>
								<div className={`${imageStyles} ${styles.facebook}`}>
									<img src={facebookIcon} alt="Facebook icon" />
								</div>
								Sign in with Facebook
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
