import {useQuery} from 'react-query'
import useOctokit from '../contexts/OctoKit'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useDeploymentStatuses = (deploymentId: number) => {
  const {owner, repo, octokit} = useOctokit()
  return useQuery(
    ['deploymentStatuses', deploymentId],
    () =>
      octokit
        .request('GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses', {
          owner,
          repo,
          // eslint-disable-next-line camelcase
          deployment_id: deploymentId,
          headers: {
            'If-None-Match': '',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        .then((d) => d.data || []),
    {
      refetchInterval: 1000 * 60, // ms
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: false,
      retry: false,
    }
  )
}

export default useDeploymentStatuses
