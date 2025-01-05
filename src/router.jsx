import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { Error } from './components/utils/Error/Error';
import { NotFound } from './components/utils/Error/NotFound';
import { Dashboard } from './components/pages/Dashboard/Dashboard';
import { App } from './components/pages/App/App';
import { PostCreate } from './components/pages/Post/PostCreate';

export const Router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: '/',
				element: <App />,
				children: [
					{
						path: '/',
						element: <Dashboard />,
						children: [
							{
								path: 'dashboard/error',
								element: <Error />,
							},
						],
					},
					{
						path: 'post/editor',
						element: <PostCreate />,
					},
					{
						path: '*',
						element: <NotFound />,
					},
					{
						path: 'error',
						element: <Error />,
					},
				],
			},
		])}
	/>
);
