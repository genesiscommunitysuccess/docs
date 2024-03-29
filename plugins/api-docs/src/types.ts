export type PackageConfig = {
  name: string;
  enabled: boolean;
  src: {
    api_docs?: string;
    img_dir?: string;
    readme: string;
  };
  output: {
    directory: string;
    api_docs?: string;
    img_dir?: string;
    readme: string;
    keywords?: string[];
    tags?: string[];
    pages: {
      title: string;
      sidebar_label: string;
      id: string;
      keywords?: string[];
      tags?: string[];
    }[];
  };
};
