export function validate(schema, data) {
    const result = schema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    return {
        success: true,
        data: result.data,
    };
}