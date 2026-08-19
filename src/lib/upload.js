import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const SLIDER_DIR = "uploads/sliders";
const BLOG_DIR = "uploads/blogs";
const PAGE_DIR = "uploads/pages";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_PREFIXES = [`/${SLIDER_DIR}/`, `/${BLOG_DIR}/`, `/${PAGE_DIR}/`];

export const sliderUpload = {
    maxSize: MAX_IMAGE_SIZE,
    allowedTypes: ALLOWED_IMAGE_TYPES,
};

export const blogUpload = sliderUpload;
export const pageUpload = sliderUpload;

function uniqueName(originalName) {
    const ext = path.extname(originalName || "").toLowerCase() || ".jpg";
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
}

async function saveImage(file, dir) {
    const filename = uniqueName(file.name);
    const folder = path.join(process.cwd(), "public", dir);

    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));

    return `/${dir}/${filename}`;
}

export async function saveSliderImage(file) {
    return saveImage(file, SLIDER_DIR);
}

export async function saveBlogImage(file) {
    return saveImage(file, BLOG_DIR);
}

export async function saveBlogImages(files = []) {
    return Promise.all(files.map((file) => saveBlogImage(file)));
}

export async function savePageImage(file) {
    return saveImage(file, PAGE_DIR);
}

export async function deleteUploadedFile(filePath) {
    if (!filePath || !ALLOWED_PREFIXES.some((prefix) => filePath.startsWith(prefix))) {
        return;
    }

    try {
        await unlink(path.join(process.cwd(), "public", filePath));
    } catch {
        // File may already be gone.
    }
}

export async function deleteUploadedFiles(filePaths = []) {
    await Promise.all(filePaths.map((filePath) => deleteUploadedFile(filePath)));
}
