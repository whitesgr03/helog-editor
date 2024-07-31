import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";

import UserProvider from "./components/UserProvider";
import Error from "./components/layout/Error";
import NotFound from "./components/layout/NotFound";
import Dashboard from "./components/Dashboard";
import App from "./components/App";
import PostCreate from "./components/PostCreate";
import Callback from "./components/Callback";

const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <UserProvider />,
				children: [
					{
						path: "/",
						element: <App />,
						children: [
							{
								path: "*",
								element: <NotFound />,
							},
							{
								index: true,
								element: <Dashboard />,
							},

							{
								path: "post/editor",
								element: <PostCreate />,
							},
						],
					},
					{
						path: "/callback",
						element: <Callback />,
					},
					{
						path: "error",
						element: <Error />,
					},
				],
			},
		])}
	/>
);

export default router;
