import React, { useEffect, useState } from 'react'
import Layout from '@theme/Layout'
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import clsx from 'clsx'
import useBaseUrl from '@docusaurus/useBaseUrl'

import useLocalStorage from '../components/useLocalStorage'
import styles from './examples.module.css'

const Examples = () => {
	const [githubData, setData] = useLocalStorage<
		RestEndpointMethodTypes['repos']['getContent']['response']['data']
	>('github-examples', null)
	const [loading, setLoading] = useState(false)
	const octokit = new Octokit({})
	useEffect(() => {
		if (githubData) {
			setLoading(false)
			return
		}

		octokit.repos
			.getContent({
				owner: 'rematch',
				repo: 'rematch',
				path: '/examples',
				ref: 'main',
				branch: 'main',
			})
			.then(({ data }) => {
				const res =
					Array.isArray(data) && data.filter((el) => el.type === 'dir')
				setData(res)
				setLoading(false)
			})
	}, [])

	return (
		<Layout
			title="Examples"
			description="Examples of Rematch with different technologies"
		>
			<div className={styles['examples--container']}>
				{loading ? (
					<span>...</span>
				) : (
					<div className="container">
						<h1>Rematch Examples</h1>
						<hr />
						<div className="row">
							{Array.isArray(githubData) &&
								githubData.map((el) => (
									<div key={el.name} className="col col--3 margin-top--sm">
										<div className="card shadow--lg">
											<div
												className={clsx(
													'card__image',
													'padding--sm',
													styles['examples--bg-card']
												)}
											>
												<img
													className={clsx(
														'm-auto',
														styles['examples--bg-card-image']
													)}
													src={useBaseUrl('/img/logo.svg')}
													alt="Rematch logo"
												/>
											</div>
											<div className="card__header">
												<h3>{el.name}</h3>
											</div>
											<div className="card__footer">
												<a rel="noreferrer" href={el.html_url} target="_blank">
													<button
														type="button"
														className="button button--secondary button--block"
													>
														View code
													</button>
												</a>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				)}
			</div>
		</Layout>
	)
}

export default Examples
