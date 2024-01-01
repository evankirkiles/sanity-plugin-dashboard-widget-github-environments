import {Flex, Card, Text, Spinner, Stack} from '@sanity/ui'
import useDeploymentStatuses from '../hooks/useDeploymentStatuses'
import TimeAgo from 'javascript-time-ago'
import styled from 'styled-components'

const BorderCard = styled(Card)`
  position: relative;
  &:before {
    position: absolute;
    content: '';
    width: 1px;
    height: 100%;
    left: 1em;
    background-color: currentColor;
  }
`

export default function DeploymentStatusList({deployment_id}: {deployment_id: number}) {
  const timeAgo = new TimeAgo('en')
  const {data: deploymentStatuses, isLoading} = useDeploymentStatuses(deployment_id)

  if (isLoading) {
    return (
      <Card>
        <Flex justify="center" align="center">
          <Spinner muted />
          <Text muted>Loading deployment statuses...</Text>
        </Flex>
      </Card>
    )
  }
  if (!deploymentStatuses || (deploymentStatuses && deploymentStatuses.length === 0)) {
    return (
      <Card tone="critical" paddingX={5}>
        <Flex direction="column" gap={3}>
          <Text align="center" size={[2, 2, 3, 4]}>
            Failed to load deployment statuses.
          </Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Stack space={2}>
      {deploymentStatuses.map((status) => {
        const date = new Date(status.created_at)
        return (
          <BorderCard key={status.id} paddingX={5}>
            <Text muted>
              <code>{status.state.toUpperCase()}</code> {timeAgo.format(date)}
              <span style={{display: 'inline-block', marginLeft: '0.5ch', opacity: 0.4}}>
                ({date.toLocaleString('en', {dateStyle: 'medium', timeStyle: 'short'})})
              </span>
            </Text>
          </BorderCard>
        )
      })}
    </Stack>
  )
}
