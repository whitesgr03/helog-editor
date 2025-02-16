import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Navigate } from 'react-router-dom';
import { Error } from '../../../components/utils/Error/Error';

describe('Error component', () => {
	it('should render the default error message and default link if the "customMessage" state is not provided', () => {
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Navigate to={'/error'} />,
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

		const element = screen.getByText(
			'Please come back later, or if you have any questions, contact us.',
		);

		const link = screen.getByRole('link', { name: 'Back to Home Page' });

		expect(element).toBeInTheDocument();
		expect(link).toBeInTheDocument();
	});
	it('should render the custom error message if the "customMessage" state is provided', () => {
		const mockState = {
			error: 'custom message.',
			customMessage: true,
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

		const element = screen.getByText('custom message.');

		expect(element).toBeInTheDocument();
	});
	it('should render the "Go Back" link if the "previousPath" state is provided', () => {
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

		const element = screen.getByRole('link', { name: 'Go Back' });

		expect(element).toBeInTheDocument();
	});
});
