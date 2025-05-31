import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { useAlert, useModal, useAppDataAPI, AppProvider } from './AppContext';

describe('App Context', () => {
	it('should add alert data', async () => {
		const user = userEvent.setup();
		const mockAlertData = [
			{ message: 'alert1', error: true, delay: 0 },
			{ message: 'alert2', error: false, delay: 0 },
			{ message: 'alert3', error: true, delay: 0 },
		];

		const MockComponent = () => {
			const alert = useAlert();
			const { onAlert } = useAppDataAPI();

			return (
				<div>
					<ul>
						{alert.map(data => (
							<li key={data.message} className={data.error ? 'error' : ''}>
								{data.message}
							</li>
						))}
					</ul>
					<button onClick={() => onAlert(mockAlertData)}>Send an alert</button>
				</div>
			);
		};

		render(
			<AppProvider>
				<MockComponent />
			</AppProvider>,
		);

		const button = screen.getByRole('button', { name: 'Send an alert' });

		await user.click(button);

		const items = screen.getAllByRole('listitem');

		expect(items).toHaveLength(mockAlertData.length);

		items.forEach((item, index) => {
			expect(item).toHaveTextContent(mockAlertData[index].message);
			mockAlertData[index].error
				? expect(item).toHaveClass(/error/)
				: expect(item).not.toHaveClass(/error/);
		});
	});
	it('should add modal data', async () => {
		const user = userEvent.setup();
		const mockComponentContent = 'Active component';
		const mockModalData = {
			component: <div data-testid="component">{mockComponentContent}</div>,
			clickBgToClose: true,
		};

		const MockComponent = () => {
			const modal = useModal();
			const { onModal } = useAppDataAPI();

			return (
				<div>
					{modal.component && (
						<div
							data-testid="modal"
							className={modal.clickBgToClose ? 'close' : ''}
						>
							{modal.component}
						</div>
					)}
					<button onClick={() => onModal(mockModalData)}>Active a modal</button>
				</div>
			);
		};

		render(
			<AppProvider>
				<MockComponent />
			</AppProvider>,
		);

		const button = screen.getByRole('button', { name: 'Active a modal' });

		await user.click(button);

		const modal = screen.getByTestId('modal');
		const component = screen.getByTestId('component');

		mockModalData.clickBgToClose
			? expect(modal).toHaveClass('close')
			: expect(modal).not.toHaveClass('close');
		expect(component).toHaveTextContent(mockComponentContent);
	});
});
