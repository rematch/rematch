const path = require("path")
const { exec: _exec } = require("child_process")
const ora = require("ora")

const OPTS = {
  cwd: path.resolve("examples/all-plugins-react-ts")
}

async function main() {
  const spinner = ora()

  await exec('yarn', OPTS)
  spinner.start("Linking dependencies in example: all-plugins-react-ts")
  await exec('npm i -g update-by-scope --registry https://registry.npmjs.org', OPTS)
  await exec('npm config set registry http://0.0.0.0:4873/', OPTS)
  await exec('update-by-scope @rematch', OPTS)
  spinner.succeed("Updated @rematch packages")

  spinner.start("Running tests")
  try {
    await exec('yarn test:ci', OPTS)
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    process.exit(1)
  }
}

function exec(cmd, options) {
  const _options = {
    env: {
      ...process.env,
    },
    ...options,
  }
  return new Promise(function (resolve, reject) {
    _exec(cmd, _options, function (error, stdout, stderr) {
      stdout = stdout.trim()
      stderr = stderr.trim()

      if (error === null) {
        resolve({ stdout, stderr })
      } else {
        console.error(error)
        console.error(stdout)
        console.error(stderr)
        reject({ error, stdout, stderr })
        process.exit(1)
      }
    })
  })
}

if (require.main === module) {
  main().catch((error) => console.error(error))
}
