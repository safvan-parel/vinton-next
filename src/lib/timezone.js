export const APP_TIMEZONE = "Asia/Kolkata";

export function applyAppTimezone() {
    process.env.TZ = APP_TIMEZONE;
}
