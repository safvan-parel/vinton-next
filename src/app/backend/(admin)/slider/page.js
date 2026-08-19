import Link from "next/link";
import { ROUTES } from "@/lib/admin-routes";
import { prisma } from "@/lib/prisma";
import { sliderSelect } from "@/repositories/sliderRepository";
import SliderTable from "./SliderTable";

export const dynamic = "force-dynamic";

export default async function SliderPage() {
    const sliders = await prisma.slider.findMany({
        select: sliderSelect,
        orderBy: { id: "desc" },
    });

    return (
        <div className="admin-card">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                <div>
                    <h1 className="mb-1">Sliders</h1>
                    <p className="mb-0">Manage homepage slider images and content.</p>
                </div>
                <Link href={ROUTES.SLIDER_CREATE} className="btn btn-primary">
                    Add Slider
                </Link>
            </div>

            <SliderTable sliders={sliders} />
        </div>
    );
}
