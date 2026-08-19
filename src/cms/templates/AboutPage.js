"use client";

import { useState } from "react";
import "./about.css";

function Journey({ journey }) {
    const entries = journey.entries || [];
    const [index, setIndex] = useState(0);
    const active = entries[index] || null;

    if (!entries.length && !journey.label && !journey.headline) {
        return null;
    }

    function next() {
        if (!entries.length) {
            return;
        }

        setIndex((value) => (value + 1) % entries.length);
    }

    return (
        <section className="about-journey">
            <div className="container">
                {journey.label ? <p className="about-kicker">{journey.label}</p> : null}
                {journey.headline ? <h2 className="about-headline about-headline-light">{journey.headline}</h2> : null}
                <div className="row g-4 align-items-start mt-2">
                    <div className="col-lg-3">
                        <ol className="about-years">
                            {entries.map((entry, entryIndex) => (
                                <li key={`${entry.year}-${entryIndex}`}>
                                    <button
                                        type="button"
                                        className={entryIndex === index ? "is-active" : ""}
                                        onClick={() => setIndex(entryIndex)}
                                    >
                                        {entry.year}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="col-lg-4">
                        {active?.title ? <h3 className="about-year-title">{active.title}</h3> : null}
                        {active?.body ? <p className="about-year-body">{active.body}</p> : null}
                    </div>
                    <div className="col-lg-5">
                        <div className="about-year-media">
                            {active?.image ? (
                                <img src={active.image} alt={active.title || active.year || ""} />
                            ) : (
                                <div className="about-placeholder">Upload a timeline image from the admin editor.</div>
                            )}
                            {entries.length > 1 ? (
                                <button type="button" className="about-next" onClick={next} aria-label="Next year">
                                    Next
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Team({ team }) {
    const [tab, setTab] = useState("people");
    const groups = team.groups || [];
    const lifeImages = (team.lifeImages || []).filter((item) => item.image);

    return (
        <section id="team" className="about-team">
            <div className="container">
                {team.label ? <p className="about-eyebrow">{team.label}</p> : null}
                {team.title ? <h2 className="about-title">{team.title}</h2> : null}
                {team.intro ? <p className="about-body mb-4">{team.intro}</p> : null}

                <div className="about-tabs">
                    <button type="button" className={tab === "people" ? "is-active" : ""} onClick={() => setTab("people")}>
                        Our People
                    </button>
                    <button type="button" className={tab === "philosophy" ? "is-active" : ""} onClick={() => setTab("philosophy")}>
                        Team Philosophy
                    </button>
                    <button type="button" className={tab === "life" ? "is-active" : ""} onClick={() => setTab("life")}>
                        Life at Vinton
                    </button>
                </div>

                {tab === "people"
                    ? groups.map((group, groupIndex) => (
                          <div key={`${group.heading}-${groupIndex}`} className="about-group">
                              {group.heading ? <h3 className="about-group-title">{group.heading}</h3> : null}
                              <div className="row g-4">
                                  {(group.members || []).map((member, memberIndex) => (
                                      <div key={`${member.name}-${memberIndex}`} className="col-md-4">
                                          <article className="about-member">
                                              {member.photo ? (
                                                  <img src={member.photo} alt={member.name || ""} />
                                              ) : (
                                                  <div className="about-placeholder about-placeholder-portrait">Portrait</div>
                                              )}
                                              {member.name ? <h4>{member.name}</h4> : null}
                                              {member.role ? <p>{member.role}</p> : null}
                                          </article>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))
                    : null}

                {tab === "philosophy" ? (
                    team.philosophy ? (
                        <p className="about-body" style={{ whiteSpace: "pre-wrap" }}>
                            {team.philosophy}
                        </p>
                    ) : (
                        <p className="text-muted">Add team philosophy in the admin editor.</p>
                    )
                ) : null}

                {tab === "life" ? (
                    lifeImages.length ? (
                        <div className="row g-3">
                            {lifeImages.map((item, index) => (
                                <div key={`${item.image}-${index}`} className="col-md-4">
                                    <img src={item.image} alt="" className="about-life-image" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">Upload Life at Vinton images in the admin editor.</p>
                    )
                ) : null}
            </div>
        </section>
    );
}

export default function AboutPage({ content }) {
    const intro = content?.intro || {};
    const journey = content?.journey || {};
    const visionMission = content?.visionMission || {};
    const values = content?.values || {};
    const team = content?.team || {};
    const anchors = intro.anchors || [];
    const items = values.items || [];

    return (
        <div className="about-page">
            <section className="about-intro">
                <div className="container">
                    {intro.eyebrow ? <p className="about-eyebrow">{intro.eyebrow}</p> : null}
                    {intro.headline ? <h1 className="about-headline">{intro.headline}</h1> : null}
                    {intro.subhead ? <p className="about-subhead">{intro.subhead}</p> : null}
                    {anchors.length ? (
                        <nav className="about-anchors">
                            {anchors.map((anchor, index) => (
                                <a key={`${anchor.href}-${index}`} href={anchor.href || "#"}>
                                    {anchor.label}
                                </a>
                            ))}
                        </nav>
                    ) : null}
                    <div className="row g-4 mt-4">
                        <div className="col-lg-5">
                            {intro.title ? <h2 className="about-title">{intro.title}</h2> : null}
                        </div>
                        <div className="col-lg-7">
                            {intro.body ? <p className="about-body">{intro.body}</p> : null}
                        </div>
                    </div>
                </div>
            </section>

            <Journey journey={journey} />

            <section className="about-vision">
                <div className="container">
                    <div id="vision" className="about-block">
                        {visionMission.visionTitle ? <h2 className="about-title">{visionMission.visionTitle}</h2> : null}
                        {visionMission.visionBody ? (
                            <p className="about-body" style={{ whiteSpace: "pre-wrap" }}>
                                {visionMission.visionBody}
                            </p>
                        ) : null}
                    </div>
                    <div id="mission" className="about-block">
                        {visionMission.missionTitle ? <h2 className="about-title">{visionMission.missionTitle}</h2> : null}
                        {visionMission.missionBody ? (
                            <p className="about-body" style={{ whiteSpace: "pre-wrap" }}>
                                {visionMission.missionBody}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>

            <section id="values" className="about-values">
                <div className="container">
                    {values.heading ? <h2 className="about-title">{values.heading}</h2> : null}
                    {values.intro ? <p className="about-body mb-4">{values.intro}</p> : null}
                    <div className="row g-4">
                        {items.map((item, index) => (
                            <div key={`${item.title}-${index}`} className="col-md-4">
                                <article className="about-value">
                                    {item.icon ? <img src={item.icon} alt="" className="about-value-icon" /> : <span className="about-value-mark" />}
                                    {item.title ? <h3>{item.title}</h3> : null}
                                    {item.lead ? <p className="about-value-lead">{item.lead}</p> : null}
                                    {item.body ? <p>{item.body}</p> : null}
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Team team={team} />
        </div>
    );
}
