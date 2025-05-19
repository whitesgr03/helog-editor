import { QueryClient, queryOptions, QueryCache } from '@tanstack/react-query';
import { getUserInfo } from './handleUser';

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
