import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Dashboard } from './Dashboard';

import { TableRows } from './TableRows';

vi.mock('../../../components/pages/Dashboard/TableRows');

describe('Dashboard component', () => {
	it('should render a table with a list of posts', async () => {
		const mockContext = {
			posts: [{ _id: '0' }, { _id: '1' }],
			onDeletePost: vi.fn(),
		};

		TableRows.mockImplementation(() => (
			<tr>
				<td>TableRows component</td>
			</tr>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Dashboard />,
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

		const tableRowComponents = screen.getAllByText('TableRows component');
		const totalPosts = screen.getByText(
			`Total posts: ${mockContext.posts.length}`,
		);

		expect(tableRowComponents.length).toBe(mockContext.posts.length);
		expect(totalPosts).toBeInTheDocument();
	});
	it('should not render a table with a list of posts if the posts array is empty', async () => {
		const mockContext = {
			posts: [],
			onDeletePost: vi.fn(),
		};

		TableRows.mockImplementation(() => (
			<tr>
				<td>TableRows component</td>
			</tr>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Dashboard />,
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

		const element = screen.getByText('There are not posts.');

		expect(element).toBeInTheDocument();
	});
	it('should navigate to "/posts/editor" path if the new post link is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			posts: [{ _id: '0' }, { _id: '1' }],
			onDeletePost: vi.fn(),
		};

		TableRows.mockImplementation(() => (
			<tr>
				<td>TableRows component</td>
			</tr>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Dashboard />,
						},
						{
							path: '/posts/editor',
							element: <div>PostDetail component</div>,
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

		const link = screen.getByRole('link', { name: 'New Post' });

		await user.click(link);

		const postDetailComponent = screen.getByText('PostDetail component');
		expect(postDetailComponent).toBeInTheDocument();
	});
});
