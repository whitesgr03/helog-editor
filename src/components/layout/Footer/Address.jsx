// Styles
import style from "./Address.module.css";
import image from "../../../styles/image.module.css";

const Address = () => {
	return (
		<address>
			<a href="mailto:whitesgr03@gmail.com">
				<span className={`${image.icon} ${style.email}`} />
				<em>whitesgr03@gmail.com</em>
			</a>
		</address>
	);
};

export default Address;
