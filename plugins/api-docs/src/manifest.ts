import { PackageConfig } from "./types";

export default {
  packages: <PackageConfig[]>[
    {
      name: "@genesislcap/foundation-testing",
      enabled: true,
      src: {
        api_docs: "./docs/api",
        readme: "./README.md",
      },
      output: {
        directory: "./docs/04_web/06_testing",
        api_docs: "docs/api",
        readme: "01_foundation-testing.md",
        keywords: ["genesis", "foundation", "ui", "testing"],
        tags: [
          "test",
          "testing",
          "frontend",
          "ui",
          "unit",
          "end-to-end",
          "e2e",
          "uvu",
          "playwright",
        ],
        pages: [
          {
            title: "Foundation Testing",
            id: "foundation-testing",
            sidebar_label: "Foundation Testing",
          },
        ],
      },
    },
    {
      name: "@genesislcap/foundation-filters",
      enabled: true,
      src: {
        api_docs: "./docs/api",
        readme: "./README.md",
      },
      output: {
        directory: "./docs/04_web/09_filters",
        api_docs: "docs/api",
        readme: "01_foundation-filters.mdx",
        keywords: ["genesis", "foundation", "ui", "filters"],
        tags: ["filter", "feature", "flags", "conditions"],
        pages: [
          {
            title: "Foundation Filters",
            sidebar_label: "Foundation Filters",
            id: "foundation-filters",
          },
        ],
      },
    },
    {
      name: "@genesislcap/foundation-reporting",
      enabled: true,
      img_dir: "docs/img",
      readme: "./README.md",
      output: {
        directory: "./docs/04_web/05_micro-front-ends/02_front-end-reporting",
        img_dir: "docs/img",
        readme: "02_foundation-reporting.md",
        keywords: ["web", "frontend", "ui", "micro-front-ends", "reporting"],
        tags: ["web", "frontend", "ui", "micro-front-ends", "reporting"],
        pages: [
          {
            title: "Foundation Reporting",
            sidebar_label: "Foundation Reporting",
            id: "foundation-reporting",
          },
        ],
      },
    },
    {
      name: "@genesislcap/foundation-header",
      enabled: true,
      src: {
        api_docs: "./docs/api",
        img_dir: "docs/img",
        readme: "./README.md",
      },
      output: {
        directory: "./docs/04_web/05_micro-front-ends/03_foundation-header",
        api_docs: "docs/api",
        img_dir: "docs/img",
        readme: "03_foundation-header.mdx",
        keywords: [
          "header",
          "sidebar",
          "frontend",
          "ui",
          "mf",
          "web",
          "micro frontends",
        ],
        tags: [
          "header",
          "sidebar",
          "frontend",
          "ui",
          "mf",
          "web",
          "micro frontends",
        ],
        pages: [
          {
            title: "Foundation Header",
            sidebar_label: "Foundation Header",
            id: "foundation-header",
          },
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
        directory:
          "./docs/04_web/05_micro-front-ends/04_foundation-entity-management",
        api_docs: "docs/api",
        img_dir: "docs/img",
        readme: "04_foundation-entity-management.mdx",
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
            title: "Foundation Entity Management",
            sidebar_label: "Foundation Entity Management",
            id: "foundation-entity-management",
          },
        ],
      },
    },
    {
      name: "@genesislcap/foundation-login",
      enabled: true,
      src: {
        api_docs: "./docs/api",
        img_dir: "docs/img",
        readme: "./README.md",
      },
      output: {
        directory: "./docs/04_web/05_micro-front-ends/05_foundation-login",
        api_docs: "docs/api",
        img_dir: "docs/img",
        readme: "05_foundation-login.md",
        keywords: [
          "web",
          "login",
          "foundation login",
          "frontend",
          "ui",
          "micro-front-ends",
        ],
        tags: [
          "web",
          "login",
          "foundation login",
          "frontend",
          "ui",
          "micro-front-ends",
        ],
        pages: [
          {
            title: "Foundation Login",
            sidebar_label: "Foundation Login",
            id: "foundation-login",
          },
        ],
      },
    },
    {
      name: "@genesislcap/foundation-layout",
      enabled: true,
      src: {
        api_docs: "./docs/api",
        img_dir: "docs/img",
        readme: "./README.md",
      },
      output: {
        directory: "./docs/04_web/10_dynamic-layout",
        api_docs: "docs/api",
        img_dir: "docs/img",
        readme: "10_foundation-layout.mdx",
        keywords: [
          "web",
          "layout",
          "foundation layout",
          "frontend",
          "ui",
          "golden layout",
        ],
        tags: [
          "web",
          "layout",
          "foundation layout",
          "frontend",
          "ui",
          "golden layout",
        ],
        pages: [
          {
            title: "Foundation Layout",
            sidebar_label: "Foundation Layout",
            id: "foundation-layout",
          },
        ],
      },
    },
    {
      name: "@genesislcap/foundation-comms",
      enabled: true,
      src: {
        api_docs: "./docs/api",
        readme: "./README.md",
      },
      output: {
        directory: "./docs/04_web/11_comms",
        api_docs: "docs/api",
        readme: "01_foundation-comms.mdx",
        keywords: ["genesis", "foundation", "ui", "comms"],
        tags: [
          "data server",
          "request server",
          "event handler",
          "stream",
          "snapshot",
        ],
        pages: [
          {
            title: "Foundation Comms",
            sidebar_label: "Foundation Comms",
            id: "foundation-comms",
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
        directory: "./docs/04_web/12_forms",
        api_docs: "docs/api",
        readme: "01_foundation-forms.mdx",
        keywords: ["genesis", "foundation", "ui", "forms", "smart forms"],
        tags: ["genesis", "foundation", "ui", "forms", "smart forms"],
        pages: [
          {
            title: "Foundation Forms",
            sidebar_label: "Foundation Forms",
            id: "foundation-forms",
          },
        ],
      },
    },
  ],
};
