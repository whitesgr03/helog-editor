import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { format } from 'date-fns';

import { TableRows } from './TableRows';
import { DeletePostModel } from './DeletePostModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAppDataAPI } from '../App/AppContext';

vi.mock('../App/AppContext');
vi.mock('./DeletePostModel');
vi.mock('date-fns');

describe('PostList component', () => {
	it('should render the post data', async () => {
		const mockProps = {
			post: {
				_id: '1',
				title: 'title',
				updatedAt: new Date(),
				createdAt: new Date(),
				publish: false,
			},
			index: 0,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(format).mockReturnValue('');
		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<table>
							<tbody>
								<TableRows {...mockProps} />
							</tbody>
						</table>
					),
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

		const title = screen.getByText(
			`${mockProps.index + 1}. ${mockProps.post.title}`,
		);
		const publishIcon = screen.getByTestId('publish-icon');

		expect(format).toBeCalledWith(mockProps.post.updatedAt, 'MMMM d, y');
		expect(title).toBeInTheDocument();
		expect(publishIcon).toHaveClass(/unpublish/);
	});
	it(`should render the empty string on title element if the post was'nt set title`, async () => {
		const mockProps = {
			post: {
				_id: '1',
				title: '',
				updatedAt: new Date(),
				createdAt: new Date(),
				publish: false,
			},
			index: 0,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(format).mockReturnValue('');
		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<table>
							<tbody>
								<TableRows {...mockProps} />
							</tbody>
						</table>
					),
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

		const title = screen.getByText(`${mockProps.index + 1}. ( Empty )`);
		expect(title).toBeInTheDocument();
	});
	it('should render the publish icon if post is published', async () => {
		const mockProps = {
			post: {
				_id: '1',
				title: 'title',
				updatedAt: new Date(),
				createdAt: new Date(),
				publish: true,
			},
			index: 0,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(format).mockReturnValue('');
		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<table>
							<tbody>
								<TableRows {...mockProps} />
							</tbody>
						</table>
					),
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

		const publish = screen.getByTestId('publish-icon');

		expect(publish).toHaveClass(/publish/);
	});
	it('should navigate to "/posts/:postId/editor" path if the edit link is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '1',
				title: 'title',
				updatedAt: new Date(),
				createdAt: new Date(),
				publish: false,
			},
			index: 0,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(format).mockReturnValue('');
		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<table>
							<tbody>
								<TableRows {...mockProps} />
							</tbody>
						</table>
					),
				},
				{
					path: '/posts/:postId/editor',
					element: <div>PostEditor component</div>,
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

		const link = screen.getByRole('link');

		await user.click(link);

		const component = screen.getByText('PostEditor component');

		expect(component).toBeInTheDocument();
	});
	it('should render the DeletePostModel component if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '1',
				title: 'title',
				updatedAt: new Date(),
				publish: false,
				createdAt: new Date(),
			},
			index: 0,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(format).mockReturnValue('');

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<table>
							<tbody>
								<TableRows {...mockProps} />
							</tbody>
						</table>
					),
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

		const deleteButton = screen.getByTestId('delete-button');

		await user.click(deleteButton);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
		expect(mockCustomHook.onModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			DeletePostModel,
		);
	});
});
