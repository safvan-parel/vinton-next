import jwt from "jsonwebtoken";

const DEFAULT_EXPIRES_IN = "1d";
const REMEMBER_EXPIRES_IN = "30d";

export function getTokenExpiresIn(rememberMe = false) {
    return rememberMe ? REMEMBER_EXPIRES_IN : DEFAULT_EXPIRES_IN;
}

/** Cookie maxAge in seconds. Session cookie when rememberMe is false. */
export function getCookieMaxAge(rememberMe = false) {
    return rememberMe ? 60 * 60 * 24 * 30 : undefined;
}

export function generateToken(user, { expiresIn = DEFAULT_EXPIRES_IN } = {}) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}