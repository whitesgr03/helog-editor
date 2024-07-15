// Styles
import style from "../../styles/layout/Loading.module.css";
import image from "../../styles/utils/image.module.css";

const Loading = () => {
	return (
		<div className={style.loading}>
			<span className={`${image.icon} ${style.load}`} />
			Loading ...
		</div>
	);
};

export default Loading;
