import { NextResponse } from "next/server";

export function apiSuccess({ message = "", data = null, status = 200, meta = null }) {
    const reponse = { success: true, message };

    if (data) reponse.data = data;

    if (meta) reponse.meta = meta;

    return NextResponse.json(reponse, { status });
}

export function apiError({ message = "Error", status = 500, errors = null }) {
    const response = { success: false, message };

    if (errors) response.errors = errors;

    return NextResponse.json(response, { status });
}