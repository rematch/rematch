import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

const DEFAULT_LANGS = [
	{ label: 'JavaScript', value: 'js' },
	{ label: 'TypeScript', value: 'ts' },
]

export const MultiLangComponent: React.FC<{
	defaultValue: 'js' | 'ts'
	values: Array<{
		label: string
		value: string
	}>
}> = ({ defaultValue = 'js', values = DEFAULT_LANGS, children }) => (
	<Tabs defaultValue={defaultValue} values={values}>
		{values.map((el, index) => (
			<TabItem key={el.value} value={el.value}>
				{children[index]}
			</TabItem>
		))}
	</Tabs>
)
