import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DeletePostModel } from './DeletePostModel';
import { Loading } from '../../utils/Loading';

import { deletePost } from '../../../utils/handlePost';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../App/AppContext');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handlePost');

describe('DeletePostModel component', () => {
	it('should render an error message alert if delete a post fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			postId: '0',
			title: 'post',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(deletePost).mockImplementationOnce(
			() => new Promise((_r, reject) => setTimeout(() => reject(Error()), 300)),
		);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<DeletePostModel {...mockProps} />
			</QueryClientProvider>,
		);

		const button = screen.getByRole('button', { name: 'Delete' });

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(deletePost).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
	});
	it('should close modal if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			postId: '0',
			title: 'post',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<DeletePostModel {...mockProps} />
			</QueryClientProvider>,
		);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
	});
	it('should delete a post if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			postId: '0',
			title: 'post',
		};

		const mockFetchResult = {
			success: true,
			data: {},
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(deletePost).mockResolvedValueOnce(mockFetchResult);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

		const queryClient = new QueryClient();
		queryClient.setQueryData(['userPosts'], {
			pages: [{ data: { userPosts: [{ _id: mockProps.postId }] } }],
			pageParams: {},
		});
		render(
			<QueryClientProvider client={queryClient}>
				<DeletePostModel {...mockProps} />
			</QueryClientProvider>,
		);
		const button = screen.getByRole('button', { name: 'Delete' });
		const title = screen.getByText(mockProps.title);

		await user.click(button);

		expect(title).toBeInTheDocument();
		expect(deletePost).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
	});
});
