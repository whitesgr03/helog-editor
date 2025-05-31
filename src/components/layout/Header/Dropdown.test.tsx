import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Dropdown } from './Dropdown';

import { handleFetch } from '../../../utils/handleFetch';

vi.mock('../../../utils/handleFetch');

describe('Dropdown component', () => {
	it('should render the user profile and logout button if the username of user data is provided', () => {
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};

		const queryClient = new QueryClient();

		const mockUserInfo = {
			data: {
				username: 'example',
			},
		};

		queryClient.setQueryData(['userInfo'], mockUserInfo);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const avatar = screen.getByText(
			mockUserInfo.data.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockUserInfo.data.username);
		const logoutBtn = screen.getByRole('button', { name: 'Logout' });

		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(logoutBtn).toBeInTheDocument();
	});
	it("should render the dark mode icon and text, if the 'darkTheme' prop is provided", () => {
		const mockProps = {
			darkTheme: true,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const button = screen.getByRole('button', { name: 'Dark mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(button).toBeInTheDocument();
		expect(icon).toHaveClass(/moon/);
	});
	it('should switch color theme, if the color theme button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const button = screen.getByRole('button', { name: 'Light mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(icon).toHaveClass(/sun/);

		await user.click(button);

		expect(mockProps.onColorTheme).toBeCalledTimes(1);
	});
	it('should navigate to the "/error" path if logout fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};

		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});

		vi.mocked(handleFetch).mockRejectedValueOnce(Error());

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
				},
				{
					path: '/error',
					element: <div>Error component</div>,
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

		const button = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		await user.click(button);

		const errorComponent = screen.getByText('Error component');
		expect(errorComponent).toBeInTheDocument();
	});
	it('should logout, if the logout button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});
		const mockFetchResult = {
			success: true,
		};

		vi.mocked(handleFetch).mockImplementation(
			async () =>
				await new Promise(resolve =>
					setTimeout(() => resolve(mockFetchResult), 100),
				),
		);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const mockLocation = vi.fn();

		Object.defineProperty(window, 'location', {
			value: {
				assign: mockLocation,
			},
			writable: true,
		});

		const logoutButton = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		await user.click(logoutButton);

		await waitFor(() => {
			expect(loadingIcon).toHaveClass(/load/);
		});

		await waitFor(() => {
			expect(mockLocation).toBeCalledTimes(1);
		});
	});
});
