import { deleteUploadedFile, saveSliderImage } from "@/lib/upload";
import { sliderRepository } from "@/repositories/sliderRepository";

export const sliderService = {
    async list() {
        return sliderRepository.findAll();
    },

    async getById(id) {
        const slider = await sliderRepository.findById(id);

        if (!slider) {
            throw new Error("Slider not found");
        }

        return slider;
    },

    async create(data) {
        const image = await saveSliderImage(data.image);

        return sliderRepository.create({
            title: data.title,
            desc: data.desc,
            image,
            active: data.active,
        });
    },

    async update(id, data) {
        const existing = await this.getById(id);
        const payload = {
            title: data.title,
            desc: data.desc,
            active: data.active,
        };

        if (data.image) {
            payload.image = await saveSliderImage(data.image);
            await deleteUploadedFile(existing.image);
        }

        return sliderRepository.update(id, payload);
    },

    async delete(id) {
        const existing = await this.getById(id);
        const slider = await sliderRepository.delete(id);

        await deleteUploadedFile(existing.image);

        return slider;
    },

    async changeStatus(id) {
        const existing = await this.getById(id);

        return sliderRepository.update(id, {
            active: !existing.active,
        });
    },
};
