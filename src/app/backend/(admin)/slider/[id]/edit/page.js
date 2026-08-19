import { notFound } from "next/navigation";
import SliderForm from "../../SliderForm";
import { updateSliderAction } from "../../actions";
import { sliderService } from "@/services/sliderService";

export default async function EditSliderPage({ params }) {
    const { id } = await params;
    const sliderId = Number(id);

    if (!Number.isInteger(sliderId) || sliderId < 1) {
        notFound();
    }

    let slider;

    try {
        slider = await sliderService.getById(sliderId);
    } catch {
        notFound();
    }

    return <SliderForm action={updateSliderAction} slider={slider} />;
}
