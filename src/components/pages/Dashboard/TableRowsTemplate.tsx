// Styles
import styles from './TableRows.module.css';
import imageStyles from '../../../styles/image.module.css';
import skeletonStyles from '../../../styles/skeleton.module.css';

export const TableRowsTemplate = ({ count }: { count: number }) => {
	return (
		<>
			{[...Array(count).keys()].map(index => (
				<tr key={index} className={styles['tbody-rows']}>
					<td className={skeletonStyles.loading}>title</td>
					<td className={skeletonStyles.loading}></td>
					<td className={skeletonStyles.loading}>MMMM d, y</td>
					<td className={skeletonStyles.loading}></td>
					<td className={skeletonStyles.loading}>
						<div>
							<span className={`${imageStyles.icon} ${styles.delete}`} />
						</div>
					</td>
				</tr>
			))}
		</>
	);
};
