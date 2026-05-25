import { fileURLToPath } from 'node:url';
import deflist from 'remark-deflist';
import ghLinks from 'remark-github';

const resolvePath = path => fileURLToPath(new URL(path, import.meta.url));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CIRCUS',
  tagline: 'Platform for Computer-aided Diagnosis Research',
  url: 'https://circus-project.net/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'utrad-ical',
  projectName: 'circus',
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
    faster: true,
  },
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themeConfig: {
    navbar: {
      title: 'CIRCUS',
      logo: {
        alt: 'CIRCUS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBaseRegex: `(?!docs/(news|admin/installation))(docs)`,
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/admin/installation',
          label: 'Install',
          position: 'left',
        },
        {
          to: 'docs/releases',
          label: 'Releases',
          position: 'left',
        },
        {
          href: 'https://github.com/utrad-ical/circus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'CIRCUS Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/utrad-ical/circus',
            },
            {
              label: 'Improve Docs',
              href: 'https://github.com/utrad-ical/circus-docs',
            },
          ],
        },
        {
          title: 'UT Radiology ICAL Team',
          items: [
            {
              label: 'ICAL',
              to: 'http://www.ut-radiology.umin.jp/ical/',
            },
            {
              label: 'UT Radiology',
              to: 'http://www.ut-radiology.umin.jp/',
            },
            {
              label: 'The University of Tokyo Hospital',
              to: 'https://www.h.u-tokyo.ac.jp/',
            },
          ],
        },
        {
          title: 'The University of Tokyo',
          items: [
            {
              label: 'The University of Tokyo',
              to: 'https://www.u-tokyo.ac.jp/',
            },
            {
              label: 'Code of Conduct',
              to: 'https://www.u-tokyo.ac.jp/ja/research/ethics/index.html',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CIRCUS Project.`,
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: resolvePath('./sidebars.js'),
          editUrl: 'https://github.com/utrad-ical/circus-docs/edit/main',
          remarkPlugins: [
            deflist,
            [ghLinks, { repository: 'utrad-ical/circus' }],
          ],
        },
        blog: false,
        theme: {
          customCss: [
            resolvePath('./src/css/custom.scss'),
            resolvePath('./src/css/icons.scss'),
          ],
        },
      },
    ],
  ],
  plugins: ['docusaurus-plugin-sass'],
};

export default config;
