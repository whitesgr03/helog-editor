import { object } from 'yup';

export const verifySchema = async ({ data, schema, context }) => {
	let result = {
		success: true,
		fields: {},
	};

	try {
		await object(schema).noUnknown().validate(data, {
			abortEarly: false,
			stripUnknown: true,
			context,
		});
	} catch (err) {
		for (const error of err.inner) {
			result.fields[error.path] = error.message;
		}
		result.success = false;
	}

	return result;
};
