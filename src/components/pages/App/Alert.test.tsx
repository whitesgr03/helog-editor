import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Alert } from './Alert';
import { useAlert, useAppDataAPI } from './AppContext';
import { State } from './AppContext';

vi.mock('./AppContext');

describe('Alert component', () => {
	it(`should render no alert message if the alert data is empty`, () => {
		const mockAlertData = [] as State['alert'];
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAlert).mockReturnValue(mockAlertData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		render(<Alert />);

		const alert = screen.getByTestId('alert');

		expect(alert).not.toHaveClass(/active/);
		expect(alert).not.toHaveClass(/error/);
	});
	it(`should render the alert message if the alert data is provided`, () => {
		const mockAlertData = [
			{ message: 'alert-message', error: true, delay: 100 },
		];
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAlert).mockReturnValue(mockAlertData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		render(<Alert />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		expect(alert).toHaveClass(/active/);
		expect(alert).toHaveClass(/error/);
		expect(message).toHaveTextContent(mockAlertData[0].message);
	});
	it(`should remove the alert message if the alert message is expires`, async () => {
		let mockAlertData = [{ message: 'alert-message', error: true, delay: 100 }];
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAlert).mockReturnValue(mockAlertData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		render(<Alert />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		fireEvent.transitionEnd(alert);

		expect(alert).toHaveClass(/active/);
		expect(message).toHaveTextContent(mockAlertData[0].message);

		await waitFor(() => {
			expect(mockCustomHook.onAlert).toBeCalledWith([]);
			expect(mockCustomHook.onAlert).toBeCalledTimes(1);
			mockAlertData.pop();
		});

		fireEvent.transitionEnd(alert);

		expect(alert).not.toHaveClass(/active/);
		expect(alert).not.toHaveClass(/error/);
		expect(message).toHaveTextContent('');
	});
	it(`should pause the alert timer if the user mouse over to alert element`, async () => {
		const user = userEvent.setup();
		const mockAlertData = [
			{ message: 'alert-message', error: true, delay: 100 },
		];
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAlert).mockReturnValue(mockAlertData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		render(<Alert />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		fireEvent.transitionEnd(alert);

		user.hover(message);

		expect(mockCustomHook.onAlert).toBeCalledTimes(0);

		user.hover(alert);

		expect(mockCustomHook.onAlert).toBeCalledTimes(0);

		user.unhover(alert);

		await waitFor(() => {
			expect(mockCustomHook.onAlert).toBeCalledWith([]);
			expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		});
	});
	it(`should render the second alert message if a second alert message is added`, async () => {
		let mockAlertData = [{ message: 'alert-message', error: true, delay: 100 }];
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAlert).mockReturnValue(mockAlertData);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const { rerender } = render(<Alert />);

		const alert = screen.getByTestId('alert');
		const message = screen.getByTestId('message');

		expect(message).toHaveTextContent(mockAlertData[0].message);
		expect(alert).toHaveClass(/active/);

		mockAlertData.push({
			message: 'second-message',
			error: true,
			delay: 100,
		});

		rerender(<Alert />);

		expect(alert).not.toHaveClass(/active/);

		fireEvent.transitionEnd(alert);

		await waitFor(() => {
			expect(mockCustomHook.onAlert).toBeCalledWith([mockAlertData[1]]);
			expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		});
	});
});
