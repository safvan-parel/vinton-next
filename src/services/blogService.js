import { deleteUploadedFile, deleteUploadedFiles, saveBlogImage, saveBlogImages } from "@/lib/upload";
import { blogRepository } from "@/repositories/blogRepository";

export const blogService = {
    async list() {
        return blogRepository.findAll();
    },

    async getById(id) {
        const blog = await blogRepository.findById(id);

        if (!blog) {
            throw new Error("Blog not found");
        }

        return blog;
    },

    async create(data) {
        const primaryImage = await saveBlogImage(data.primaryImage);
        const images = await saveBlogImages(data.images);

        return blogRepository.create({
            title: data.title,
            primaryImage,
            desc1: data.desc1,
            images,
            desc2: data.desc2,
            active: data.active,
            createdById: data.createdById,
        });
    },

    async update(id, data) {
        const existing = await this.getById(id);
        const removed = (data.removeImages || []).filter((path) => existing.images.includes(path));
        const payload = {
            title: data.title,
            desc1: data.desc1,
            desc2: data.desc2,
            active: data.active,
            images: existing.images.filter((path) => !removed.includes(path)),
        };

        if (data.primaryImage) {
            payload.primaryImage = await saveBlogImage(data.primaryImage);
            await deleteUploadedFile(existing.primaryImage);
        }

        if (data.images?.length) {
            const added = await saveBlogImages(data.images);
            payload.images = [...payload.images, ...added];
        }

        const blog = await blogRepository.update(id, payload);

        await deleteUploadedFiles(removed);

        return blog;
    },

    async delete(id) {
        const existing = await this.getById(id);
        const blog = await blogRepository.delete(id);

        await deleteUploadedFile(existing.primaryImage);
        await deleteUploadedFiles(existing.images);

        return blog;
    },

    async changeStatus(id) {
        const existing = await this.getById(id);

        return blogRepository.update(id, {
            active: !existing.active,
        });
    },
};
