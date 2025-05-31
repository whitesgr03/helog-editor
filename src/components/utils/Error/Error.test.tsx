import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Navigate } from 'react-router-dom';
import { Error } from './Error';
import userEvent from '@testing-library/user-event';

describe('Error component', () => {
	it('should handling refetching user info if the "onReGetUser" prop is provided and "Back to Home Page" is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onReGetUser: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Error {...mockProps} />,
				},
			],
			{
				initialEntries: ['/'],
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

		const link = screen.getByRole('link', { name: 'Back to Home Page' });

		await user.click(link);

		expect(mockProps.onReGetUser).toBeCalledTimes(1);
	});
	it('should render the "Go Back Previous Page" link if the "previousPath" state is provided', () => {
		const mockState = {
			previousPath: '/',
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Navigate to={'/error'} state={{ ...mockState }} />,
				},
				{
					path: '/error',
					element: <Error />,
				},
			],
			{
				initialEntries: ['/'],
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

		const element = screen.getByRole('link', { name: 'Go Back Previous Page' });

		expect(element).toBeInTheDocument();
	});
});
