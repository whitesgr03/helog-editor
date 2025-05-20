import {
	QueryClient,
	queryOptions,
	infiniteQueryOptions,
	QueryCache,
} from '@tanstack/react-query';
import { getUserInfo, getUserPosts, getUserPost } from './handleUser';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (_error, query) =>
			typeof query.meta?.errorAlert === 'function' && query.meta.errorAlert(),
	}),
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const queryUserInfoOption = queryOptions({
	queryKey: ['userInfo'],
	queryFn: getUserInfo,
	retry: (failureCount, error) =>
		error?.cause?.status !== 404 && failureCount < 3,
	staleTime: Infinity,
	gcTime: Infinity,
	refetchOnReconnect: false,
	select: response => response.data,
});

export const infiniteQueryUserPostsOption = infiniteQueryOptions({
	queryKey: ['userPosts'],
	queryFn: getUserPosts,
	initialPageParam: 0,
	getNextPageParam: (lastPage, _allPages, lastPageParam) =>
		lastPage.data.userPostsCount > lastPageParam + 100
			? lastPageParam + 100
			: null,
	staleTime: 1000 * 60 * 30,
	gcTime: Infinity,
});

export const queryPostDetailOption = id =>
	queryOptions({
		queryKey: ['userPost', id],
		queryFn: getUserPost,
		staleTime: 1000 * 60 * 30,
		retry: (failureCount, error) =>
			error?.cause?.status !== 404 && failureCount < 3,
		select: response => response.data,
	});
