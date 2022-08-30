import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import Postel from 'postel'
import useBaseUrl from '@docusaurus/useBaseUrl'

import styles from './styles.module.css'
import useWindowSize from '../components/useWindowSize'

const features = [
	{
		title: 'No configuration',
		imageUrl: 'icons/tool.svg',
		description: (
			<>
				No more thunks, switch statements, action types, action creators. All is
				handled out of the box with just one file.
			</>
		),
	},
	{
		title: 'Plugins API',
		imageUrl: 'icons/globe.svg',
		description: (
			<>
				Rematch exposes a simple API interface to create custom plugins for
				extend Rematch functionality. Official plugins also out-of-the-box.
			</>
		),
	},
	{
		title: 'Built-in side-effects',
		imageUrl: 'icons/radio.svg',
		description: (
			<>
				Native <code>async/await</code> to call your external API&apos;s. You
				won&apos;t need redux-thunks anymore.
			</>
		),
	},
	{
		title: 'TypeScript support',
		imageUrl: 'icons/type.svg',
		description: (
			<>
				<code>TypeScript</code> support out of the box. You will have
				autocomplete of all your methods, state and reducers. Written 100% in
				TypeScript.
			</>
		),
	},
	{
		title: 'Framework agnostic',
		imageUrl: 'icons/cpu.svg',
		description: (
			<>
				Use Rematch in the browser, in React, in Angular, in Vue... anywhere. We
				ship ESM, UMD and CJS builds.
			</>
		),
	},
	{
		title: 'The smallest',
		imageUrl: 'icons/zap.svg',
		description: (
			<>
				Less than <code>2kb</code> and supports tree-shaking.
				<div className="margin-top--sm">
					<img
						loading="lazy"
						alt="Rematch Core Size"
						src="https://img.shields.io/bundlephobia/minzip/@rematch/core?style=flat"
					/>{' '}
					<img
						loading="lazy"
						alt="Rematch Core tree-shaking enabled"
						src="https://badgen.net/bundlephobia/tree-shaking/@rematch/core?style=flat"
					/>
				</div>
			</>
		),
	},
]

const Feature = ({ imageUrl, title, description }) => {
	const imgUrl = useBaseUrl(imageUrl)
	return (
		<div
			className={clsx('col col--4 text--center margin-top--lg', styles.feature)}
		>
			{imgUrl && (
				<div>
					<img
						loading="lazy"
						className={styles.featureImage}
						src={imgUrl}
						alt={title}
					/>
				</div>
			)}
			<h3>{title}</h3>
			<div className={styles.p}>{description}</div>
		</div>
	)
}

export const Wave = () => <div className={styles.underWave} />

const FeaturesSection = () => (
	<section className={clsx(styles.features, styles.waveTop)}>
		<div className="container">
			<div className="row">
				<div className="col col--8 text--center m-auto">
					<h1>Unreal features</h1>
					<p className={styles.p}>
						Using Redux always has been complicated, but now with Rematch you
						have more features than Redux offers with less than 2 kilobytes.
					</p>
				</div>
			</div>
			<div className="row">
				{features.map((props, idx) => (
					<Feature key={idx} {...props} />
				))}
			</div>
		</div>
	</section>
)

const OpenSourceSection = () => (
	<section className={clsx(styles.features, styles.absoluteFeatures)}>
		<div className="container margin-top--lg">
			<div className="row text--center row--align-center">
				<div className="col col--6 m-auto">
					<h1 className="h1">Open Sourcerers 🧙🏻‍♂️</h1>
					<div className="m-auto">
						<a href="https://github.com/rematch/rematch/graphs/contributors">
							<img
								className={styles.rematchContributorsImage}
								alt="Rematch Contributors"
								src="https://contrib.rocks/image?repo=rematch/rematch"
							/>
						</a>
					</div>
				</div>
				<div className="col col--6">
					<div className="row row--align-center">
						<div className="col col--6 text--center">
							<h3>+2000</h3>
							<p className={styles.p}>Projects using Rematch</p>
						</div>
						<div className="col col--6 text--center">
							<h3>+7000 ⭐️</h3>
							<p className={styles.p}>On Github</p>
						</div>
					</div>
					<div className="row">
						<div className="col col--6 text--center">
							<h3>+20.000</h3>
							<p className={styles.p}>Weekly downloads</p>
						</div>
						<div className="col col--6 text--center">
							<h3>A++</h3>
							<p className={styles.p}>Maintainability</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Wave />
	</section>
)

const HomeBalls = () => (
	<div className={clsx(styles.ball)} aria-hidden="true">
		<svg
			width="1360"
			height="578"
			viewBox="0 0 1360 578"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<linearGradient
					x1="50%"
					y1="0%"
					x2="50%"
					y2="100%"
					id="illustration-01"
				>
					<stop stopColor="#FFF" offset="0%" />
					<stop stopColor="#EAEAEA" offset="77.402%" />
					<stop stopColor="#DFDFDF" offset="100%" />
				</linearGradient>
			</defs>
			<g fill="url(#illustration-01)" fillRule="evenodd">
				<circle cx="1232" cy="128" r="128" />
				<circle cx="155" cy="443" r="64" />
			</g>
		</svg>
	</div>
)

const NeverHasBeenThatEasy = () => (
	<section className={styles.features}>
		<div className="container">
			<div className="row row--align-center">
				<div className="col col--6 text--left">
					<h1>Never has been that easy</h1>
					<p className={styles.p}>
						<ul>
							<li className="margin-top--md">
								Automatic intellisense with TypeScript steroids, autocomplete
								everything, avoid regressions.
							</li>
							<li className="margin-top--md">
								In just one file you can handle all your business logic with
								native Redux performance.
							</li>
							<li className="margin-top--md">
								Rematch it&apos;s less than 1,7kb introduces best-practices to
								avoid Redux boilerplate.
							</li>
						</ul>
					</p>
					<Link
						className={clsx(
							'button button--outline button--tertiary button--lg',
							styles.getStarted
						)}
						to={useBaseUrl('docs/')}
					>
						Get Started {'->'}
					</Link>
				</div>
				<div className="col col--6 text--center margin-top--lg">
					<img
						loading="lazy"
						alt="Real code of Rematch with TypeScript"
						style={{ borderRadius: '0.75rem' }}
						src={useBaseUrl('/img/real-code.gif')}
					/>
				</div>
			</div>
		</div>
	</section>
)

const Popover = ({ isMobile, company, children }) => (
	<Postel
		title="Toggle testimonials"
		preferredAutoPlacement="top"
		triggerDelay={isMobile ? 0 : 375}
		trigger={isMobile ? 'click' : 'hover'}
		content={
			<div className={styles.postelContainer}>
				<div className={styles.postelHeader}>
					<img
						loading="lazy"
						src={company.logo}
						alt={`${company.name} Logo`}
						className={styles.postelImg}
					/>
					<p className={styles.postelHeaderName}>{company.name}</p>
				</div>
				<div>
					<p className={styles.postelInfo}>{company.popover?.testimonial}</p>
				</div>
			</div>
		}
	>
		{children}
	</Postel>
)

const TrustedBy = () => {
	const { width } = useWindowSize()
	const isMobile = width <= 1224

	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					<div className="col col--12 text--center">
						<h1>Trusted by the best frontend teams</h1>
					</div>
					<div className="col col--12 text--center margin-top--lg">
						{[
							{
								name: 'Adobe',
								logo: useBaseUrl('/img/showroom/adobe.png'),
								href: 'https://www.adobe.com/es',
							},
							{
								name: 'Alibaba',
								href: 'https://www.alibaba.com',
								logo: useBaseUrl('/img/showroom/alibaba.png'),
							},
							{
								name: 'Gatsby',
								href: 'https://www.gatsbyjs.com/',
								logo: useBaseUrl('/img/showroom/gatsby.svg'),
							},
							{
								name: 'Facebook',
								href: 'https://opensource.facebook.com/',
								logo: useBaseUrl('/img/showroom/fb-incubator.png'),
							},
							{
								name: 'Allfunds',
								logo: useBaseUrl('/img/showroom/allfunds.png'),
								href: 'https://allfunds.com/',
							},
							{
								name: 'Kuaishou',
								logo: useBaseUrl('/img/showroom/kuaishou.png'),
								href: 'https://www.kuaishou.com/en',
								popover: {
									testimonial:
										'We are using Rematch in some of our internal projects. Rematch is an awesome wrapper of redux which let me think so little about state management. Thanks for the community!',
								},
							},
							{
								name: 'Sueddeutsche',
								href: 'https://www.sueddeutsche.de/',
								logo: useBaseUrl('/img/showroom/suddeutsche.png'),
							},
						]
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((company) => {
								const element = (
									<a target="__blank" rel="noopener" href={company.href}>
										<div className={styles.trustedBy}>
											<div className={styles.trustedByContainerImage}>
												<img
													loading="lazy"
													className={styles.trustedByImage}
													src={company.logo}
													alt={`${company.name} Logo`}
												/>
											</div>
										</div>
									</a>
								)
								return company.popover ? (
									<Popover company={company} isMobile={isMobile}>
										{element}
									</Popover>
								) : (
									element
								)
							})}
					</div>
				</div>
			</div>
		</section>
	)
}

const ReduxVsRematch = () => (
	<section className={styles.features}>
		<div className="container">
			<div className="row">
				<div className="col col--12 text--center">
					<h1>Redux vs Rematch</h1>
					<div className="align--center">
						<table className="table-align--center">
							<thead>
								<tr>
									<th>Features</th>
									<th>Redux</th>
									<th>Rematch</th>
								</tr>
							</thead>
							<tbody>
								{[
									{
										feature: 'Simple setup',
										rematchHas: true,
										reduxHas: false,
									},
									{
										feature: 'No boilerplate',
										rematchHas: true,
										reduxHas: false,
									},
									{
										feature: 'Maintainability',
										rematchHas: true,
										reduxHas: false,
									},
									{
										feature: 'Configurable',
										rematchHas: true,
										reduxHas: true,
									},
									{
										feature: 'Redux Devtools',
										rematchHas: true,
										reduxHas: true,
									},
									{
										feature: 'Async/await effects',
										rematchHas: true,
										reduxHas: false,
									},
									{
										feature: 'Official plugins',
										rematchHas: true,
										reduxHas: false,
									},
									{
										feature: 'Mobile ready',
										rematchHas: true,
										reduxHas: false,
									},
								].map(({ feature, rematchHas, reduxHas }) => (
									<tr key={feature}>
										<td>{feature}</td>
										<td>{reduxHas ? <span>✅</span> : <span>❌</span>}</td>
										<td>{rematchHas ? <span>✅</span> : <span>❌</span>}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
)

const Home = () => (
	<Layout title="Rematch" description="Redux made easy with Rematch">
		<header>
			<div className={clsx('container', styles.heroContainer)}>
				<h5 className={styles.h5}>
					Redux made <u>easy</u>
				</h5>
				<h1 className={styles.h1}>Rematch</h1>
				<p className={styles.p}>
					Rematch is Redux best practices without the boilerplate
				</p>
				<div className={styles.buttons}>
					<Link
						className={clsx(
							'button button--outline button--tertiary button--lg',
							styles.getStarted
						)}
						to={useBaseUrl('docs/')}
					>
						Are you ready to Rematch?
					</Link>
				</div>
				<img
					className={clsx(styles.heroImage)}
					src={useBaseUrl('/img/code.svg')}
					alt="Example of Rematch Code"
				/>
			</div>
		</header>
		<main>
			<FeaturesSection />
			<OpenSourceSection />
			<ReduxVsRematch />
			<TrustedBy />
			<NeverHasBeenThatEasy />
			{/* absolute containers */}
			<Wave />
			<HomeBalls />
		</main>
	</Layout>
)

export default Home
