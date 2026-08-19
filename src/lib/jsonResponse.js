export function jsonSuccess({ message = "", data = null }) {
    const respose = { success: true, message };

    if (data) respose.data = data;

    return respose
}

export function jsonError({ message = "Error", errors = null, values = null }) {
    const response = { success: false, message };

    if (errors) response.errors = errors;

    if (values) response.values = values;

    return response
}