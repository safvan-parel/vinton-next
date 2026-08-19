import { aboutType } from "@/cms/schemas/about";
import { solutionsType } from "@/cms/schemas/solutions";
import AboutPage from "@/cms/templates/AboutPage";
import SolutionsPage from "@/cms/templates/SolutionsPage";

const pageTypes = [solutionsType, aboutType];

const templates = {
    solutions: SolutionsPage,
    about: AboutPage,
};

export function listPageTypes() {
    return pageTypes;
}

export function getPageType(typeOrSlug) {
    return pageTypes.find((item) => item.type === typeOrSlug || item.slug === typeOrSlug) || null;
}

export function getPageTemplate(typeOrSlug) {
    const pageType = getPageType(typeOrSlug);
    return pageType ? templates[pageType.type] || null : null;
}
