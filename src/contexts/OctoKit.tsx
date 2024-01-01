import {Octokit} from 'octokit'
import {PropsWithChildren, createContext, useContext, useMemo} from 'react'
import {OctokitConfig} from '../types'

const OctokitContext = createContext<
  Omit<OctokitConfig, 'octokitConfig'> & {
    octokit: Octokit
  }
>({
  owner: '',
  repo: '',
  environment: '',
  octokit: new Octokit(),
})

export const OctokitProvider = ({
  config: {octokitConfig, ...config},
  children,
}: PropsWithChildren<{config: OctokitConfig}>) => {
  const octokit = useMemo(() => new Octokit(octokitConfig), [octokitConfig])
  return <OctokitContext.Provider value={{...config, octokit}}>{children}</OctokitContext.Provider>
}

const useOctokit = () => useContext(OctokitContext)

export default useOctokit
