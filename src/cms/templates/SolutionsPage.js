import "./solutions.css";

function LearnMore({ href }) {
    if (!href) {
        return <span className="sol-link">Learn more</span>;
    }

    return (
        <a href={href} className="sol-link">
            Learn more
        </a>
    );
}

export default function SolutionsPage({ content }) {
    const intro = content?.intro || {};
    const approach = content?.approach || {};
    const sectors = content?.sectors || {};
    const next = content?.next || {};
    const divider = content?.divider || {};
    const cards = approach.cards || [];
    const hotspots = sectors.hotspots || [];

    const approachStyle = approach.backgroundImage
        ? { backgroundImage: `url(${approach.backgroundImage})` }
        : undefined;

    return (
        <div className="sol-page">
            <section className="sol-intro">
                <div className="container">
                    {intro.eyebrow ? <p className="sol-eyebrow">{intro.eyebrow}</p> : null}
                    {intro.headline ? <h1 className="sol-headline">{intro.headline}</h1> : null}
                    {intro.subhead ? <p className="sol-subhead">{intro.subhead}</p> : null}
                    {intro.title ? <h2 className="sol-title">{intro.title}</h2> : null}
                    {intro.body ? <p className="sol-body">{intro.body}</p> : null}
                </div>
            </section>

            <section className="sol-approach" style={approachStyle}>
                <div className="container">
                    {approach.smallHeader ? <p className="sol-kicker">{approach.smallHeader}</p> : null}
                    <div className="row g-4 align-items-start mb-5">
                        <div className="col-lg-5">
                            {approach.headline ? <h2 className="sol-headline sol-headline-light">{approach.headline}</h2> : null}
                        </div>
                        <div className="col-lg-6 offset-lg-1">
                            {approach.intro ? <p className="sol-lead">{approach.intro}</p> : null}
                        </div>
                    </div>
                    <div className="row g-4">
                        {cards.map((card, index) => (
                            <div key={`${card.name}-${index}`} className="col-lg-4">
                                <article className="sol-card">
                                    {card.name ? <h3>{card.name}</h3> : null}
                                    {(card.items || []).map((item, itemIndex) => (
                                        <div key={`${item.title}-${itemIndex}`} className="sol-card-item">
                                            {item.title ? <h4>{item.title}</h4> : null}
                                            {item.description ? <p>{item.description}</p> : null}
                                            <LearnMore href={item.link} />
                                        </div>
                                    ))}
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="sol-sectors">
                <div className="container">
                    {sectors.label ? <p className="sol-eyebrow">{sectors.label}</p> : null}
                    {sectors.headline ? <h2 className="sol-title">{sectors.headline}</h2> : null}
                    <div className="sol-map">
                        {sectors.image ? (
                            <img src={sectors.image} alt={sectors.headline || "Project environments"} />
                        ) : (
                            <div className="sol-map-placeholder">Upload an isometric illustration from the admin editor.</div>
                        )}
                        {hotspots.map((spot, index) => {
                            const style = {
                                left: `${Number(spot.x) || 0}%`,
                                top: `${Number(spot.y) || 0}%`,
                            };

                            if (spot.link) {
                                return (
                                    <a
                                        key={`${spot.label}-${index}`}
                                        href={spot.link}
                                        className="sol-hotspot"
                                        style={style}
                                    >
                                        {spot.label}
                                    </a>
                                );
                            }

                            return (
                                <span key={`${spot.label}-${index}`} className="sol-hotspot" style={style}>
                                    {spot.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="sol-next">
                <div className="container">
                    {next.headline ? <h2 className="sol-headline sol-headline-light">{next.headline}</h2> : null}
                    {next.subhead ? <p className="sol-subhead sol-subhead-light">{next.subhead}</p> : null}
                    {next.tagline ? <p className="sol-tagline">{next.tagline}</p> : null}
                    {next.body ? <p className="sol-body sol-body-light">{next.body}</p> : null}
                </div>
            </section>

            {divider.image ? (
                <section className="sol-divider">
                    <img src={divider.image} alt="" />
                </section>
            ) : null}
        </div>
    );
}
