import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeletePostModel } from '../../../components/pages/Dashboard/DeletePostModel';
import { Loading } from '../../../components/utils/Loading';

import { deletePost } from '../../../utils/handlePost';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handlePost');

describe('DeletePostModel component', () => {
	it('should render an error message alert if delete a post fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			id: 'test',
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: false,
		};

		deletePost.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		render(<DeletePostModel {...mockProps} />);

		const button = screen.getByRole('button', { name: 'Delete' });

		user.click(button);

		const loadingComponent = await screen.findByText('Loading component');

		expect(deletePost).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should close modal if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		render(<DeletePostModel {...mockProps} />);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete a post if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			id: '0',
			title: 'target-title',
			onDeletePost: vi.fn(),
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: true,
			data: {},
		};

		deletePost.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		render(<DeletePostModel {...mockProps} />);

		const button = screen.getByRole('button', { name: 'Delete' });
		const title = screen.getByText(mockProps.title);

		user.click(button);

		const loadingComponent = await screen.findByText('Loading component');

		expect(title).toBeInTheDocument();
		expect(deletePost).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(mockProps.onDeletePost)
			.toBeCalledWith(mockProps.id)
			.toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});
