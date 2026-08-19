import { solutionsDefaults } from "@/cms/defaults/solutions";

export const solutionsType = {
    type: "solutions",
    slug: "solutions",
    title: "Solutions",
    defaults: solutionsDefaults,
    sections: [
        {
            id: "intro",
            label: "Intro",
            hint: "The first thing visitors see at the top of the page.",
            fields: [
                { name: "eyebrow", label: "Small label", type: "text" },
                { name: "headline", label: "Headline", type: "text" },
                { name: "subhead", label: "Subtitle", type: "textarea" },
                { name: "title", label: "Section title", type: "text" },
                { name: "body", label: "Body", type: "textarea" },
            ],
        },
        {
            id: "approach",
            label: "Integrated Approach",
            hint: "Dark band with three service cards. Each card can have several items.",
            fields: [
                { name: "backgroundImage", label: "Background image", type: "image" },
                { name: "smallHeader", label: "Small label", type: "text" },
                { name: "headline", label: "Headline", type: "text" },
                { name: "intro", label: "Intro", type: "textarea" },
                {
                    name: "cards",
                    label: "Service cards",
                    type: "list",
                    itemLabel: "Card",
                    fields: [
                        { name: "name", label: "Card name", type: "text" },
                        {
                            name: "items",
                            label: "Services",
                            type: "list",
                            itemLabel: "Service",
                            fields: [
                                { name: "title", label: "Title", type: "text" },
                                { name: "description", label: "Description", type: "textarea" },
                                { name: "link", label: "Learn more URL", type: "text" },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "sectors",
            label: "Project Environments",
            hint: "Large illustration with labels placed by X and Y percent.",
            fields: [
                { name: "label", label: "Small label", type: "text" },
                { name: "headline", label: "Headline", type: "textarea" },
                { name: "image", label: "Illustration", type: "image" },
                {
                    name: "hotspots",
                    label: "Labels on image",
                    type: "list",
                    itemLabel: "Label",
                    fields: [
                        { name: "label", label: "Text", type: "text" },
                        { name: "x", label: "X position (%)", type: "number" },
                        { name: "y", label: "Y position (%)", type: "number" },
                        { name: "link", label: "Link (optional)", type: "text" },
                    ],
                },
            ],
        },
        {
            id: "next",
            label: "Built for What Comes Next",
            hint: "Closing dark section at the bottom of the page.",
            fields: [
                { name: "headline", label: "Headline", type: "text" },
                { name: "subhead", label: "Subtitle", type: "text" },
                { name: "tagline", label: "Highlight line", type: "text" },
                { name: "body", label: "Body", type: "textarea" },
            ],
        },
        {
            id: "divider",
            label: "Graphic Divider",
            hint: "Optional full-width image under the last section.",
            fields: [
                { name: "image", label: "Banner image", type: "image" },
            ],
        },
    ],
};
