import { createConfig, http } from 'wagmi'
import { polygon, polygonMumbai, mainnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = createConfig({
  chains: [polygon, polygonMumbai, mainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [mainnet.id]: http(),
  },
})
