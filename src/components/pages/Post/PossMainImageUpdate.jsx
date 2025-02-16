// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { string } from 'yup';

// Styles
import formStyles from '../../../styles/form.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Component
import { Loading } from '../../utils/Loading';

// Modules
import { verifySchema } from '../../../utils/verifySchema';

export const PossMainImageUpdate = ({ onActiveModal, onSetMainImage }) => {
	const [error, setError] = useState('');
	const [url, setUrl] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = e => {
		setUrl(e.target.value);
		error !== '' && setDebounce(true);
	};

	const handleMainImageUpdate = () => {
		const image = new Image();

		const handleError = () => {
			setError('URL is not a valid image source.');
			setLoading(false);
		};

		const handleSet = () => {
			onSetMainImage(url);
			onActiveModal({ component: null });
			setLoading(false);
		};

		image.onerror = handleError;

		image.onload = () =>
			image.width > 0 && image.height > 0 ? handleSet() : handleError();

		image.src = url;
	};

	const handleSubmit = async () => {
		setLoading(true);

		const schema = {
			url: string()
				.trim()
				.url('Image URL is not a valid URL.')
				.required('Image URl is required.'),
		};

		const validationResult = await verifySchema({
			schema,
			data: { url },
		});

		const handleInValid = () => {
			setError(validationResult.fields.url);
			setDebounce(false);
			setLoading(false);
		};

		const handleValid = async () => {
			setError('');
			await handleMainImageUpdate();
		};

		validationResult.success ? await handleValid() : handleInValid();
	};


	return (
		<>
			{loading && <Loading text={'Saving...'} light={true} shadow={true} />}
			<div className={formStyles.form}>
				<form
					className={formStyles.content}
					onSubmit={e => {
						e.preventDefault();
						!loading && handleSubmit();
					}}
				>
					<div className={formStyles['label-wrap']}>
						<label htmlFor="url" className={`${error ? formStyles.error : ''}`}>
							Image Url
							<input
								id="url"
								type="text"
								name="url"
								value={url}
								onChange={handleChange}
								autoFocus={true}
							/>
						</label>
						<div>
							<span className={`${imageStyles.icon} ${formStyles.alert}`} />
							<span className={formStyles.placeholder}>
								{error ?? 'Message placeholder'}
							</span>
						</div>
					</div>

					<button
						type="submit"
						className={`${buttonStyles.content} ${buttonStyles.success}`}
					>
						Save
					</button>
				</form>
			</div>
		</>
	);
};

PossMainImageUpdate.propTypes = {
	onActiveModal: PropTypes.func,
	onSetMainImage: PropTypes.func,
};
