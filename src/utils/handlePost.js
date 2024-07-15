// import handleFetch from "./handleFetch";

// const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/blog/comments`;

// const createComment = async ({ token, data }) => {
// 	const options = {
// 		method: "POST",
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(data),
// 	};
// 	return await handleFetch(url, options);
// };
// const updateComment = async ({ token, data, commentId }) => {
// 	const options = {
// 		method: "PUT",
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(data),
// 	};
// 	return await handleFetch(`${url}/${commentId}`, options);
// };
// const deleteComment = async ({ token, commentId }) => {
// 	const options = {
// 		method: "DELETE",
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	};
// 	return await handleFetch(`${url}/${commentId}`, options);
// };

// export { createComment, updateComment, deleteComment };
