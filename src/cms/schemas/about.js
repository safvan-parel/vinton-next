import { aboutDefaults } from "@/cms/defaults/about";

export const aboutType = {
    type: "about",
    slug: "about",
    title: "About Us",
    defaults: aboutDefaults,
    sections: [
        {
            id: "intro",
            label: "Intro",
            hint: "The first thing visitors see at the top of the page.",
            fields: [
                { name: "eyebrow", label: "Small label", type: "text" },
                { name: "headline", label: "Headline", type: "text" },
                { name: "subhead", label: "Subtitle", type: "textarea" },
                {
                    name: "anchors",
                    label: "Jump links",
                    type: "list",
                    itemLabel: "Link",
                    fields: [
                        { name: "label", label: "Label", type: "text" },
                        { name: "href", label: "Link (#vision)", type: "text" },
                    ],
                },
                { name: "title", label: "Section title", type: "text" },
                { name: "body", label: "Body", type: "textarea" },
            ],
        },
        {
            id: "journey",
            label: "Our Journey",
            hint: "Dark timeline. Each year has a photo and a short story.",
            fields: [
                { name: "label", label: "Small label", type: "text" },
                { name: "headline", label: "Headline", type: "text" },
                {
                    name: "entries",
                    label: "Timeline",
                    type: "list",
                    itemLabel: "Year",
                    fields: [
                        { name: "year", label: "Year", type: "text" },
                        { name: "title", label: "Title", type: "text" },
                        { name: "body", label: "Story", type: "textarea" },
                        { name: "image", label: "Photo", type: "image" },
                    ],
                },
            ],
        },
        {
            id: "visionMission",
            label: "Vision & Mission",
            hint: "Two text blocks that sit in the middle of the page.",
            fields: [
                { name: "visionTitle", label: "Vision heading", type: "text" },
                { name: "visionBody", label: "Vision text", type: "textarea" },
                { name: "missionTitle", label: "Mission heading", type: "text" },
                { name: "missionBody", label: "Mission text", type: "textarea" },
            ],
        },
        {
            id: "values",
            label: "Core Values",
            hint: "A grid of value cards with an icon, title, and short text.",
            fields: [
                { name: "heading", label: "Heading", type: "text" },
                { name: "intro", label: "Intro", type: "textarea" },
                {
                    name: "items",
                    label: "Values",
                    type: "list",
                    itemLabel: "Value",
                    fields: [
                        { name: "icon", label: "Icon", type: "image" },
                        { name: "title", label: "Title", type: "text" },
                        { name: "lead", label: "Short line", type: "text" },
                        { name: "body", label: "Body", type: "textarea" },
                    ],
                },
            ],
        },
        {
            id: "team",
            label: "Team",
            hint: "People photos, philosophy text, and Life at Vinton images.",
            fields: [
                { name: "label", label: "Small label", type: "text" },
                { name: "title", label: "Headline", type: "text" },
                { name: "intro", label: "Intro", type: "textarea" },
                {
                    name: "groups",
                    label: "Teams",
                    type: "list",
                    itemLabel: "Team",
                    fields: [
                        { name: "heading", label: "Team name", type: "text" },
                        {
                            name: "members",
                            label: "People",
                            type: "list",
                            itemLabel: "Person",
                            fields: [
                                { name: "name", label: "Name", type: "text" },
                                { name: "role", label: "Role", type: "text" },
                                { name: "photo", label: "Photo", type: "image" },
                            ],
                        },
                    ],
                },
                { name: "philosophy", label: "Team philosophy", type: "textarea" },
                {
                    name: "lifeImages",
                    label: "Life photos",
                    type: "list",
                    itemLabel: "Photo",
                    fields: [{ name: "image", label: "Photo", type: "image" }],
                },
            ],
        },
    ],
};
