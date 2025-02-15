import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Dropdown } from '../../../components/layout/Header/Dropdown';

import { handleFetch } from '../../../utils/handleFetch';

vi.mock('../../../utils/handleFetch');

describe('Dropdown component', () => {
	it('should render the user profile and logout button if the username of user prop is provided', () => {
		const mockProps = {
			user: {
				username: 'example',
			},
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const avatar = screen.getByText(
			mockProps.user.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockProps.user.username);
		const logoutBtn = screen.getByRole('button', { name: 'Logout' });

		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(logoutBtn).toBeInTheDocument();
	});
	it("should render the dark mode icon and text, if the 'darkTheme' prop is provided", () => {
		const mockProps = {
			darkTheme: true,
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Dark mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(button).toBeInTheDocument();
		expect(icon).toHaveClass(/moon/);
	});
	it('should switch color theme, if the color theme button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: ' example',
			},
			onColorTheme: vi.fn(),
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
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
			user: {
				username: 'example',
			},
			onCloseDropdown: vi.fn(),
		};

		const mockFetchResult = {
			success: false,
			message: 'error',
		};

		handleFetch.mockResolvedValueOnce(mockFetchResult);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		await user.click(button);

		expect(loadingIcon).toHaveClass(/load/);

		const errorComponent = screen.getByText('Error component');
		expect(errorComponent).toBeInTheDocument();
	});
	it('should logout, if the logout button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: 'example',
			},
		};

		const mockFetchResult = {
			success: true,
		};

		location = {
			assign: vi.fn(),
		};

		handleFetch.mockResolvedValueOnce(mockFetchResult);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		user.click(button);

		await waitFor(() => {
			expect(loadingIcon).toHaveClass(/load/);
		});

		expect(location.assign).toBeCalledTimes(1);
	});
});
