import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Modal } from '../../../components/pages/App/Modal';

describe('Modal component', () => {
	it(`should render children prop if children prop is provided`, () => {
		const mockProps = {
			children: 'children',
		};
		render(<Modal {...mockProps} />);

		const children = screen.getByText(mockProps.children);

		expect(children).toBeInTheDocument();
	});
	it(`should close modal if "clickToClose" prop is true and the close button is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			clickToClose: true,
			onActiveModal: vi.fn(),
		};
		render(<Modal {...mockProps} />);

		const closeButton = screen.getByTestId('close-btn');

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it(`should close modal if "clickToClose" prop is true and the div element with model class is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			clickToClose: true,
			onActiveModal: vi.fn(),
		};
		render(<Modal {...mockProps} />);

		const model = screen.getByTestId('modal');

		await user.click(model);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
