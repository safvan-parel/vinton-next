import SliderForm from "../SliderForm";
import { createSliderAction } from "../actions";

export default function CreateSliderPage() {
    return <SliderForm action={createSliderAction} />;
}
