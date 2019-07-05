const { resolve } = require("path")
const { terser } = require("rollup-plugin-terser")

const replace = require("rollup-plugin-replace")
const typescript = require("rollup-plugin-typescript")

const camelize = require("./lib/camelize")

const env = process.env.NODE_ENV
const pkg = require(resolve("package.json"))
const pkgNamespace = camelize(pkg.name.split("/")[1])
const pkgDependencies = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]

const input = "src/index.ts"

const plugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify(env)
  }),
  typescript()
]

const productionPlugins = [...plugins, terser()]

module.exports = ({
  namespace,
  cjs = true,
  esm = true,
  iife = !!pkg.browser,
  sourcemap = true
} = {}) => {
  const name = "rematch." + namespace || pkgNamespace

  const rollupBuild = {
    input,
    plugins: env === "production" ? productionPlugins : plugins,
    external: pkgDependencies,
    output: []
  }

  if (iife) {
    rollupBuild.output.push({
      name,
      sourcemap,
      file: pkg.browser,
      format: "iife",
      exports: "named"
    })
  }

  if (esm) {
    rollupBuild.output.push({
      sourcemap,
      file: pkg.module,
      format: "es",
      exports: "named"
    })
  }

  if (cjs) {
    rollupBuild.output.push({
      sourcemap,
      file: pkg.main,
      format: "cjs",
      exports: "named"
    })
  }

  return rollupBuild
}
