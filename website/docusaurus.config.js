/* eslint-disable global-require */
/** @type import('@docusaurus/types').DocusaurusConfig */
module.exports = {
	title: 'Rematch',
	tagline: 'Rematch is Redux best practices without the boilerplate',
	url: 'https://rematchjs.org',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/logo.svg',
	organizationName: 'rematch', // Usually your GitHub org/user name.
	projectName: 'rematch', // Usually your repo name.
	themeConfig: {
		image: 'img/meta-image.png',
		hideableSidebar: true,
		sidebarCollapsible: true,
		colorMode: {
			defaultMode: 'light',
			disableSwitch: false,
			respectPrefersColorScheme: true,
		},
		prism: {
			// eslint-disable-next-line import/no-extraneous-dependencies
			theme: require('prism-react-renderer/themes/dracula'),
		},
		algolia: {
			// todo: set real keys
			apiKey: 'bf1caf576975a08099ac1d3dbbe58f96',
			indexName: 'rematchjs',
		},
		announcementBar: {
			id: 'supportus',
			content:
				'⭐️ If you like Rematch, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/rematch/rematch">GitHub</a>! ⭐️',
		},
		navbar: {
			title: 'Rematch',
			logo: {
				alt: 'Rematch Logo',
				src: 'img/logo.svg',
			},
			items: [
				{
					to: 'docs/',
					activeBasePath: 'docs',
					label: 'Documentation',
					position: 'right',
				},
				{
					to: 'examples/',
					activeBasePath: 'examples',
					label: 'Examples',
					position: 'right',
				},
				{
					to: 'blog/',
					activeBasePath: 'blog',
					label: 'Blog',
					position: 'right',
				},
				{
					href: 'https://github.com/rematch/rematch',
					label: 'GitHub',
					position: 'right',
				},
				{
					href: 'https://rematchjs.slack.com',
					label: 'Slack',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Documentation',
							to: 'docs',
						},
						{
							label: 'Examples',
							to: 'examples',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Stack Overflow',
							href: 'https://stackoverflow.com/questions/tagged/rematch',
						},
						{
							label: 'Slack',
							href: 'https://rematchjs.slack.com',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Blog',
							to: 'blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/rematch/rematch',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Rematch, Inc. Built with Docusaurus.`,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					path: '../docs',
					remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/rematch/rematch/edit/main/docs/',
				},
				blog: {
					path: '../blog',
					showReadingTime: true,
					postsPerPage: 3,
					feedOptions: {
						type: 'all',
						copyright: `Copyright © ${new Date().getFullYear()} Rematch, Inc.`,
					},
					blogSidebarCount: 'ALL',
					blogSidebarTitle: 'All our posts',
					editUrl: 'https://github.com/rematch/rematch/edit/main/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
}
