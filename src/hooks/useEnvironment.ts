import {useQuery} from 'react-query'
import useOctokit from '../contexts/OctoKit'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useEnvironment = () => {
  const {owner, repo, environment, octokit} = useOctokit()
  return useQuery(
    ['environment'],
    () =>
      octokit
        .request('GET /repos/{owner}/{repo}/environments/{environment_name}', {
          owner,
          repo,
          environment_name: environment,
          headers: {
            'If-None-Match': '',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        .then((d) => d.data),
    {
      refetchInterval: 1000 * 60 * 5, // ms
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: false,
      retry: false,
    }
  )
}

export default useEnvironment
