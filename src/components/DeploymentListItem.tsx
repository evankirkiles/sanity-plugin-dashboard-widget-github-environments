import {Text, Stack, Heading, Button} from '@sanity/ui'
import useDeployments from '../hooks/useDeployments'
import TimeAgo from 'javascript-time-ago'

type Deployment = NonNullable<ReturnType<typeof useDeployments>['data']>[number]

export default function DeploymentListItem({deployment}: {deployment: Deployment}) {
  const date = new Date(deployment.createdAt)
  const timeAgo = new TimeAgo('en')

  return (
    <>
      <Button
        mode="bleed"
        as="a"
        href={deployment.latestStatus?.environmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{cursor: 'pointer', flex: 1, overflow: 'hidden'}}
      >
        <Stack space={2}>
          <Heading size={[1, 1, 2]} width="full" textOverflow="ellipsis">
            {deployment.commit.messageHeadline}
          </Heading>
          <Text>
            Created {timeAgo.format(date)}{' '}
            <span style={{opacity: 0.4}}>
              ({date.toLocaleString('en', {dateStyle: 'medium', timeStyle: 'short'})})
            </span>
          </Text>
          <Text textOverflow="ellipsis" muted size={1} width={'100%'}>
            {deployment.latestStatus?.environmentUrl}
          </Text>
        </Stack>
      </Button>
    </>
  )
}
