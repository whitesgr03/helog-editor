// Package
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './Dashboard.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Component
import { TableRows } from './TableRows';
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

export const Dashboard = () => {
	const { onAlert } = useAppDataAPI();

	const [isManuallyRefetch, setIsManuallyRefetch] = useState(false);
	const [renderPostsCount, setRenderPostsCount] = useState(10);

	const postListRef = useRef<HTMLDivElement>(null);

	const {
		isPending,
		isError,
		data,
		refetch,
		isFetchingNextPage,
		isFetchNextPageError,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		...infiniteQueryUserPostsOption(),
		meta: {
			errorAlert: () => {
				isManuallyRefetch &&
					onAlert([
						{
							message:
								'Loading the posts has some errors occur, please try again later.',
							error: true,
							delay: 4000,
						},
					]);
				setIsManuallyRefetch(false);
			},
		},
	});

	const posts: Post[] = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.userPosts),
		[],
	);

	const userPostsCount = data?.pages.at(-1).data.userPostsCount;

	const handleManuallyRefetch = () => {
		refetch();
		setIsManuallyRefetch(true);
	};

	useEffect(() => {
		const handleRenderNextPage = () => {
			posts.length <= renderPostsCount && fetchNextPage();
			setRenderPostsCount(renderPostsCount + 10);
		};
		const handleScroll = async () => {
			const targetRect = postListRef.current?.getBoundingClientRect();

			const isScrollToBottom =
				targetRect && targetRect.bottom <= window.innerHeight;

			!isFetchingNextPage && isScrollToBottom && handleRenderNextPage();
		};

		!isError &&
			(posts?.length > renderPostsCount || hasNextPage) &&
			window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [
		isError,
		posts,
		renderPostsCount,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	]);

	return (
		<div className={styles.dashboard}>
			{isError && !data?.pages.length ? (
				<button
					className={`${buttonStyles.content} ${buttonStyles.more}`}
					onClick={handleManuallyRefetch}
				>
					Click here to load your posts
				</button>
			) : isPending ? (
				<Loading text={'Loading posts ...'} />
			) : (
				<>
					<h2>Dashboard</h2>
					<div className={styles['table-top']}>
						{userPostsCount > 0 && (
							<span>{`Total posts: ${userPostsCount}`}</span>
						)}
						<Link
							to="/posts/editor"
							className={`${buttonStyles.content} ${buttonStyles.success} ${styles.link}`}
						>
							New Post
						</Link>
					</div>
					<div className={styles.container} ref={postListRef}>
						{posts.length > 0 ? (
							<>
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
										{posts.slice(0, renderPostsCount).map((post, index) => (
											<TableRows key={post._id} index={index} post={post} />
										))}
									</tbody>
								</table>
							</>
						) : (
							<p>There are not posts.</p>
						)}
					</div>
					{isFetchingNextPage ? (
						<Loading text={'Loading more posts ...'} />
					) : (
						isFetchNextPageError && (
							<button
								className={`${buttonStyles.content} ${buttonStyles.more}`}
								onClick={() => fetchNextPage()}
							>
								Click here to show more posts
							</button>
						)
					)}
				</>
			)}
		</div>
	);
};
