import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { CreateUsername } from '../../../components/pages/App/CreateUsername';
import { Loading } from '../../../components/utils/Loading';

import { updateUser } from '../../../utils/handleUser';

vi.mock('../../../utils/handleUser');
vi.mock('../../../components/utils/Loading');

describe('CreateUsername component', () => {
	it('should change a field values if the field is entered', async () => {
		const user = userEvent.setup();
		const mockProps = {};

		const mockName = '_changed';

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
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

		const usernameField = screen.getByLabelText('Create username', {
			selector: 'input',
		});

		await user.type(usernameField, mockName);

		expect(usernameField).toHaveValue(mockName);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {};
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Create username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent('Username is required.');
	});
	it('should be verified successfully, if the input is correct after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {};
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Create username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent('Username is required.');

		await user.type(usernameField, 'new_name');

		await waitFor(() => {
			expect(usernameField).not.toHaveClass(/error/);
			expect(usernameErrorMessage).toHaveTextContent('Message placeholder');
		});
	});
	it('should render the corresponding error field message, if the input is still incorrect after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {};
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Create username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent('Username is required.');

		await user.type(usernameField, '#&@*($#$');

		await waitFor(() => {
			expect(usernameField).toHaveClass(/error/);
			expect(usernameErrorMessage).toHaveTextContent(
				'Username must be alphanumeric.',
			);
		});
	});
	it('should render an error field message if the username update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {};
		const mockFetchResult = {
			success: false,
			fields: {
				username: 'error',
			},
		};

		updateUser.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameLabel = screen.getByText('Create username');
		const usernameField = screen.getByLabelText('Create username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.type(usernameField, 'new_name');
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateUser).toBeCalledTimes(1);
		expect(usernameLabel).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			mockFetchResult.fields.username,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should render Error component if the username update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onError: vi.fn(),
		};
		const mockFetchResult = {
			success: false,
		};

		updateUser.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
				},
				{
					path: '/error',
					element: <div>Error page</div>,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByLabelText('Create username');

		await user.type(usernameField, 'new_name');
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(mockProps.onError).toBeCalledTimes(1);
		expect(updateUser).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should update the username if the username field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onUser: vi.fn(),
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};
		const mockFetchResult = {
			success: true,
			data: 'success',
		};

		updateUser.mockResolvedValueOnce(mockFetchResult);

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CreateUsername {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByLabelText('Create username');

		await user.type(usernameField, 'new_name');
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(mockProps.onUser).toBeCalledWith(mockFetchResult.data);
		expect(mockProps.onUser).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(updateUser).toBeCalledTimes(1);

		expect(loadingComponent).not.toBeInTheDocument();
	});
});
