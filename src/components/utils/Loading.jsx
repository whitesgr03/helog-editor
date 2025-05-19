// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Loading.module.css';
import imageStyles from '../../styles/image.module.css';

export const Loading = ({ text, dark, light, shadow, blur }) => {
	return (
		<div
			className={`${styles.loading} ${dark ? styles.dark : ''} ${
				light ? styles.light : ''
			} ${shadow ? styles.shadow : ''} ${blur ? styles.blur : ''}`}
		>
			{text}
			<span className={`${imageStyles.icon} ${styles.load}`} />
		</div>
	);
};

Loading.propTypes = {
	text: PropTypes.string,
	dark: PropTypes.bool,
	light: PropTypes.bool,
	shadow: PropTypes.bool,
};
