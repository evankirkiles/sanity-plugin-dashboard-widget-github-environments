import {useQuery, useQueryClient} from 'react-query'
import useOctokit from '../contexts/OctoKit'
import {useEffect, useState} from 'react'
import {useToast} from '@sanity/ui'

export const IN_PROGRESS_STATUSES = ['queued', 'requested', 'in_progress', 'waiting', 'pending']

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useWorkflowRuns = () => {
  const client = useQueryClient()
  const toast = useToast()
  const {owner, repo, workflowDispatch, octokit} = useOctokit()
  const [inProgress, setInProgress] = useState(false)
  const result = useQuery(
    ['workflow_runs'],
    () =>
      octokit
        .request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
          owner,
          repo,
          workflow_id: workflowDispatch!.workflowId,
          per_page: 10,
          headers: {
            'If-None-Match': '',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        .then((d) => d.data),
    {
      enabled: !!workflowDispatch,
      refetchInterval: inProgress ? 1000 * 5 : 1000 * 30, // ms
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: false,
      retry: false,
    }
  )

  // ramp up refetch if a workflow is running
  useEffect(() => {
    if (
      result.data?.workflow_runs.some(({status}) => status && IN_PROGRESS_STATUSES.includes(status))
    ) {
      if (!inProgress) setInProgress(true)
    } else if (inProgress) {
      setInProgress(false)
      client.invalidateQueries(['deployments'])
      toast.push({
        title: 'Deployment ready!',
        status: 'success',
      })
    }
  }, [inProgress, client, toast, result.data])

  return result
}

export default useWorkflowRuns
