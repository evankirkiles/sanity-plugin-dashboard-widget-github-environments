import {Button, Flex} from '@sanity/ui'
import useWorkflowRuns, {IN_PROGRESS_STATUSES} from '../hooks/useWorkflowRuns'
import useTriggerWorkflow from '../hooks/useTriggerWorkflow'
import {useCallback, useEffect, useState} from 'react'
import {PublishIcon} from '@sanity/icons'
import {useQueryClient} from 'react-query'

const WorkflowTrigger = () => {
  const client = useQueryClient()
  const {data, isLoading} = useWorkflowRuns()
  const {mutate} = useTriggerWorkflow()
  const workflowInProgress = data?.workflow_runs.some(
    ({status}) => status && IN_PROGRESS_STATUSES.includes(status)
  )

  // add 10s cooldown for triggering deployments to prevent spam
  const [onCooldown, setOnCooldown] = useState(false)
  useEffect(() => {
    if (onCooldown) {
      const timeout = window.setTimeout(() => {
        client.invalidateQueries(['workflow_runs'])
        setOnCooldown(false)
      }, 10 * 1000)
      return () => clearTimeout(timeout)
    }
    return () => undefined
  }, [onCooldown, client])

  const onClick = useCallback(() => {
    setOnCooldown(true)
    mutate()
  }, [setOnCooldown, mutate])

  let buttonText = 'Rebuild site with published content'
  if (onCooldown) buttonText = 'Creating deployment...'
  if (workflowInProgress) buttonText = 'A deployment is already in progress...'

  return (
    <Flex direction="column" align="stretch">
      <Button
        disabled={onCooldown || workflowInProgress || isLoading}
        paddingX={2}
        paddingY={4}
        mode="bleed"
        tone="positive"
        style={{cursor: 'pointer'}}
        onClick={onClick}
        icon={PublishIcon}
        text={buttonText}
        loading={isLoading}
        target="_blank"
      />
    </Flex>
  )
}

export default WorkflowTrigger
