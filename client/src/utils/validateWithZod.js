export const validateWithZod = (schema, data) => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const errors = {};

  result.error.errors.forEach((err) => {
    const field = err.path[0];
    if (!errors[field]) {
      errors[field] = err.message;
    }
  });

  return { success: false, errors };
};