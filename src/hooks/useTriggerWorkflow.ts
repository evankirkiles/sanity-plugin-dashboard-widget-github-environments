import {useMutation, useQueryClient} from 'react-query'
import useOctokit from '../contexts/OctoKit'
import {useToast} from '@sanity/ui'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useTriggerWorkflow = () => {
  const client = useQueryClient()
  const toast = useToast()
  const {owner, repo, workflowDispatch, octokit} = useOctokit()
  return useMutation(
    ['workflowTrigger'],
    () =>
      octokit
        .request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
          owner,
          repo,
          workflow_id: workflowDispatch!.workflowId,
          ref: workflowDispatch!.ref,
        })
        .then((d) => d as never),
    {
      onSuccess: () => {
        setTimeout(() => client.invalidateQueries(['workflow_runs']), 5000)
        toast.push({
          title: 'Deployment queued!',
          description: 'Please give the UI a moment or two to update.',
          status: 'success',
        })
      },
      onError: () => {
        toast.push({
          title: 'Deployment failed.',
          description: 'Please check the browser console for more info.',
          status: 'error',
        })
      },
    }
  )
}

export default useTriggerWorkflow
