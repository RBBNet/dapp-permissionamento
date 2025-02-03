
import { ConfigDataProvider } from './context/configData'
import { Config } from './util/configLoader'
import { NetworkProvider } from './context/network'
import Layout from './containers/Layout'
import './App.module.css'
const App: React.FC<{config: Config}> = ({config}) => {

  return (
    <ConfigDataProvider config={config}>
      <NetworkProvider>
        <Layout/>
      </NetworkProvider>
    </ConfigDataProvider>
  )
}

export default App
