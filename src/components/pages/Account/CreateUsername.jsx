// Packages
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';

// Styles
import formStyles from '../../../styles/form.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// utils
import { updateUser } from '../../../utils/handleUser';
import { verifySchema } from '../../../utils/verifySchema';

export const CreateUsername = ({ onActiveModal, onUser, onAlert }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ username: '' });
	const [debounce, setDebounce] = useState(false);
	const [loading, setLoading] = useState(false);
	const timer = useRef(null);
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const handleUpdate = async () => {
		setLoading(true);

		const result = await updateUser(formFields);

		const handleSetUser = () => {
			onUser(result.data);
			onAlert({ message: 'Set username successfully' });
			onActiveModal({ component: null });
		};

		result.success
			? handleSetUser()
			: result.fields
				? setInputErrors({ ...result.fields })
				: navigate('/error', {
						state: { error: result.message, previousPath },
					});

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const schema = {
			username: string()
				.trim()
				.max(30, ({ max }) => `Username must be less than ${max} long.`)
				.matches(/^[a-zA-Z0-9]\w*$/, 'Username must be alphanumeric.')
				.required('Username is required.'),
		};

		const validationResult = await verifySchema({ schema, data: formFields });

		const handleInValid = () => {
			setInputErrors(validationResult.fields);
			setDebounce(false);
		};

		const handleValid = async () => {
			setInputErrors({});
			await handleUpdate();
		};

		validationResult.success ? await handleValid() : handleInValid();
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		!isEmpty(inputErrors) && setDebounce(true);
	};

	useEffect(() => {
		const schema = {
			username: string()
				.trim()
				.max(30, ({ max }) => `Username must be less than ${max} long.`)
				.matches(/^[a-zA-Z0-9]\w*$/, 'Username must be alphanumeric.')
				.required('Username is required.'),
		};
		debounce &&
			(timer.current = setTimeout(async () => {
				const validationResult = await verifySchema({
					schema,
					data: formFields,
				});
				validationResult.success
					? setInputErrors({})
					: setInputErrors(validationResult.fields);
			}, 500));

		return () => clearTimeout(timer.current);
	}, [debounce, formFields]);

	return (
		<div className={formStyles.form}>
			<form className={formStyles.content} onSubmit={handleSubmit}>
				<div className={formStyles.labelWrap}>
					<label
						htmlFor="username"
						className={`${inputErrors.username ? formStyles.error : ''}`}
					>
						Create username
						<input
							id="username"
							type="text"
							name="username"
							value={formFields.name}
							onChange={handleChange}
						/>
					</label>
					<div>
						<span className={`${imageStyles.icon} ${formStyles.alert}`} />
						<span className={formStyles.placeholder}>
							{inputErrors.username ?? 'Message placeholder'}
						</span>
					</div>
				</div>

				<button
					type="submit"
					className={`${buttonStyles.success} ${loading ? buttonStyles.loading : ''}`}
				>
					<span className={buttonStyles.text}>
						Save
						<span className={`${imageStyles.icon} ${buttonStyles.loadIcon}`} />
					</span>
				</button>
			</form>
		</div>
	);
};

CreateUsername.propTypes = {
	onActiveModal: PropTypes.func,
	onUser: PropTypes.func,
	onAlert: PropTypes.func,
};
