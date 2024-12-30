// Packages
import { useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Login } from '../../pages/Account/Login';
import { CreateUsername } from '../../pages/Account/CreateUsername';

export const Authentication = ({ children }) => {
	const { user, onActiveModal, onUser, onAlert } = useOutletContext();

	return !user ? (
		<Login />
	) : user.username ? (
		children
	) : (
		onActiveModal({
			component: (
				<CreateUsername
					onActiveModal={onActiveModal}
					onUser={onUser}
					onAlert={onAlert}
				/>
			),
			clickToClose: false,
		})
	);
};

Authentication.propTypes = {
	children: PropTypes.node.isRequired,
};
