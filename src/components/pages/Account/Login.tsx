// Packages
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

// styles
import styles from './Login.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

// Utils
import { queryClient } from '../../../utils/queryOptions';

// Type
import { User } from '../../layout/Header/Header';

export const Login = () => {
	const { data: user }: { data?: User } =
		queryClient.getQueryData(['userInfo']) ?? {};

	const [loading, setLoading] = useState(false);

	const handleSocialLogin = async (provider: 'google' | 'facebook') => {
		setLoading(true);

		window.location.assign(
			`${import.meta.env.VITE_RESOURCE_URL}/account/login/${provider}`,
		);
	};

	return (
		<>
			{user ? (
				<Navigate to="/" replace={true} />
			) : (
				<div className={styles.account}>
					<div className={styles.wrap}>
						<h3 className={styles.title}>User Sign in</h3>
						<div className={styles.container}>
							{loading && <Loading text={'Loading...'} shadow={true} />}
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
			)}
		</>
	);
};
