import { HardhatUserConfig } from 'hardhat/config'
import { NetworkUserConfig } from 'hardhat/types'
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import '@openzeppelin/hardhat-defender'
import 'hardhat-contract-sizer'
import './scripts/tasks/deploy/deploy-full'
import './scripts/tasks/deploy/upgrade-proxy'
import './scripts/tasks/deploy/prepare-upgrade'
import './scripts/utils/wallet'
import './scripts/tasks/protocol/mint-platform-id'
import './scripts/tasks/protocol/mint-talentlayer-id'
import './scripts/tasks/protocol/add-arbitrator'
import './scripts/tasks/protocol/remove-arbitrator'
import './scripts/tasks/protocol/update-min-arbitration-fee-timeout'
import './scripts/tasks/protocol/transfer-proxy-ownership'
import './scripts/tasks/user/create-service'
import './scripts/tasks/protocol/update-token-address-to-whitelist'
import './scripts/tasks/protocol/add-trusted-forwarder'
import './scripts/tasks/protocol/remove-trusted-forwarder'
import { Network } from './networkConfig'

dotenvConfig({ path: resolve(__dirname, './.env') })

const mnemonic: string | undefined = process.env.MNEMONIC
if (!mnemonic) {
  throw new Error('Please set your MNEMONIC in a .env file')
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY
if (!infuraApiKey) {
  throw new Error('Please set your INFURA_API_KEY in a .env file')
}

function getChainConfig(chain: Network): NetworkUserConfig {
  let jsonRpcUrl: string
  switch (chain) {
    case Network.AVALANCHE:
      jsonRpcUrl = 'https://avalanche-mainnet.infura.io/v3/' + infuraApiKey
      break
    case Network.FUJI:
      jsonRpcUrl = 'https://avalanche-fuji.infura.io/v3/' + infuraApiKey
      break
    case Network.POLYGON:
      jsonRpcUrl = 'https://polygon-rpc.com/'
      break
    case Network.MUMBAI:
      jsonRpcUrl = 'https://matic-mumbai.chainstacklabs.com'
      break
    default:
      jsonRpcUrl = 'https://mainnet.infura.io/v3/' + infuraApiKey
  }

  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chain,
    url: jsonRpcUrl,
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      xdai: process.env.GNOSIS_API_KEY || '',
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      mumbai: process.env.POLYGONSCAN_API_KEY || '',
    },
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: !!process.env.REPORT_GAS,
    showTimeSpent: true,
    excludeContracts: [],
    src: './contracts',
    // noColors: true,
    // outputFile: "./reports/LoadTest",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    only: ['TalentLayer', 'ServiceRegistry'],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
        count: 100,
      },
      chainId: Network.LOCAL,
    },
    avalanche: getChainConfig(Network.AVALANCHE),
    fuji: getChainConfig(Network.FUJI),
    polygon: getChainConfig(Network.POLYGON),
    mumbai: getChainConfig(Network.MUMBAI),
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test/batch',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 1000000,
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY || '',
    apiSecret: process.env.DEFENDER_API_SECRET || '',
  },
}

export default config
