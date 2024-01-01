import {LayoutConfig} from '@sanity/dashboard'
import {Octokit} from 'octokit'

export interface GithubWidgetProps {
  /** A title for the widget pane in the dashboard. Default: `Environment` */
  title?: string
  /** A description for the widget pane, located as the first item in the pane. (Optional) */
  description?: string
  /** A prettier name for the environment. If not specified, will fallback to the name of the
   * environment from GitHub.
   */
  environmentName?: string
  /** A custom URL for the production deployment of the environment.*/
  environmentUrl?: string
  /** Disables the IFrame production preview in the dashboard  */
  disableIframe?: string
}

export interface OctokitConfig {
  /** The account owner of the repository. The name is not case sensitive.
   *
   * https://docs.github.com/en/rest/deployments/environments?apiVersion=2022-11-28#get-an-environment
   */
  owner: string
  /** The name of the repository without the `.git` extension. The name is not case sensitive.
   *
   * https://docs.github.com/en/rest/deployments/environments?apiVersion=2022-11-28#get-an-environment
   */
  repo: string
  /** The name of the GitHub environment. It does not need to be URL encoded.
   *
   * https://docs.github.com/en/rest/deployments/environments?apiVersion=2022-11-28#get-an-environment
   */
  environment: string
  /** Set these variables if you want to trigger / view runs of a GitHub workflow to deploy your site.
   * They will be passed to the endpoint `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches`.
   *
   * https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
   */
  workflowDispatch?: {
    /** The ID of the workflow. You can also pass the workflow file name as a string.
     *
     * https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
     */
    workflowId: string
    /** The git reference for the workflow. The reference can be a branch or tag name.
     *
     * https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
     */
    ref: string
  }
  /** Configuration object which will be passed directly to the Octokit instance used by the dashboard widget.
   * Use this to make authenticated GitHub requests. For example, you can use a personal auth token like so:
   *
   * ```
   * octokitConfig: {
   *    auth: "github_pat_XXXXXXXXX"
   * }
   * ```
   *
   * Your auth must give read access to the repository. If you are also using `workflowDispatch`, your auth solution must additionally
   * have `action:read` and `action:write` permissions for the repository.
   *
   * https://github.com/octokit/octokit.js#authentication
   */
  octokitConfig: ConstructorParameters<typeof Octokit>[0]
}

export type WidgetProps = GithubWidgetProps & {github: OctokitConfig}

export type GithubWidgetConfig = WidgetProps & {layout?: LayoutConfig}
