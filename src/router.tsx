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
import { PostEditorCreate } from './components/pages/Post/PostEditorCreate';
import { PostEditorUpdate } from './components/pages/Post/PostEditorUpdate';

export const Router = () => (
	<RouterProvider
		future={{
			v7_startTransition: true,
		}}
		router={createBrowserRouter(
			[
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
							path: '/posts/editor',
							element: <PostEditorCreate />,
						},
						{
							path: '/posts/:postId?/editor',
							element: <PostEditorUpdate />,
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
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		)}
	/>
);
