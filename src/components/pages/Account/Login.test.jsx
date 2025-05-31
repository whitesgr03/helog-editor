import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Login } from './Login';
import { Loading } from '../../utils/Loading';

vi.mock('../../utils/Loading');

describe('Login component', () => {
	it('should navigate to the "/" path if the user data is provided', async () => {
		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/posts',
					element: <div>Dashboard component</div>,
				},
				{
					path: 'login',
					element: <Login />,
				},
			],
			{
				initialEntries: ['/login'],
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

		const component = screen.getByText('Dashboard component');

		expect(component).toBeInTheDocument();
	});
	it('should login with google account if the "Sign in with Google" button is clicked', async () => {
		const user = userEvent.setup();

		const mockFn = vi.fn();

		Object.defineProperty(window, 'location', {
			value: {
				assign: mockFn,
			},
		});
		const queryClient = new QueryClient();
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Login />,
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

		const googleButton = screen.getByText('Sign in with Google');

		user.click(googleButton);

		await screen.findByText('Loading component');

		expect(mockFn).toBeCalledTimes(1);
		expect(mockFn.mock.calls[0][0]).toMatch(/google/);
	});
	it('should login with facebook account if "Sign in with Facebook" button is clicked', async () => {
		const user = userEvent.setup();

		const mockFn = vi.fn();

		Object.defineProperty(window, 'location', {
			value: {
				assign: mockFn,
			},
		});

		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Login />,
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

		const googleButton = screen.getByText('Sign in with Facebook');

		user.click(googleButton);

		await screen.findByText('Loading component');

		expect(mockFn).toBeCalledTimes(1);
		expect(mockFn.mock.calls[0][0]).toMatch(/facebook/);
	});
});
