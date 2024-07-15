// Styles
import style from "../../styles/layout/Contact.module.css";

// Components
import Address from "./Address";

const Contact = () => {
	return (
		<div className={style.contact}>
			<h3>Contact</h3>
			<p>Please contact us, If you have any questions.</p>
			<div className={style.container}>
				<Address />
			</div>
		</div>
	);
};

export default Contact;
