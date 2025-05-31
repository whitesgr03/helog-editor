import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Alert } from './Alert';

describe('Alert component', () => {
	it(`should render no alert message if the alert prop is empty`, () => {
		const mockProps = {
			alert: [],
		};
		render(<Alert {...mockProps} />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		expect(alert)
			.not.toHaveClass(/active/)
			.not.toHaveClass(/error/);
		expect(message).not.toHaveTextContent();
	});
	it(`should render the alert message if the alert prop is provided`, () => {
		const mockProps = {
			alert: [{ message: 'alert-message', error: true, delay: 100 }],
			onAlert: vi.fn(),
		};
		render(<Alert {...mockProps} />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		expect(alert)
			.toHaveClass(/active/)
			.toHaveClass(/error/);
		expect(message).toHaveTextContent(mockProps.alert[0].message);
	});
	it(`should remove the alert message if the alert message is expires`, async () => {
		const mockProps = {
			alert: [{ message: 'alert-message', error: false, delay: 100 }],
			onAlert: vi.fn(),
		};
		render(<Alert {...mockProps} />);

		const alert = screen.getByTestId('alert');

		fireEvent.transitionEnd(alert);

		await waitFor(() => {
			expect(mockProps.onAlert).toBeCalledWith([]).toBeCalledTimes(1);
		});
	});
	it(`should pause the alert timer if the user mouse over to alert element`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			alert: [{ message: 'alert-message', error: false, delay: 100 }],
			onAlert: vi.fn(),
		};
		render(<Alert {...mockProps} />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		fireEvent.transitionEnd(alert);

		user.hover(message);

		expect(mockProps.onAlert).toBeCalledTimes(0);

		user.hover(alert);

		expect(mockProps.onAlert).toBeCalledTimes(0);

		user.unhover(alert);

		await waitFor(() => {
			expect(mockProps.onAlert).toBeCalledWith([]).toBeCalledTimes(1);
		});
	});
	it(`should render the second alert message if a second alert message is added`, async () => {
		let mockProps = {
			alert: [{ message: 'first-message', error: false, delay: 100 }],
			onAlert: vi.fn(),
		};
		const { rerender } = render(<Alert {...mockProps} />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		expect(message).toHaveTextContent(mockProps.alert[0].message);
		expect(alert).toHaveClass(/active/);

		mockProps.alert.push({
			message: 'second-message',
			error: true,
			delay: 100,
		});

		rerender(<Alert {...mockProps} />);

		expect(alert).not.toHaveClass(/active/);

		fireEvent.transitionEnd(alert);

		await waitFor(() => {
			expect(mockProps.onAlert)
				.toBeCalledWith([mockProps.alert[1]])
				.toBeCalledTimes(1);
		});
	});
});
