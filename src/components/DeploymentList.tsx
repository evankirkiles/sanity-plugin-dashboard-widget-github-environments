import React, {useReducer} from 'react'
import {Flex, Box, Card, Text, Spinner, Stack, Heading, Button} from '@sanity/ui'
import {ChevronDownIcon, ChevronRightIcon} from '@sanity/icons'
import useDeployments from '../hooks/useDeployments'
import DeploymentListItem from './DeploymentListItem'

export default function DeploymentList() {
  const {isLoading, data: deployments} = useDeployments()
  const [showPast, toggleShowPast] = useReducer((prev) => !prev, false)

  if (isLoading) {
    return (
      <Card padding={4}>
        <Flex direction="column" justify="center" align="center">
          <Spinner muted />
          <Box marginTop={3}>
            <Text muted>Loading deployments...</Text>
          </Box>
        </Flex>
      </Card>
    )
  }
  if (!deployments || (deployments && deployments.length === 0)) {
    return (
      <Card tone="critical" padding={4}>
        <Flex direction="column" justify="center" align="center">
          <Text align="center" size={[2, 2, 3, 4]}>
            Failed to load deployments.
          </Text>
        </Flex>
      </Card>
    )
  }
  return (
    <Stack paddingY={2} space={2}>
      <Card borderBottom borderTop padding={3}>
        <Heading as="h2">Current Deployment</Heading>
      </Card>
      <DeploymentListItem deployment={deployments[0]} />
      <Card borderBottom borderTop>
        <Button
          tone="default"
          mode="bleed"
          style={{width: '100%', cursor: 'pointer'}}
          radius={0}
          onClick={toggleShowPast}
        >
          <Flex justify="space-between">
            <Heading as="h2">Past Deployments</Heading>
            {showPast ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Flex>
        </Button>
      </Card>
      {showPast &&
        deployments.slice(1).map((deployment) => {
          return <DeploymentListItem deployment={deployment} key={deployment.databaseId} />
        })}
    </Stack>
  )
}
