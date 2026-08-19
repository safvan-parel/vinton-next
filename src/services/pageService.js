import { deleteUploadedFile, pageUpload, savePageImage } from "@/lib/upload";
import { getPageType, listPageTypes } from "@/cms/registry";
import { pageRepository } from "@/repositories/pageRepository";

function isImageFile(file) {
    return file instanceof File && file.size > 0;
}

function setPath(target, path, value) {
    const parts = path.split(".");
    let current = target;

    for (let i = 0; i < parts.length - 1; i += 1) {
        const key = Number.isInteger(Number(parts[i])) ? Number(parts[i]) : parts[i];
        const nextKey = parts[i + 1];
        const nextIsIndex = Number.isInteger(Number(nextKey));

        if (current[key] == null || typeof current[key] !== "object") {
            current[key] = nextIsIndex ? [] : {};
        }

        current = current[key];
    }

    const last = Number.isInteger(Number(parts[parts.length - 1]))
        ? Number(parts[parts.length - 1])
        : parts[parts.length - 1];

    current[last] = value;
}

function getPath(target, path) {
    return path.split(".").reduce((current, part) => {
        if (current == null) {
            return undefined;
        }

        const key = Number.isInteger(Number(part)) ? Number(part) : part;
        return current[key];
    }, target);
}

async function applyImageUploads(content, formData) {
    if (!formData) {
        return content;
    }

    const next = structuredClone(content);

    for (const [key, value] of formData.entries()) {
        if (!key.startsWith("image:") || !isImageFile(value)) {
            continue;
        }

        if (value.size > pageUpload.maxSize) {
            throw new Error("Image must be 10MB or smaller");
        }

        if (!pageUpload.allowedTypes.includes(value.type)) {
            throw new Error("Image must be JPG, PNG, WEBP, or GIF");
        }

        const path = key.slice("image:".length);
        const previous = getPath(next, path);
        const saved = await savePageImage(value);

        setPath(next, path, saved);

        if (typeof previous === "string" && previous && previous !== saved) {
            await deleteUploadedFile(previous);
        }
    }

    return next;
}

export const pageService = {
    async ensurePages() {
        const existing = await pageRepository.findAll();
        const slugs = new Set(existing.map((page) => page.slug));

        for (const type of listPageTypes()) {
            if (slugs.has(type.slug)) {
                continue;
            }

            await pageRepository.create({
                slug: type.slug,
                title: type.title,
                type: type.type,
                status: "draft",
                active: true,
                draftContent: type.defaults,
            });
        }

        return pageRepository.findAll();
    },

    async list() {
        return this.ensurePages();
    },

    async listEnabled() {
        const pages = await this.list();
        return pages.filter((page) => page.active);
    },

    async getBySlug(slug) {
        await this.ensurePages();

        const page = await pageRepository.findBySlug(slug);

        if (!page || !getPageType(page.type)) {
            throw new Error("Page not found");
        }

        return page;
    },

    async getDraft(slug) {
        return this.getBySlug(slug);
    },

    async getPublished(slug) {
        const page = await this.getBySlug(slug);

        if (page.status !== "published" || !page.publishedContent) {
            throw new Error("Page not found");
        }

        return page;
    },

    async getPublic(slug) {
        const pageType = getPageType(slug);

        if (!pageType) {
            throw new Error("Page not found");
        }

        await this.ensurePages();
        const page = await pageRepository.findBySlug(slug);

        if (page && page.active === false) {
            throw new Error("Page not found");
        }

        if (page?.active && page.status === "published" && page.publishedContent) {
            return {
                type: page.type,
                content: page.publishedContent,
            };
        }

        return {
            type: pageType.type,
            content: pageType.defaults,
        };
    },

    async saveDraft(slug, content, formData) {
        await this.getBySlug(slug);
        const draftContent = await applyImageUploads(content, formData);

        return pageRepository.update(slug, { draftContent });
    },

    async publish(slug) {
        const page = await this.getBySlug(slug);

        return pageRepository.update(slug, {
            status: "published",
            publishedContent: page.draftContent,
            publishedAt: new Date(),
        });
    },

    async unpublish(slug) {
        await this.getBySlug(slug);

        return pageRepository.update(slug, {
            status: "draft",
        });
    },

    async toggleActive(slug) {
        const page = await this.getBySlug(slug);

        return pageRepository.update(slug, {
            active: !page.active,
        });
    },
};
