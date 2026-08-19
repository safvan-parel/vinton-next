import HomeBlogs from "@/components/web/HomeBlogs";
import HomeSlider from "@/components/web/HomeSlider";
import { blogService } from "@/services/blogService";
import { sliderService } from "@/services/sliderService";

export default async function Home() {
    const [sliders, blogs] = await Promise.all([
        sliderService.list(),
        blogService.list(),
    ]);

    return (
        <>
            <HomeSlider sliders={sliders.filter((slider) => slider.active)} />
            <HomeBlogs blogs={blogs.filter((blog) => blog.active)} />
        </>
    );
}
