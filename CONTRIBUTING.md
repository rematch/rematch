# Contributing to rematch
As the creators and maintainers of this project, we want to ensure that rematch lives and continues to grow and evolve.
The evolution of the library should never be blocked by any single person's time.
One of the simplest ways of doing this is by encouraging a larger set of shallow contributors.
Through this, we hope to mitigate the problems of a project that needs updates but there's no-one who has the power to do so.

### How can we help you get comfortable contributing?

It's normal for a first pull request to be a potential fix for a problem, and moving on from there to helping the project's direction can be difficult.
We try to help contributors cross that barrier by offering good first step issues. These issues can be fixed without feeling like you're stepping on toes. Ideally, these are non-critical issues that are well defined. They will be purposely avoided by mature contributors to the project, to make space for others.

We aim to keep all technical discussions inside GitHub issues, and all other discussions in our [Slack community](https://rematchjs.slack.com). If you have questions about a specific PR, want to discuss a new API idea etc GitHub issues are the right place.

### What about if you have problems that cannot be discussed in a public issue?

[Sergio Moreno](https://github.com/semoal) have contactable email on their GitHub profile, and is happy to talk about any problems via those.

### Code of Conduct

It's also important to note that all repositories under the `rematch` banner have a [Code of Conduct](./CODE_OF_CONDUCT.md). It is important that you review and enforce this CoC should any violations happen.

## Code contributions

### Online one-click setup

You can use Gitpod(an Online Open Source VS Code like IDE which is free for Open Source) for contributing. With a single click it will start a workspace and automatically:

- clone the `rematch` repo.
- install all the dependencies
- runs `yarn watch`.
- run `yarn docs`.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

Here is a quick guide to doing code contributions to the library.

1. Find some issue you're interested in, or a feature that you'd like to tackle.
   Also make sure that no one else is already working on it. We don't want you to be
   disappointed.

2. Fork, then clone: `git clone https://github.com/YOUR_USERNAME/rematch.git`

3. Create a branch with a meaningful name for the issue: `git checkout -b fix-something`

4. Install packages by running `yarn install` in the root of the project.

> Caution!! Use ALWAYS yarn, because we use yarn workspaces to handle the monorepo dependencies, npm install won't work.

5. Make your changes and commit: `git add` and `git commit`

6. Remember commits must be semantic versioning friendly  https://www.conventionalcommits.org/en/v1.0.0/

6. Make sure that the tests still pass: `yarn build` and `yarn test` and `yarn lint`

7. Push your branch: `git push -u origin your-branch-name`

8. Submit a pull request to the upstream rematch repository.

9. Choose a descriptive title and describe your changes briefly.

10. Wait for a maintainer to review your PR, make changes if it's being recommended, and get it merged.

11. Perform a celebratory dance! :dancer:

### How do I set up the project?

- Run [`yarn install`](https://classic.yarnpkg.com/lang/en) 
- Run `yarn build` (just the first time, is for generating types, etc)
- Run `yarn watch` for live-reloading testing suite
- Edit code in the `packages/core|loading|any-plugin/src/` folder.

It's luckily very simple! :wink:

> We use [lerna](https://github.com/lerna/lerna) to make this work as a monorepo under the hood and [Yarn Workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

### How do I verify and test my changes?

To make development process easier we provide a Sandbox React application in this repo which automatically uses your local version of the `rematch` library.
That means when you make any changes in the `packages/rematch/core/src/` folder they'll show up automatically there! (You only need to run yarn build for reloading dist folder)

## Documentation contributions

1. Run `yarn install` in the root of project.
2. Run `yarn start:docs`
3. And do whatever you want. =)
4. Check prettier and eslint: `yarn lint:docs`
5. You're done, git add, git commit, and push to a new branch.

## Credits

These contribution guidelines are based on https://github.com/moya/contributors also to https://github.com/styled-components/styled-components.

### Contributors

Thank you to all the people who have already contributed to rematch!
<a href="https://github.com/rematch/rematch/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=rematch/rematch" />
</a>

Made with [contributors-img](https://contributors-img.web.app).
