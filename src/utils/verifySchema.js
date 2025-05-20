import { object } from 'yup';

export const verifySchema = async ({ schema, data }) => {
	try {
		await object(schema).validate(data, {
			abortEarly: false,
			stripUnknown: true,
		});
		return { success: true };
	} catch (err) {
		return {
			success: false,
			fields: err.inner.reduce(
				(obj, error) => Object.assign(obj, { [error.path]: error.message }),
				{},
			),
		};
	}
};
