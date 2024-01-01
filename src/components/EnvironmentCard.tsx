import {Box, Button, Card, Flex, Heading, Spinner, Stack, Text} from '@sanity/ui'
import useEnvironment from '../hooks/useEnvironment'
import DeploymentsList from './DeploymentList'
import useOctokit from '../contexts/OctoKit'
import WorkflowRunList from './WorkflowRunList'
import {GithubWidgetProps} from '../types'
import styled from 'styled-components'

const IframeContainer = styled.div`
  width: 100%;
  aspect-ratio: 2/1;
  overflow: hidden;
  margin: 1em 0;
`

const IFrame = styled.iframe`
  width: 300%;
  aspect-ratio: 2/1;
  transform-origin: 0% 0%;
  transform: scale(0.33, 0.33);
`

export default function EnvironmentCard(
  props: Pick<GithubWidgetProps, 'environmentName' | 'environmentUrl' | 'disableIframe'>
) {
  const {environmentName, environmentUrl, disableIframe} = props
  const {workflowDispatch: action} = useOctokit()
  const {data: environment, isLoading, isError} = useEnvironment()

  if (isLoading) {
    return (
      <Card padding={4}>
        <Flex direction="column" justify="center" align="center">
          <Spinner muted />
          <Box marginTop={3}>
            <Text muted>Loading environment...</Text>
          </Box>
        </Flex>
      </Card>
    )
  }
  if (!environment || isError) {
    return (
      <Card tone="critical" padding={4} height="stretch" style={{boxSizing: 'border-box'}}>
        <Flex direction="column" height="stretch" justify="center" align="center">
          <Text align="center" size={[2, 2, 3, 4]}>
            Environment not found.
          </Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Card>
      <Stack padding={2} space={3}>
        {!disableIframe && environmentUrl && (
          <IframeContainer>
            <IFrame src={environmentUrl} />
          </IframeContainer>
        )}
        <Heading as="h1" size={5}>
          {environmentName || environment.name}
        </Heading>
        {environmentUrl && (
          <Button
            as="a"
            href={environmentUrl}
            mode="bleed"
            style={{cursor: 'pointer', zIndex: 1}}
            paddingY={2}
            paddingX={0}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text size={4} style={{width: '100%'}} muted>
              {new URL(environmentUrl).hostname}
            </Text>
          </Button>
        )}
      </Stack>
      {action && <WorkflowRunList />}
      <DeploymentsList />
    </Card>
  )
}
