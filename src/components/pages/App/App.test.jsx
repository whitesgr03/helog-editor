import { vi, describe, it, expect, beforeAll } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
	RouterProvider,
	createMemoryRouter,
	useOutletContext,
} from 'react-router-dom';
import { useEffect } from 'react';

import { App } from './App';

import { Header } from '../../layout/Header/Header';
import { Loading } from '../../utils/Loading';
import { Alert } from './Alert';
import { Error } from '../../utils/Error/Error';
import { Modal } from './Modal';
import { CreateUsername } from '../../../components/pages/App/CreateUsername';
import { Login } from '../Account/Login';

import { getUser, getUserPostList } from '../../../utils/handleUser';

vi.mock('../../../components/layout/Header/Header');
vi.mock('../../../components/layout/Footer/Footer');
vi.mock('../../../components/pages/App/Alert');
vi.mock('../../../components/pages/App/Modal');
vi.mock('../../../components/pages/App/CreateUsername');
vi.mock('../../../components/utils/Loading');
vi.mock('../../../components/utils/Error/Error');
vi.mock('../../../components/pages/Account/Login');
vi.mock('../../../utils/handleUser');

describe('App component', () => {
	beforeAll(() => {
		const noop = () => {};
		Object.defineProperty(window, 'scrollTo', {
			value: noop,
			writable: true,
		});
	});
	it('should render the dark theme if browser prefers color scheme is dark.', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		const mockMatchMedia = vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: true,
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(mockMatchMedia)
			.toBeCalledTimes(1)
			.toBeCalledWith('(prefers-color-scheme: dark)');
	});
	it('should render the dark theme if the dark theme of localstorage is set.', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});

		const localstorage = {
			setItem: vi.spyOn(Storage.prototype, 'setItem'),
			getItem: vi
				.spyOn(Storage.prototype, 'getItem')
				.mockReturnValueOnce('true'),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(localstorage.getItem).toBeCalledWith('darkTheme');
		expect(localstorage.setItem).toBeCalledWith('darkTheme', 'true');
	});
	it('should render the dark theme if the dark theme of url search params is set.', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
				},
			],
			{
				initialEntries: ['/?theme=true'],
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
	});
	it(`should render the Error component if fetching the user's post data fails and the retrieved response status is not 404`, async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getUserPostList: {
				success: false,
				message: 'error',
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Error.mockImplementation(() => <div>Error component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it(`should update the post state if fetching the user's post data is successfully`, async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'example',
				},
			},
			getUserPostList: {
				success: true,
				data: [{ _id: '0', title: 'new' }],
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { posts } = useOutletContext();

			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
				</div>
			);
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const items = screen.getAllByRole('listitem');

		expect(items.length).toBe(mockResolve.getUserPostList.data.length);
	});
	it('should render the Error component if fetching the user data fails and the retrieved response status is not 404', async () => {
		const mockResolve = {
			getUser: {
				success: false,
				message: 'error',
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Error.mockImplementation(() => <div>Error component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should update the user state if fetching the user data is successfully', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'new_user',
				},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { user } = useOutletContext();
			return <div>{user.username}</div>;
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const username = screen.getByText('new_user');

		expect(username).toBeInTheDocument();
	});
	it('should render the Login component if the user is not logged in', async () => {
		const mockResolve = {
			getUser: {
				success: false,
				status: 404,
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Login.mockImplementation(() => <div>Login component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { user } = useOutletContext();
			return <div>{user.username}</div>;
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const loginComponent = screen.getByText('Login component');

		expect(loginComponent).toBeInTheDocument();
	});
	it('should render the CreateUsername component if the user is first logged in', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Modal.mockImplementation(({ children }) => (
			<div>
				<p>Modal component</p>
				{children}
			</div>
		));
		CreateUsername.mockImplementation(() => (
			<div>CreateUsername component</div>
		));
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { user } = useOutletContext();
			return <div>{user.username}</div>;
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const modalComponent = screen.getByText('Modal component');
		const createUsernameComponent = screen.getByText(
			'CreateUsername component',
		);

		expect(modalComponent).toBeInTheDocument();
		expect(createUsernameComponent).toBeInTheDocument();
	});
	it('should toggle the color theme if the switch is clicked', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'new_user',
				},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};
		const mockDarkTheme = 'true';

		Loading.mockImplementation(() => <div>Loading component</div>);
		Header.mockImplementation(({ onColorTheme }) => (
			<div>
				<button onClick={onColorTheme}>Header button</button>
			</div>
		));
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockDarkTheme);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const headerButton = screen.getByRole('button', { name: 'Header button' });

		await user.click(headerButton);

		expect(mockSetItem).toBeCalledWith(
			'darkTheme',
			JSON.stringify(!mockDarkTheme),
		);
	});
	it('should update the alert state if the alert message is added', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'new_user',
				},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		const mockAlert = { message: 'new alert', error: true, delay: 50 };

		Loading.mockImplementation(() => <div>Loading component</div>);

		Alert.mockImplementation(({ alert, onAlert }) => {
			useEffect(() => {
				alert.length === 1 &&
					setTimeout(() => {
						onAlert([]);
					}, alert[0].delay);
			}, [alert, onAlert]);
			return (
				<>
					{alert.length === 1 && (
						<div className={alert[0].error ? 'error' : ''}>
							{alert[0].message}
						</div>
					)}
				</>
			);
		});
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');

		const MockComponent = () => {
			const { onAlert } = useOutletContext();
			return (
				<div>
					<button onClick={() => onAlert(mockAlert)}>Alert button</button>
				</div>
			);
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const alertButton = screen.getByRole('button', {
			name: 'Alert button',
		});

		await user.click(alertButton);

		const alert = screen.getByText(mockAlert.message);

		expect(alert).toHaveClass(/error/).toBeInTheDocument();

		await waitForElementToBeRemoved(() => screen.getByText(mockAlert.message));
	});
	it('should render the modal component if a modal is activated', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'example',
				},
			},
			getUserPostList: {
				success: true,
				data: {},
			},
		};

		const mockModal = {
			component: 'A component',
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Modal.mockImplementation(({ clickToClose, children }) => (
			<div className={clickToClose ? 'close' : ''}>{children}</div>
		));
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { onActiveModal } = useOutletContext();
			return (
				<button onClick={() => onActiveModal(mockModal)}>Modal button</button>
			);
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const modalButton = screen.getByRole('button', {
			name: 'Modal button',
		});

		await user.click(modalButton);

		const modalComponent = screen.getByText(mockModal.component);

		expect(modalComponent).toHaveClass(/close/).toBeInTheDocument();
	});
	it('should add a post to the posts array if the handleCreatePost function is executed', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: { username: 'example' },
			},
			getUserPostList: {
				success: true,
				data: [{ _id: '0', title: 'old' }],
			},
		};
		const mockNewPost = {
			_id: '1',
			title: 'new',
		};

		const MockComponent = () => {
			const { posts, onCreatePost } = useOutletContext();
			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
					<button
						onClick={() => {
							onCreatePost(mockNewPost);
						}}
					>
						Add button
					</button>
				</div>
			);
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const item = screen.getByRole('listitem');

		expect(item).toHaveTextContent(mockResolve.getUserPostList.data[0].title);

		const addButton = screen.getByText('Add button');

		await user.click(addButton);

		const items = screen.getAllByRole('listitem');

		expect(items.length).toBe(2);
		expect(items[0]).toHaveTextContent(mockNewPost.title);
	});
	it('should update a specified post of posts array if the handleUpdatePost function is executed', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: { username: 'example' },
			},
			getUserPostList: {
				success: true,
				data: [{ _id: '0', title: 'first' }],
			},
		};
		const mockNewPost = {
			_id: '0',
			title: 'edited',
		};

		const MockComponent = () => {
			const { posts, onUpdatePost } = useOutletContext();
			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
					<button
						onClick={() => {
							onUpdatePost(mockNewPost);
						}}
					>
						Component button
					</button>
				</div>
			);
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const item = screen.getByRole('listitem');

		expect(item).toHaveTextContent(mockResolve.getUserPostList.data[0].title);

		const componentButton = screen.getByText('Component button');

		await user.click(componentButton);

		expect(item).toHaveTextContent(mockNewPost.title);
	});
	it('should delete a specified post of posts array if the handleDeletePost function is executed', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: { username: 'example' },
			},
			getUserPostList: {
				success: true,
				data: [
					{
						_id: '0',
						title: 'first',
					},
					{
						_id: '1',
						title: 'second',
					},
				],
			},
		};
		const mockDeletedPostId = '0';

		const MockComponent = () => {
			const { posts, onDeletePost } = useOutletContext();
			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
					<button
						onClick={() => {
							onDeletePost(mockDeletedPostId);
						}}
					>
						Delete button
					</button>
				</div>
			);
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getUserPostList.mockResolvedValueOnce(mockResolve.getUserPostList);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		let items = screen.getAllByRole('listitem');

		expect(items.length).toBe(2);

		const componentButton = screen.getByText('Delete button');

		await user.click(componentButton);

		items = screen.getAllByRole('listitem');

		expect(items.length).toBe(1);
		expect(items[0]).toHaveTextContent(
			mockResolve.getUserPostList.data[1].title,
		);
	});
});
