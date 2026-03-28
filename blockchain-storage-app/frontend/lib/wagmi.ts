import { createConfig, http } from 'wagmi'
import { polygon, polygonMumbai, mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = createConfig({
  chains: [polygon, polygonMumbai, mainnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
})
