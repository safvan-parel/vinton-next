export const ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
    HOME: "/",
    BLOGS: "/#blogs",
    SOLUTIONS: "/solutions",
    ABOUT: "/about",
};

export function blogPath(id) {
    return `/blogs/${id}`;
}

export function previewPath(slug, embed = false) {
    return embed ? `/preview/${slug}?embed=1` : `/preview/${slug}`;
}
