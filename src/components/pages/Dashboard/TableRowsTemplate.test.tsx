import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TableRowsTemplate } from './TableRowsTemplate';

describe('TableRowsTemplate component', () => {
	it('should render the specified number of template items, if the count prop is provided', () => {
		const mockProp = { count: 6 };

		render(
			<table>
				<tbody>
					<TableRowsTemplate {...mockProp} />
				</tbody>
			</table>,
		);

		const items = screen.getAllByRole('row');

		expect(items).toHaveLength(mockProp.count);
	});
});
