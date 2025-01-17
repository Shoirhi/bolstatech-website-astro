export interface SiteConfig {
  title: string;
  description: string;
  sns: {
    x: {
      url: string,
      username: string,
    },
    github: {
      url: string,
      username: string,
    },
  };
  sourceCode: string;
}
