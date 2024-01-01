import {Stack} from '@sanity/ui'
import useWorkflowRuns, {IN_PROGRESS_STATUSES} from '../hooks/useWorkflowRuns'
import WorkflowRunListItem from './WorkflowRunListItem'

export default function WorkflowRunList() {
  const {data} = useWorkflowRuns()
  const completeds =
    data?.workflow_runs.filter(
      ({status, run_started_at}) => status === 'completed' && !!run_started_at
    ) || []
  const estTimeMs =
    completeds.length > 0
      ? completeds.reduce((acc, {run_started_at, updated_at}) => {
          const time_elapsed = new Date(updated_at).valueOf() - new Date(run_started_at!).valueOf()
          return acc + time_elapsed
        }, 0) / completeds.length
      : undefined

  const workflows = data?.workflow_runs.filter(
    ({status}) => status && IN_PROGRESS_STATUSES.includes(status)
  )

  if (!workflows?.length) return null

  return (
    <Stack marginTop={2} paddingX={3} space={2}>
      {workflows.map((workflow) => (
        <WorkflowRunListItem key={workflow.id} workflow={workflow} estTimeMs={estTimeMs} />
      ))}
    </Stack>
  )
}
