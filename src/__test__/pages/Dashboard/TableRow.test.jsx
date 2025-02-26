import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { format } from 'date-fns';

import { TableRows } from '../../../components/pages/Dashboard/TableRows';
import { DeletePostModel } from '../../../components/pages/Dashboard/DeletePostModel';

vi.mock('../../../components/pages/Dashboard/DeletePostModel');
vi.mock('date-fns');
describe('PostList component', () => {
	it('should render the post data', async () => {
		const mockProps = {
			post: {
				title: 'title',
				updatedAt: new Date(),
			},
			onDeletePost: vi.fn(),
		};
		const mockContext = {
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<table>
									<tbody>
										<TableRows {...mockProps} />
									</tbody>
								</table>
							),
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const title = screen.getByText(mockProps.post.title);

		expect(format.mock.calls[0][0]).toBe(mockProps.post.updatedAt);
		expect(title).toBeInTheDocument();
	});
	it('should render the publish icon if post is published', async () => {
		const mockProps = {
			post: {
				title: 'title',
				updatedAt: new Date(),
				publish: true,
			},
			onDeletePost: vi.fn(),
		};
		const mockContext = {
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<table>
									<tbody>
										<TableRows {...mockProps} />
									</tbody>
								</table>
							),
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const publish = screen.getByTestId('publish-icon');

		expect(publish).toHaveClass(/publish/);
	});
	it('should render the unpublish icon if post is unpublished', async () => {
		const mockProps = {
			post: {
				title: 'title',
				updatedAt: new Date(),
				publish: false,
			},
			onDeletePost: vi.fn(),
		};
		const mockContext = {
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<table>
									<tbody>
										<TableRows {...mockProps} />
									</tbody>
								</table>
							),
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const publish = screen.getByTestId('publish-icon');

		expect(publish).toHaveClass(/unpublish/);
	});
	it('should navigate to "/:postId/editor" path if the edit link is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				title: 'title',
				updatedAt: new Date(),
			},
			onDeletePost: vi.fn(),
		};
		const mockContext = {
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<table>
									<tbody>
										<TableRows {...mockProps} />
									</tbody>
								</table>
							),
						},
						{
							path: '/:postId/editor',
							element: <div>PostEditor component</div>,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const link = screen.getByRole('link');

		await user.click(link);

		const postEditorComponent = screen.getByText('PostEditor component');

		expect(postEditorComponent).toBeInTheDocument();
	});

	it('should render the DeletePostModel component if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				title: 'title',
				updatedAt: new Date(),
			},
			onDeletePost: vi.fn(),
		};
		const mockContext = {
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<table>
									<tbody>
										<TableRows {...mockProps} />
									</tbody>
								</table>
							),
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const deleteButton = screen.getByTestId('delete-button');

		await user.click(deleteButton);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
		expect(mockContext.onActiveModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			DeletePostModel,
		);
	});
});
