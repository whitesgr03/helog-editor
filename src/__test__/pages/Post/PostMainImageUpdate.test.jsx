import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { PossMainImageUpdate } from '../../../components/pages/Post/PossMainImageUpdate';
import { Loading } from '../../../components/utils/Loading';

vi.mock('../../../components/utils/Loading');

describe('PostMainImageUpdate component', () => {
	it('should change the url field values if the field is entered', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onSetMainImage: vi.fn(),
		};

		const mockUrl = faker.image.url();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PossMainImageUpdate {...mockProps} />,
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

		const urlField = screen.getByLabelText('Image URL', {
			selector: 'input',
		});

		await user.type(urlField, mockUrl);

		expect(urlField).toHaveValue(mockUrl);
	});
	it('should render an error field message if the url field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onSetMainImage: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PossMainImageUpdate {...mockProps} />,
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

		const urlField = screen.getByText('Image URL');
		const urlErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(urlField).toHaveClass(/error/);
		expect(urlErrorMessage).toHaveTextContent('Image URL is required.');
	});
	it('should be verified successfully, if the input is correct after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onSetMainImage: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PossMainImageUpdate {...mockProps} />,
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
		const urlField = screen.getByText('Image URL');
		const urlErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(urlField).toHaveClass(/error/);
		expect(urlErrorMessage).toHaveTextContent('Image URL is required.');

		await user.type(urlField, faker.image.url());

		await waitFor(() => {
			expect(urlField).not.toHaveClass(/error/);
			expect(urlErrorMessage).toHaveTextContent('Message placeholder');
		});
	});
	it('should render the corresponding error field message, if the input is still incorrect after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onSetMainImage: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PossMainImageUpdate {...mockProps} />,
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
		const urlField = screen.getByText('Image URL');
		const urlErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(urlField).toHaveClass(/error/);
		expect(urlErrorMessage).toHaveTextContent('Image URL is required.');

		await user.type(urlField, 'test-image');

		await waitFor(() => {
			expect(urlField).toHaveClass(/error/);
			expect(urlErrorMessage).toHaveTextContent(
				'Image URL is not a valid URL.',
			);
		});
	});
	it('should render an error field message if the value of url field is not an invalid resource', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onSetMainImage: vi.fn(),
		};

		const mockUrl = faker.image.url();

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const mockImage = new Image();

		vi.spyOn(window, 'Image').mockReturnValueOnce(mockImage);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PossMainImageUpdate {...mockProps} />,
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
		const urlLabel = screen.getByText('Image URL');
		const urlErrorMessage = screen.getByText('Message placeholder');
		const urlField = screen.getByLabelText('Image URL', {
			selector: 'input',
		});

		await user.type(urlField, mockUrl);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		fireEvent.load(mockImage);

		expect(mockImage.src).toBe(mockUrl);
		expect(urlLabel).toHaveClass(/error/);
		expect(urlErrorMessage).toHaveTextContent(
			'URL is not a valid image source.',
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should update the main image if the url field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onSetMainImage: vi.fn(),
		};

		const mockUrl = faker.image.url();

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const mockImage = new Image();

		mockImage.width = 10;
		mockImage.height = 10;

		vi.spyOn(window, 'Image').mockReturnValueOnce(mockImage);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PossMainImageUpdate {...mockProps} />,
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
		const urlField = screen.getByLabelText('Image URL', {
			selector: 'input',
		});

		await user.type(urlField, mockUrl);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		fireEvent.load(mockImage);

		expect(mockImage.src).toBe(mockUrl);
		expect(mockProps.onSetMainImage)
			.toBeCalledWith(mockUrl, 'mainImage')
			.toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});
