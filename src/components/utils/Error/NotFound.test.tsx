import { expect, describe, it } from 'vitest';
import { render } from '@testing-library/react';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { NotFound } from './NotFound';

describe('NotFound component', () => {
	it('should match snapshot', () => {
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <NotFound />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		const { asFragment } = render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
