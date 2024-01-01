import {useQuery} from 'react-query'
import useOctokit from '../contexts/OctoKit'

type DeploymentResponse = {
  repository: {
    deployments: {
      nodes: {
        databaseId: number
        environment: string
        createdAt: string
        commit: {
          messageHeadline: string
          messageBody: string
        }
        statuses: {
          totalCount: number
        }
        latestStatus?: {
          state: string
          description: string
          environmentUrl: string
          createdAt: string
        }
      }[]
    }
  }
}

const deploymentGQL = /* graphql */ `
query($owner:String!, $repo:String!, $environments:[String!]!) {
  repository(owner: $owner, name: $repo) {
    deployments(environments:$environments,first:20,orderBy:{field: CREATED_AT, direction: DESC}) {
      nodes {
        databaseId
        environment
        createdAt
        commit {
          messageHeadline
          messageBody
        }
        statuses {
          totalCount
        }
        latestStatus {
          state
          description
          environmentUrl
          createdAt
        }
      }
    }
  }
}
`

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useDeployments = () => {
  const {owner, repo, environment, octokit} = useOctokit()
  return useQuery(
    ['deployments'],
    () =>
      octokit
        .graphql<DeploymentResponse>(deploymentGQL, {
          owner,
          repo,
          environments: [environment],
          headers: {
            'If-None-Match': '',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        .then((d) => d.repository.deployments.nodes),
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

export default useDeployments
