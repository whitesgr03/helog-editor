import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';

import './styles/index.css';

import { Error } from './components/utils/Error/Error';
import { NotFound } from './components/utils/Error/NotFound';
import { Dashboard } from './components/pages/Dashboard/Dashboard';
import { App } from './components/pages/App/App';
import { PostEditor } from './components/pages/Post/PostEditor';

export const Router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: '/',
				element: <App />,
				children: [
					{
						index: true,
						element: <Navigate to="/posts" />,
					},
					{
						path: '/posts',
						element: <Dashboard />,
					},
					{
						path: ':postId?/editor',
						element: <PostEditor />,
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
