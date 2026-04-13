// Package
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './Dashboard.module.css';
import buttonStyles from '../../../styles/button.module.css';
import skeletonStyles from '../../../styles/skeleton.module.css';

// Component
import { TableRows } from './TableRows';
import { TableRowsTemplate } from './TableRowsTemplate';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryUserPostsOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

export interface Post {
	_id: string;
	title: string;
	publish: boolean;
	updatedAt: Date;
	createdAt: Date;
}

export interface PostData {
	pages: {
		success: boolean;
		message: string;
		data: {
			userPosts: Post[];
		};
	}[];
	pageParams: number[];
}

const count = 10;
export const Dashboard = () => {
	const { onAlert } = useAppDataAPI();

	const [renderPostsCount, setRenderPostsCount] = useState(count);

	const {
		isLoading,
		isError,
		data,
		refetch,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery(infiniteQueryUserPostsOption());

	const posts: Post[] = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.userPosts),
		[],
	);

	const userPostsCount = data?.pages.at(-1).data.userPostsCount;

	const handleManualRefetch = async () => {
		const result = await refetch();
		if (result.isError) {
			onAlert([
				{
					message:
						'Loading the posts has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]);
		}
	};

	const handleFetchingNextPosts = async () => {
		const result = await fetchNextPage();
		if (result.isSuccess) {
			setRenderPostsCount(renderPostsCount + count);
		}
		if (result.isError) {
			onAlert([
				{
					message:
						'Loading the posts has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]);
		}
	};

	return (
		<div className={styles.dashboard}>
			{isError && !data?.pages.length ? (
				<button
					className={`${buttonStyles.content} ${buttonStyles.more}`}
					onClick={handleManualRefetch}
				>
					Click here to load your posts
				</button>
			) : (
				<>
					<h2>Dashboard</h2>
					<div className={styles['table-top']}>
						{isLoading ? (
							<span
								className={skeletonStyles.loading}
							>{`Total posts: 100`}</span>
						) : (
							userPostsCount > 0 && (
								<span>{`Total posts: ${userPostsCount}`}</span>
							)
						)}
						<Link
							to="/posts/editor"
							className={`${buttonStyles.content} ${buttonStyles.success} ${styles.link}`}
						>
							New Post
						</Link>
					</div>
					<div className={styles.container}>
						{isLoading || posts.length > 0 ? (
							<table>
								<thead className={styles.thead}>
									<tr className={styles['thead-rows']}>
										<th>Title</th>
										<th>Publish</th>
										<th>Last Modified</th>
										<th>Edit</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<TableRowsTemplate count={10} />
									) : (
										posts
											.slice(0, renderPostsCount)
											.map((post, index) => (
												<TableRows key={post._id} index={index} post={post} />
											))
									)}
								</tbody>
							</table>
						) : (
							<p>There are not posts.</p>
						)}
					</div>
					{isFetchingNextPage ? (
						<Loading text={'Loading more posts ...'} />
					) : posts?.length > renderPostsCount ? (
						<button
							className={`${buttonStyles.content} ${buttonStyles.more}`}
							onClick={() => setRenderPostsCount(renderPostsCount + count)}
						>
							Click here to show more posts
						</button>
					) : (
						hasNextPage && (
							<button
								className={`${buttonStyles.content} ${buttonStyles.more}`}
								onClick={handleFetchingNextPosts}
							>
								Click here to load more posts
							</button>
						)
					)}
				</>
			)}
		</div>
	);
};
