import { object } from 'yup';

export const verifySchema = async ({
	schema,
	data,
}: {
	schema: any;
	data: any;
}): Promise<{ success: boolean; fields?: any }> => {
	try {
		await object(schema).validate(data, {
			abortEarly: false,
			stripUnknown: true,
		});
		return { success: true };
	} catch (err: any) {
		return {
			success: false,
			fields: err.inner.reduce(
				(obj: any, error: any) =>
					Object.assign(obj, { [error.path]: error.message }),
				{},
			),
		};
	}
};
