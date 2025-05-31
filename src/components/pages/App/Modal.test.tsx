import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

import { useModal, useAppDataAPI } from './AppContext';

vi.mock('./AppContext');

describe('Modal component', () => {
	it(`should render modal if component of modal is provided`, () => {
		const mockModalData = {
			component: <div data-testid="active-modal">Active modal component</div>,
			clickBgToClose: true,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useModal).mockReturnValue(mockModalData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		render(<Modal />);

		const activeModal = screen.getByTestId('active-modal');
		expect(activeModal).toBeInTheDocument();
	});
	it(`should close modal component if the close button is clicked`, async () => {
		const user = userEvent.setup();
		let mockModalData = {
			component: <div>Active modal component</div>,
			clickBgToClose: true,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useModal).mockReturnValue(mockModalData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const { rerender } = render(<Modal />);

		const closeButton = screen.getByTestId('close-btn');

		await user.click(closeButton);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);

		mockModalData.component = mockCustomHook.onModal.mock.calls[0][0].component;

		rerender(<Modal />);

		const modalComponent = screen.queryByTestId('modal');
		expect(modalComponent).toBeNull();
	});
	it(`should close modal component if "clickBgToClose" of modal data is true and the div element with model class is clicked`, async () => {
		const user = userEvent.setup();
		let mockModalData = {
			component: <div>Active modal component</div>,
			clickBgToClose: true,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useModal).mockReturnValue(mockModalData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const { rerender } = render(<Modal />);

		const model = screen.getByTestId('modal');

		await user.click(model);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);

		mockModalData.component = mockCustomHook.onModal.mock.calls[0][0].component;

		rerender(<Modal />);

		const modalComponent = screen.queryByTestId('modal');
		expect(modalComponent).toBeNull();
	});
});
