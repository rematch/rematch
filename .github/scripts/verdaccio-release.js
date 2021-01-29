const { exec: _exec } = require("child_process")
const chalk = require("chalk")
const ora = require("ora")

const LERNA_COMMAND = "./node_modules/.bin/lerna"

async function releaseInVerdaccio() {
  const spinner = ora()

  // Throw away build stats
  spinner.start("Logging in Verdaccio")
  await exec(
    `npx npm-cli-login -u test -p test -e test@test.com -r http://0.0.0.0:4873`
  )
  spinner.succeed()

  spinner.start("Versioning packages")
  const { stdout: actualBranch } = await exec("git rev-parse --abbrev-ref HEAD")
  await exec(`${LERNA_COMMAND} version patch --no-git-tag-version --force-publish --no-private --no-push --yes --allow-branch ${actualBranch}`)
  spinner.succeed()

  spinner.start("Building packages")
  await exec("yarn build")
  spinner.succeed()

  spinner.start("Dont't mark files as changed to let publish, but not create a git history")
  await exec("git ls-files -m | xargs git update-index --assume-unchanged");
  spinner.succeed()

  spinner.start("Publishing packages to local registry")
  await exec(
    `${LERNA_COMMAND} publish from-package --force-publish --no-git-tag-version --no-private --no-push --yes --allow-branch ${actualBranch} --contents dist --registry="http://0.0.0.0:4873"
  `)
  spinner.succeed()

  console.log()
  console.log(
    `Done! Run ${chalk.yellow(
      "npm install --registry http://0.0.0.0:4873 @rematch/[package]"
    )} in target project to install development version of package.`
  )

  // we revert the changed files from index
  await exec("git ls-files -v | grep '^[a-z]' | cut -c3- | xargs git update-index --no-assume-unchanged --");
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

function main() {
  return releaseInVerdaccio()
}

if (require.main === module) {
  main().catch((error) => console.error(error))
}
