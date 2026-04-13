import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
	QueryClient,
	QueryClientProvider,
	infiniteQueryOptions,
} from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Dashboard } from './Dashboard';
import { Loading } from '../../utils/Loading';
import { TableRows } from './TableRows';
import { TableRowsTemplate } from './TableRowsTemplate';
import { useAppDataAPI } from '../App/AppContext';
import { infiniteQueryUserPostsOption } from '../../../utils/queryOptions';
import { getUserPosts } from '../../../utils/handleUser';

vi.mock('./TableRows');
vi.mock('./TableRowsTemplate');
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
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
			</tr>
		));
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
			screen.queryByText('TableRowsTemplate component'),
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
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
			</tr>
		));
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
			screen.queryByText('TableRowsTemplate component'),
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
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
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
			screen.queryByText('TableRowsTemplate component'),
		);

		const link = screen.getByRole('link', { name: 'New Post' });

		await user.click(link);

		const component = screen.getByText('Editor component');
		expect(component).toBeInTheDocument();
	});
	it('should render refetch button if fetching posts data fails', async () => {
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
				retry: false,
			}),
		);

		vi.mocked(getUserPosts).mockRejectedValue(Error());
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
			</tr>
		));
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
			screen.queryByText('TableRowsTemplate component'),
		);

		const refetchButton = screen.getByRole('button', {
			name: /load your posts/,
		});

		expect(refetchButton).toBeInTheDocument();
	});
	it('should render an error alert if refetch fails.', async () => {
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
				retry: false,
			}),
		);

		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
			</tr>
		));

		vi.mocked(getUserPosts).mockRejectedValue(Error());

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
			screen.queryByText('TableRowsTemplate component'),
		);

		const refetchButton = screen.getByRole('button', {
			name: /load your posts/,
		});

		await user.click(refetchButton);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
	it('should render the more posts, if the user click the show more posts button', async () => {
		const user = userEvent.setup();

		const mockFetchData = {
			data: {
				userPosts: Array.from({ length: 20 }, (_, index) => ({
					_id: index,
					title: `post${index + 1}`,
				})),
				userPostsCount: 20,
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
				retry: false,
			}),
		);
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td>{post.title}</td>
			</tr>
		));
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
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
			screen.queryByText('TableRowsTemplate component'),
		);

		const button = screen.getByRole('button', {
			name: /show more posts/,
		});

		await user.click(button);

		expect(getUserPosts).toBeCalledTimes(1);
		expect(screen.getAllByRole('cell')).toHaveLength(20);
	});
	it('should fetch the next posts, if the load more posts button is clicked and fetching next posts successful', async () => {
		const user = userEvent.setup();

		const mockFetchData = {
			data: {
				userPosts: Array.from({ length: 10 }, (_, index) => ({
					_id: index,
					title: `post${index + 1}`,
				})),
				userPostsCount: 20,
			},
		};

		const mockNextData = {
			data: {
				userPosts: Array.from({ length: 10 }, (_, index) => ({
					_id: index + 10,
					title: `post${index + 11}`,
				})),
				userPostsCount: 20,
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
				retry: false,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
			</tr>
		));
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td>{post.title}</td>
			</tr>
		));
		vi.mocked(getUserPosts)
			.mockResolvedValueOnce(mockFetchData)
			.mockImplementationOnce(
				async () =>
					await new Promise(resolve =>
						setTimeout(() => resolve(mockNextData), 100),
					),
			);

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
			screen.queryByText('TableRowsTemplate component'),
		);

		const button = screen.getByRole('button', {
			name: /load more posts/,
		});

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		expect(screen.getAllByRole('cell')).toHaveLength(20);
	});
	it('should renders the error alert, if load next comments fails', async () => {
		const user = userEvent.setup();
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		const mockFetchData = {
			data: {
				userPosts: Array.from({ length: 10 }, (_, index) => ({
					_id: index,
					title: `post${index + 1}`,
				})),
				userPostsCount: 20,
			},
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
				retry: false,
			}),
		);
		vi.mocked(TableRowsTemplate).mockImplementation(() => (
			<tr>
				<td>TableRowsTemplate component</td>
			</tr>
		));
		vi.mocked(TableRows).mockImplementation(({ post }) => (
			<tr>
				<td>{post.title}</td>
			</tr>
		));
		vi.mocked(getUserPosts)
			.mockResolvedValueOnce(mockFetchData)
			.mockRejectedValue(new Error());

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
			screen.queryByText('TableRowsTemplate component'),
		);

		const button = screen.getByRole('button', {
			name: /load more posts/,
		});

		await user.click(button);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
});
