import Widget from './app'

// Initialize `javascript-time-ago` locale (required for react-time-ago)
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {DashboardWidget} from '@sanity/dashboard'
import {GithubWidgetConfig} from './types'

TimeAgo.addDefaultLocale(en)

export function githubEnvironmentsWidget(config: GithubWidgetConfig): DashboardWidget {
  return {
    name: 'github-environments',
    component: () => <Widget {...config} />,
    layout: config.layout ?? {width: 'full'},
  }
}
