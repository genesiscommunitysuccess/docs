"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    packages: [
        {
            name: "@genesislcap/foundation-comms",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/002_server-communications/01_server-communications-docs",
                api_docs: "docs/api",
                readme: "index.mdx",
                keywords: ["genesis", "foundation", "comms", "connect", "server-communications", "services"],
                tags: [
                    "connected",
                    "comms",
                    "connect",
                    "services",
                    "server-communications",
                ],
            },
        },
        {
            name: "@genesislcap/foundation-entity-management",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/005_grids/002_entity-manager",
                api_docs: "docs/api",
                img_dir: "docs/img",
                readme: "index.mdx",
                keywords: [
                    "entity management",
                    "frontend",
                    "micro-front-ends",
                    "profile management",
                    "ui",
                    "user management",
                    "web",
                ],
                tags: [
                    "entity management",
                    "frontend",
                    "micro-front-ends",
                    "profile management",
                    "ui",
                    "user management",
                    "web",
                ],
                pages: [
                    {
                        title: "Real Time Data Grid (Entity Manager)",
                        sidebar_label: "Real Time Data Grid (Entity Manager)",
                        id: "entity-manager",
                    },
                ],
            },
        },
        {
            name: "@genesislcap/grid-pro",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/005_grids/003_grid-pro",
                api_docs: "docs/api",
                readme: "index.mdx",
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
                        title: "Enterprise Data Grid (Grid Pro)",
                        sidebar_label: "Enterprise Data Grid (Grid Pro)",
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
                directory: "./docs/001_develop/03_client-capabilities/005_grids/004_grid-tabulator",
                api_docs: "docs/api",
                readme: "index.mdx",
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
                        title: "Connected Data Grid (Tabulator)",
                        sidebar_label: "Connected Data Grid (Tabulator)",
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
                directory: "./docs/001_develop/03_client-capabilities/006_charts/002_g2plot-chart",
                api_docs: "docs/api",
                readme: "index.mdx",
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
                        sidebar_label: "Overview",
                        id: "g2plot-chart",
                    },
                ],
            },
        },
        {
            name: "@genesislcap/foundation-forms",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/007_forms/002_smart-forms",
                api_docs: "docs/api",
                readme: "01_smart-forms.mdx",
                keywords: ["genesis", "foundation", "ui", "forms", "smart forms"],
                tags: ["genesis", "foundation", "ui", "forms", "smart forms"],
                pages: [
                    {
                        title: "Smart forms",
                        sidebar_label: "Smart Forms",
                        id: "smart-forms",
                    },
                ],
            },
        },
        {
            name: "@genesislcap/foundation-i18n",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/020_internationalization/01_internationalization-docs",
                api_docs: "docs/api",
                readme: "index.mdx",
                keywords: ["genesis", "foundation", "i18n", "internationalization"],
                tags: [
                    "i18n",
                    "internationalization",
                ],
            },
        },
        {
            name: "@genesislcap/foundation-fdc3",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/021_desktop-interoperability",
                api_docs: "docs/api",
                readme: "01_foundation-fdc3.mdx",
                keywords: ["genesis", "foundation", "ui", "fdc3"],
                tags: ["genesis", "foundation", "ui", "fdc3"],
                pages: [
                    {
                        title: "Foundation FDC3",
                        sidebar_label: "Foundation FDC3",
                        id: "foundation-fdc3",
                    },
                ],
            },
        },
        {
            name: "@genesislcap/foundation-notifications",
            enabled: true,
            src: {
                api_docs: "./docs/api",
                img_dir: "docs/img",
                readme: "./README.md",
            },
            output: {
                directory: "./docs/001_develop/03_client-capabilities/013_toast-notifications",
                api_docs: "docs/api",
                readme: "index.mdx",
                keywords: ["genesis", "foundation", "notifications", "toast", "snackbar"],
                tags: [
                    "notifications",
                    "toasts",
                    "snackbar"
                ],
            },
        },
    ],
};
