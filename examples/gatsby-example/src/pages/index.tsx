// If you don't want to use TypeScript you can delete this file!
import React from "react"
import { PageProps } from "gatsby"
import { useDispatch, useSelector } from "react-redux"


import Layout from "../components/layout"
import SEO from "../components/seo"
import { store, Dispatch, RootState } from "../store";

const UsingTypescript: React.FC<PageProps> = () => {
  const settings = useSelector((state: RootState) => state.settings)
  const dispatch = useDispatch<Dispatch>()

  return (
    <Layout isDark={settings.isDarkModeEnabled}>
        <SEO title="Using TypeScript" />
        <h1>Dark mode: {settings.isDarkModeEnabled.toString()}</h1>
        <button onClick={() => dispatch.settings.toggleDarkThemeEffect()}>
          Toggle dark theme
        </button>
    </Layout>
  )
}


export default UsingTypescript
