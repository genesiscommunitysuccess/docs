"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    packages: [
        {
            name: "@genesislcap/grid-pro",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/005_grids/001_grid-pro",
                api_docs: "docs/api",
                readme: "01_grid-pro.mdx",
                keywords: ["genesis", "foundation", "ui", "grid", "grid-pro", "ag"],
                tags: [
                    "connected",
                    "datasource",
                    "grid",
                    "grid-pro",
                    "ag",
                ],
                pages: [
                    {
                        title: "Grid Pro",
                        sidebar_label: "Grid Pro",
                        id: "grid-pro",
                    },
                ],
            },
        },
        {
            name: "@genesislcap/grid-tabulator",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/005_grids/002_grid-tabulator",
                api_docs: "docs/api",
                readme: "01_grid-tabulator.mdx",
                keywords: ["genesis", "foundation", "ui", "grid", "grid-tabulator", "tabulator"],
                tags: [
                    "connected",
                    "datasource",
                    "grid",
                    "grid-tabulator",
                    "tabulator",
                ],
                pages: [
                    {
                        title: "Grid Tabulator",
                        sidebar_label: "Grid Tabulator",
                        id: "grid-tabulator",
                    },
                ],
            },
        },
        {
            name: "@genesislcap/g2plot-chart",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/006_charts/001_g2plot-chart",
                api_docs: "docs/api",
                readme: "01_g2plot-chart.mdx",
                keywords: ["genesis", "foundation", "ui", "chart", "g2plot-chart", "g2plot"],
                tags: [
                    "connected",
                    "datasource",
                    "chart",
                    "g2plot-chart",
                    "g2plot",
                ],
                pages: [
                    {
                        title: "G2Plot Chart",
                        sidebar_label: "G2Plot Chart",
                        id: "g2plot-chart",
                    },
                ],
            },
        },
    ],
};
