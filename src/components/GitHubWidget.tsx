import React from 'react'
import {DashboardWidgetContainer} from '@sanity/dashboard'
import {Card, Text, Box} from '@sanity/ui'
import EnvironmentCard from './EnvironmentCard'
import {GithubWidgetProps} from '../types'
import useOctokit from '../contexts/OctoKit'
import WorkflowTrigger from './WorkflowTrigger'

export default function GitHubWidget(props: GithubWidgetProps) {
  const {title = 'Environments', description, ...rest} = props
  const {workflowDispatch: action} = useOctokit()

  return (
    <DashboardWidgetContainer header={title} footer={!!action && <WorkflowTrigger />}>
      <Card paddingY={3} height="stretch">
        {description && (
          <Box paddingX={3} paddingY={1}>
            <Text as="p" size={1} muted>
              {description}
            </Text>
          </Box>
        )}
        <EnvironmentCard {...rest} />
      </Card>
    </DashboardWidgetContainer>
  )
}
