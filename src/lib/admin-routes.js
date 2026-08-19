const PREFIX = "/backend";

export const ROUTE_PREFIX = PREFIX;

export const ROUTES = {
    LOGIN: PREFIX + "/login",
    REGISTER: PREFIX + "/register",
    BACKEND: PREFIX + "/dashboard",
    SLIDER: PREFIX + "/slider",
    SLIDER_CREATE: PREFIX + "/slider/create",
    SLIDER_EDIT: PREFIX + "/slider/[id]/edit",
    BLOGS: PREFIX + "/blogs",
    BLOG_CREATE: PREFIX + "/blogs/create",
    BLOG_EDIT: PREFIX + "/blogs/[id]/edit",
    SETTINGS: PREFIX + "/settings",
    PROFILE: PREFIX + "/profile",
    PAGES: PREFIX + "/pages",
    PAGE_EDIT: PREFIX + "/pages/[slug]/edit",
};

export function sliderEditPath(id) {
    return PREFIX + `/slider/${id}/edit`;
}

export function blogEditPath(id) {
    return PREFIX + `/blogs/${id}/edit`;
}

export function pageEditPath(slug) {
    return PREFIX + `/pages/${slug}/edit`;
}