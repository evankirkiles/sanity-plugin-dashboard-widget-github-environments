import {Flex, Text, Button, Card, Label} from '@sanity/ui'
import useWorkflowRuns from '../hooks/useWorkflowRuns'
import {useEffect, useRef} from 'react'

type WorkflowRun = NonNullable<ReturnType<typeof useWorkflowRuns>['data']>['workflow_runs'][number]

export default function WorkflowRunListItem({
  workflow,
  estTimeMs = undefined,
}: {
  workflow: WorkflowRun
  estTimeMs: number | undefined
}) {
  const estTimeRef = useRef<HTMLDivElement>(null)
  const url = new URL(workflow.html_url)
  useEffect(() => {
    if (!estTimeMs) return () => undefined
    const handle = setInterval(() => {
      if (!estTimeRef.current) return
      const estTimeRemaining =
        (estTimeMs - (new Date().valueOf() - new Date(workflow.created_at).valueOf())) / 1000
      const minutes = Math.floor(estTimeRemaining / 60)
      const seconds = Math.floor(estTimeRemaining % 60)
      if (minutes <= 0 && seconds < 5) {
        estTimeRef.current.innerText = `Nearly done...`
      } else {
        estTimeRef.current.innerText = `Est. ${minutes}:${seconds.toString().padStart(2, '0')} left`
      }
    }, 1010)
    return () => clearInterval(handle)
  }, [workflow, estTimeMs])

  return (
    <Card key={workflow.id} shadow={1} tone="positive" padding={3} radius={2}>
      <Flex justify="space-between">
        <Text size={2}>Deployment building</Text>
        <Label>{workflow.status}</Label>
      </Flex>
      <Flex justify="space-between" paddingTop={2}>
        <Button
          as="a"
          href={url.toString()}
          mode="bleed"
          target="_blank"
          padding={0}
          rel="noopener noreferrer"
        >
          <Text size={1}>Workflow run: {workflow.id}</Text>
        </Button>
        {estTimeMs && <Text size={1} ref={estTimeRef} />}
      </Flex>
    </Card>
  )
}
