export default function HomeSlider({ sliders }) {
    if (!sliders.length) {
        return null;
    }

    const hasMultiple = sliders.length > 1;

    return (
        <div id="homeSlider" className="carousel slide" data-bs-ride="carousel">
            {hasMultiple && (
                <div className="carousel-indicators">
                    {sliders.map((slider, index) => (
                        <button
                            key={slider.id}
                            type="button"
                            data-bs-target="#homeSlider"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            <div className="carousel-inner">
                {sliders.map((slider, index) => (
                    <div
                        key={slider.id}
                        className={`carousel-item${index === 0 ? " active" : ""}`}
                    >
                        <img
                            src={slider.image}
                            alt={slider.title}
                            className="d-block w-100"
                            style={{ height: "420px", objectFit: "cover" }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h2>{slider.title}</h2>
                            {slider.desc ? <p>{slider.desc}</p> : null}
                        </div>
                    </div>
                ))}
            </div>

            {hasMultiple && (
                <>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#homeSlider"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#homeSlider"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </>
            )}
        </div>
    );
}
