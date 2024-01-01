import {ToastProvider} from '@sanity/ui'
import {QueryClient, QueryClientProvider} from 'react-query'
import {OctokitProvider} from './contexts/OctoKit'
import GitHubWidget from './components/GitHubWidget'
import {WidgetProps} from './types'

const Widget = (props: WidgetProps) => {
  const {github, ...restProps} = props
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 0,
        staleTime: 0,
      },
    },
  })

  return (
    <ToastProvider zOffset={10000}>
      <QueryClientProvider client={queryClient}>
        <OctokitProvider config={github}>
          <GitHubWidget {...restProps} />
        </OctokitProvider>
      </QueryClientProvider>
    </ToastProvider>
  )
}

export default Widget
