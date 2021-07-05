import React, { useMemo } from 'react'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { Wave } from '.'
import styles from './styles.module.css'
import useWindowSize from '../components/useWindowSize'

const FIRST_SECTION = [
	"You'll learn why Redux was created",
	'How it was created and which are the principal concepts',
	"You'll build a VanillaJS website using Redux and Rematch",
	"You'll build a complete Amazon like website",
	'Get familiar with Rematch ecosystem of plugins',
	'Write unit and integration tests with Jest and Testing Library',
	'Create a React Native application with Expo and Yarn Workspaces',
	'Persisting data with Redux Persist and Rematch',
]
const SECOND_SECTION = [
	'Using selectors with Reselect and Rematch Select',
	'Building from scratch a Rematch Plugin and publishing it to NPM',
	'Rewrite the whole Amazon like website to TypeScript',
	'Understand TypeScript utility types exported of Rematch',
	'Explore how to create from scratch with Vite a real world website',
	'Implement infinite scrolling with React Hooks and Rematch',
	'Discover Rematch performance optimizations like memoization',
	'Optimize our website with React performance optimizations',
]
const BookPage = (): React.ReactElement => {
	const { width } = useWindowSize()
	const isMobile = useMemo(() => width <= 840, [width])
	return (
		<Layout
			title="Redux made easy with Rematch book"
			description="Redux made easy with Rematch official book"
		>
			<div>
				<div className="row padding--lg m-auto">
					<div
						className={clsx(
							'col col--8 m-auto text--center',
							styles.flex,
							styles['flex-column']
						)}
					>
						<h1 className={clsx(styles.h2, 'text--center')}>
							Redux made easy with Rematch
						</h1>
						<p className={clsx(styles.p, 'text--center')}>
							Reduce Redux boilerplate and apply best practices with Rematch
						</p>
						<div className="m-auto text--center">
							<a
								className={clsx(
									'button button--outline button--primary button--lg',
									styles.getStarted
								)}
								data-extlink
								target="_blank"
								href="https://amz.run/4iDY"
							>
								Purchase on Amazon
							</a>
						</div>
					</div>
					<div className="col col--4 text--center padding-top--lg">
						<img src="https://images-na.ssl-images-amazon.com/images/I/41uBNjJDYpS._SX403_BO1,204,203,200_.jpg" />
					</div>
				</div>
				<div className={clsx('row padding--lg m-auto', styles.waveTop)}>
					<h2>
						What you'll <u>learn</u>
						{'->'}
					</h2>
					<div className={clsx('col col--12', styles.flex)}>
						{isMobile ? (
							<ul>
								{[...FIRST_SECTION, ...SECOND_SECTION].map((key) => (
									<li key={key}>{key}</li>
								))}
							</ul>
						) : (
							<>
								<ul>
									{FIRST_SECTION.map((key) => (
										<li key={key}>{key}</li>
									))}
								</ul>
								<ul>
									{SECOND_SECTION.map((key) => (
										<li key={key}>{key}</li>
									))}
								</ul>
							</>
						)}
					</div>
				</div>
				<div
					className={clsx('row padding--lg m-auto', styles.absoluteFeatures)}
				>
					<div
						className={clsx(
							'col col--6 m-auto text--center',
							styles.flex,
							styles['flex-column']
						)}
					>
						<h3 className={styles.h3}>Amazhop website</h3>
						<p className={styles.p}>
							You will build an amazing React application with TypeScript,
							Rematch, TailwindCSS, with Vite as bundler.
						</p>
						<a
							className={clsx(
								'button button--outline button--tertiary button--lg',
								styles.getStarted
							)}
							data-extlink
							target="_blank"
							href="https://github.com/PacktPublishing/Redux-Made-Easy-with-Rematch"
						>
							Learn more
						</a>
					</div>
					<div className={clsx('col col--6 padding-top--lg')}>
						<video
							width="640"
							height="480"
							autoPlay
							loop
							className={styles.video}
						>
							<source
								src={useBaseUrl('/img/amazhop-website.webm')}
								type="video/webm"
							/>
							Your browser does not support the video tag.
						</video>
					</div>
					<Wave />
				</div>

				<div className={clsx('row padding--lg m-auto text--center')}>
					<div className={clsx('col col--12')}>
						<div className="row padding--lg m-auto text--center">
							<div className="col col--12">
								<h3 className={styles.h3}>Technologies used</h3>
								<p className={styles.p}>
									Latest trending technologies used with their best practices
								</p>
							</div>
						</div>
						{[
							{
								name: 'Vite',
								image: useBaseUrl('/img/tech/vite.svg'),
								href: 'https://vitejs.dev/',
							},
							{
								name: 'TSDX',
								image: useBaseUrl('/img/tech/tsdx.svg'),
								href: 'https://tsdx.io/',
							},
							{
								name: 'Immer.js',
								image: useBaseUrl('/img/tech/immer.svg'),
								href: 'https://immerjs.github.io/immer',
							},
							{
								name: 'TypeScript',
								image: useBaseUrl('/img/tech/typescript.png'),
								href: 'https://www.typescriptlang.org/',
							},
							{
								name: 'Rematch.js',
								image: useBaseUrl('/img/tech/rematchjs.png'),
								href: 'https://rematchjs.org/',
							},
							{
								name: 'Expo.io',
								image: useBaseUrl('/img/tech/expo.svg'),
								href: 'https://expo.io/',
							},
							{
								name: 'Tailwind CSS',
								image: useBaseUrl('/img/tech/tailwind.svg'),
								href: 'https://tailwindcss.com/',
							},
							{
								name: 'React',
								image: useBaseUrl('/img/tech/react.png'),
								href: 'https://reactjs.org',
							},
						]
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((company) => {
								const element = (
									<a
										target="__blank"
										rel="noopener"
										href={company.href}
										data-extlink
									>
										<div className={styles.trustedBy}>
											<div className={styles.trustedByContainerImage}>
												<img
													loading="lazy"
													className={styles.trustedByImage}
													src={company.image}
													alt={`${company.name} Logo`}
												/>
											</div>
										</div>
									</a>
								)

								return element
							})}
					</div>
				</div>

				<div className={clsx('row padding--lg m-auto', styles.waveTop)}>
					<div className={clsx('col col--6')}>
						<video
							width="640"
							height="480"
							autoPlay
							loop
							className={styles.video}
						>
							<source
								src={useBaseUrl('/img/amazhop-app.webm')}
								type="video/webm"
							/>
							Your browser does not support the video tag.
						</video>
					</div>
					<div
						className={clsx(
							'col col--6 m-auto text--center',
							styles.flex,
							styles['flex-column']
						)}
					>
						<h3 className={styles.h3}>Amazhop React Native Application</h3>
						<p className={styles.p}>
							Built with Expo and React Native, sharing the business logic
							written in Rematch through Yarn Workspaces and TSDX
						</p>
						<a
							className={clsx(
								'button button--outline button--tertiary button--lg',
								styles.getStarted
							)}
							data-extlink
							target="_blank"
							href="https://github.com/PacktPublishing/Redux-Made-Easy-with-Rematch"
						>
							Explore more
						</a>
					</div>
				</div>
			</div>
			<Wave />
		</Layout>
	)
}
export default BookPage
