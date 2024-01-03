# Sanity Dashboard Widget: GitHub Environments

> This is a **Sanity Studio v3** plugin.

This is a Sanity dashboard widget for viewing recent Github Environment deployments. This is useful if your build pipeline runs in GitHub actions and produces deployments in a Github environment. Additionally, the widget can further be configured with a webhook that has a `manual_dispatch` trigger, allowing you to re-run your build step Github action to create new deployments, all from within the Sanity Studio.

For example, we use this with an Astro site to manage creating new, up-to-date SSG builds in the production environment from an on-demand, SSR-based `preview` environment.

## Install

```
npm install --save sanity-plugin-dashboard-widget-github-environments
```

or

```
yarn add sanity-plugin-dashboard-widget-github-environments
```

Ensure that you have followed install and usage instructions for [@sanity/dashboard](https://github.com/sanity-io/dashboard).

## Usage

Add it as a widget to @sanity/dashboard plugin in sanity.config.ts (or .js):

```js
import {dashboardTool} from '@sanity/dashboard'
import {githubEnvironmentsWidget} from 'sanity-plugin-dashboard-widget-github-environments'

export default defineConfig({
  // ...
  plugins: [
    dashboardTool({
      widgets: [
        githubEnvironmentsWidget({
          title: 'Production Environment',
          environmentName: "My Website",
          environmentUrl: "https://mywebsite.com",
          github: {
            owner: "my-github-username",
            repo: "my-github-repo",
            environment: "my-github-environment-name",
            octokitConfig: {
              auth: GITHUB_ACCESS_TOKEN,
            },
            workflowDispatch: {
              workflowId: "build.production.yml",
              ref: "main",
            },
          },
        }),
      ],
    }),
  ],
})
```

### Widget options

`title` - Override the widget default title

`environmentName` – Override the Github environment's display name

`environmentUrl` – Add a "main URL" for the Github environment

`disableIFrame` – Turns off the IFrame preview of the `environmentUrl`

`github` - Configuration for your existing Github environment

- `owner` - The account owner of the repository
- `repo` - The name of the repository
- `environment` – The name of the Github environment
- `octokitConfig` – Configuration object to pass to the `octokit.js` instance to provide authentication
- `workflowDispatch` – (Optional) Configuration for dispatching the workflow that makes new Environment deployments
- – `workflowId` - The ID of the workflow. You can also pass the workflow file name as a string.
- – `ref` - The git reference for the workflow. The reference can be a branch or a tag name.

## License

MIT-licensed. See LICENSE.

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/sanity-plugin-dashboard-widget-netlify/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
