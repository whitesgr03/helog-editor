// Styles
import styles from './Address.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Address = () => {
	return (
		<address>
			<a href="mailto:whitesgr03@gmail.com">
				<span className={`${imageStyles.icon} ${styles.email}`} />
				<em>whitesgr03@gmail.com</em>
			</a>
		</address>
	);
};
