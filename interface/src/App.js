import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  optimismGoerli, avalancheFuji, mantleTestnet, polygonZkEvmTestnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from './components/Navbar';
import Fuel from './pages/Fuel';
import Dashboard from './pages/Dashboard';
import Bridge from './pages/Bridge';

export const polygonMumbai = {
  id: 80_001,
  name: 'Polygon',
  network: 'polygon',
  nativeCurrency: {
    decimals: 18,
    name: 'Polygon',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: { http: ['https://rpc-mumbai.maticvigil.com'] },
    default: { http: ['https://rpc-mumbai.maticvigil.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://mumbai.polygonscan.com' },
    default: { name: 'SnowTrace', url: 'https://mumbai.polygonscan.com' },
  },
} 

export const scrollTestnet = {
  id: 534_351,
  name: 'Scroll',
  network: 'Scroll Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/scroll_sepolia_testnet'] },
    default: { http: ['https://rpc.ankr.com/scroll_sepolia_testnet'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://sepolia.scrollscan.com' },
    default: { name: 'SnowTrace', url: 'https://sepolia.scrollscan.com' },
  },
} 

const { chains, publicClient } = configureChains(
  [
    optimismGoerli, 
    avalancheFuji, 
    polygonMumbai, 
    // {
    //   ...scrollTestnet,
    //   iconUrl: 'https://app.nfts2me.com/assets/chains/scrollv2.svg',
    // },
    // {
    //   ...mantleTestnet,
    //   iconUrl: 'https://miro.medium.com/v2/0*w-6d4VpYha0olTgb.jpg',
    // },
    // {
    //   ...polygonZkEvmTestnet,
    //   iconUrl: 'https://zkevm.polygonscan.com/images/svg/brands/mainbrand-1.svg?v=23.10.2.0',
    // },
  ],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'x-fuel',
  projectId: '61489a11990e81512604b033a758b00a',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

function App() {
  return (
  <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="bg-[#2362C0] w-screen h-screen">
          <Router>
            <Navbar/>  
            <Routes>
              <Route path='/' exact element={<Fuel/>}/>
              <Route path='/dashboard' exact element={<Dashboard/>}/>
              <Route path='/bridge' exact element={<Bridge/>}/>
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
