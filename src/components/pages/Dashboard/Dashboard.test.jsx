import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
	fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
	QueryClient,
	QueryCache,
	QueryClientProvider,
	infiniteQueryOptions,
} from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Dashboard } from './Dashboard';
import { Loading } from '../../utils/Loading';
import { TableRows } from './TableRows';
import { useAppDataAPI } from '../App/AppContext';
import { infiniteQueryUserPostsOption } from '../../../utils/queryOptions';
import { getUserPosts } from '../../../utils/handleUser';
import { isExportDeclaration } from 'typescript';

vi.mock('./TableRows');
vi.mock('../../utils/Loading');
vi.mock('../App/AppContext');
vi.mock('../../../utils/queryOptions');
vi.mock('../../../utils/handleUser');

describe('Dashboard component', () => {
	it('should render the posts data if the infinite fetching posts successful', async () => {
		const mockFetchData = {
			data: {
				userPosts: Array.from({ length: 10 }, (_, index) => ({
					_id: index,
					title: `post${index + 1}`,
				})),
				userPostsCount: 0,
			},
		};
		mockFetchData.data.userPostsCount = mockFetchData.data.userPosts.length;

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td>{post.title}</td>
			</tr>
		));

		vi.mocked(getUserPosts).mockResolvedValue(mockFetchData);

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const totalPosts = screen.getByText(
			`Total posts: ${mockFetchData.data.userPostsCount}`,
		);

		expect(totalPosts).toBeInTheDocument();

		mockFetchData.data.userPosts.forEach(item => {
			expect(screen.getByText(item.title)).toBeInTheDocument();
		});
	});
	it('should not render a table with a list of posts if the posts data is empty', async () => {
		const mockFetchData = {
			data: {
				userPosts: [],
				userPostsCount: 0,
			},
		};
		mockFetchData.data.userPostsCount = mockFetchData.data.userPosts.length;

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td>{post.title}</td>
			</tr>
		));

		vi.mocked(getUserPosts).mockResolvedValue(mockFetchData);

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const element = screen.getByText('There are not posts.');

		expect(element).toBeInTheDocument();
	});
	it('should navigate to "/posts/editor" path if the new post link is clicked', async () => {
		const user = userEvent.setup();
		const mockFetchData = {
			data: {
				userPosts: [],
				userPostsCount: 0,
			},
		};
		mockFetchData.data.userPostsCount = mockFetchData.data.userPosts.length;

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);

		vi.mocked(getUserPosts).mockResolvedValue(mockFetchData);

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
				{
					path: '/posts/editor',
					element: <div>Editor component</div>,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const link = screen.getByRole('link', { name: 'New Post' });

		await user.click(link);

		const component = screen.getByText('Editor component');
		expect(component).toBeInTheDocument();
	});
	it('should render refetch button if the infinite fetching posts fails', async () => {
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);

		vi.mocked(getUserPosts).mockRejectedValue(Error());

		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const refetchButton = screen.getByRole('button', {
			name: 'Click here to load your posts',
		});

		expect(refetchButton).toBeInTheDocument();
	});
	it('should send an error alert if refetch button is clicked and fetching posts fails', async () => {
		const user = userEvent.setup();
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);

		vi.mocked(getUserPosts).mockRejectedValue(Error());

		const queryClient = new QueryClient({
			queryCache: new QueryCache({
				onError: (_error, query) =>
					typeof query.meta?.errorAlert === 'function' &&
					query.meta.errorAlert(),
			}),
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const refetchButton = screen.getByRole('button', {
			name: 'Click here to load your posts',
		});

		await user.click(refetchButton);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
	it('should fetch the next posts, if the user scroll to bottom of the component and infinite fetching posts successful', async () => {
		const mockFetchData = {
			data: {
				userPosts: Array.from({ length: 10 }, (_, index) => ({
					_id: index,
					title: `post${index + 1}`,
				})),
				userPostsCount: 15,
			},
		};
		const mockNextData = {
			data: {
				userPosts: Array.from({ length: 5 }, (_, index) => ({
					_id: index + 10,
					title: `post${index + 11}`,
				})),
				userPostsCount: 15,
			},
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td data-testid="title">{post.title}</td>
			</tr>
		));
		vi.mocked(getUserPosts)
			.mockResolvedValueOnce(mockFetchData)
			.mockResolvedValueOnce(mockNextData);

		const queryClient = new QueryClient({
			queryCache: new QueryCache({
				onError: (_error, query) =>
					typeof query.meta?.errorAlert === 'function' &&
					query.meta.errorAlert(),
			}),
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		fireEvent.scroll(window);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		expect(screen.getAllByTestId('title')).toHaveLength(
			mockFetchData.data.userPosts.length + mockNextData.data.userPosts.length,
		);

		const mockData = mockFetchData.data.userPosts.concat(
			mockNextData.data.userPosts,
		);
		mockData.forEach(item => {
			expect(screen.getByText(item.title)).toBeInTheDocument();
		});
	});
	it('should render the show more posts button, if the user scroll to bottom of the Posts component and infinite fetching posts fails', async () => {
		const mockFetchData = {
			data: {
				userPosts: Array.from({ length: 10 }, (_, index) => ({
					_id: index,
					title: `post${index + 1}`,
				})),
				userPostsCount: 15,
			},
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryUserPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['userPosts'],
				queryFn: getUserPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.userPostsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td data-testid="title">{post.title}</td>
			</tr>
		));
		vi.mocked(getUserPosts)
			.mockResolvedValueOnce(mockFetchData)
			.mockRejectedValue(Error());

		const queryClient = new QueryClient({
			queryCache: new QueryCache({
				onError: (_error, query) =>
					typeof query.meta?.errorAlert === 'function' &&
					query.meta.errorAlert(),
			}),
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dashboard />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		fireEvent.scroll(window);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const button = screen.getByRole('button', {
			name: 'Click here to show more posts',
		});

		expect(button).toBeInTheDocument();
	});
});
