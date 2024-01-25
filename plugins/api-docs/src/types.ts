export type Package = {
  name: string;
  enabled: boolean;
  api_docs?: string;
  readme?: string;
  output: {
    title: string;
    sidebar_label: string;
    id: string;
    directory: string;
    api_docs?: string;
    readme?: string;
    keywords?: string[];
    tags?: string[];
  }
}
