export const supportedChains = [420, 43113, 80001]

export const supportedBridgeChains = [420, 43113, 80001]
export const supportBridgeTokens = ["USDC", "USDT", "DAI", "BITCOIN", "LINK"]

export const tokenDetails = {
    USDC: {
        img: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
    },
    USDT: {
        img: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
    },
    DAI: {
        img: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996",
    },
    BITCOIN: {
        img: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
    },
    LINK: {
        img: "https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png?1696502009",
    }
}

export const chainsDetails = {
    420: {
        name: "Optimism",
        image: "https://docs.axelar.dev/images/chains/optimism.svg",
        currency: "ETH",
        contract: "0xCC92e69873ff04bD43424357F49034651bE9afFD",
        destDomainIdentifier: 420,
        rpc: "https://endpoints.omniatech.io/v1/op/goerli/public",
        explorer: "https://goerli-optimism.etherscan.io/tx/",
        isCollateralChain: false,
        tokens: {
            USDC: {
                token: "0xB06c41426c6235549e0e07DA0d51c39356b60380",
            },
            USDT: {
                token: "0xa799144c27a5a3E8793f7a11488B4526f902d24c",
            },
            DAI: {
                token: "0x3EddD8eb1B8fbc2e28aF6EF8c4b99282639d569f",
            },
            BITCOIN: {
                token: "0xdf75a157f337731F2A3214bd5c4b478001017F16",
            },
            LINK: {
                token: "0x2d2BA9c3796086a768731a0da681892378D2dD1d",
            }
        }
    },
    43113: {
        name: "Avalance",
        image: "https://docs.axelar.dev/images/chains/avalanche.svg",
        currency: "AVAX",
        contract: "0x89eDB349Ae617F6608AF85F34A4b2E436402BB71",
        destDomainIdentifier: 43113,
        rpc: "https://api.avax-test.network/ext/bc/C/rpc",
        explorer: "https://testnet.snowtrace.io/tx/",
        isCollateralChain: false,
        tokens: {
            USDC: {
                token: "0xc3E395f67aD5ccF2d0AE6f6EEaf4646664a0665a",
            },
            USDT: {
                token: "0xf31Fe0A953E50ED4EF3D1E697fA049b60724A2cf",
            },
            DAI: {
                token: "0xBac43f18E5e1eF005bC77a392D960e135014A38c",
            },
            BITCOIN: {
                token: "0x0DED84430733D41B6cF93318aC97A9ED3648d6fc",
            },
            LINK: {
                token: "0x000290A9bc9e5090E21a04795d3d98c3B1A1d250",
            }
        }
    },
    80001: {
        name: "Polygon",
        image: "https://polygonscan.com/images/svg/brands/matic.svg",
        currency: "MATIC",
        contract: "0x716f1C2724d7249cdC896B97b3b40aeB3CAb6e50",
        destDomainIdentifier: 80001,
        rpc: "https://rpc-mumbai.maticvigil.com",
        explorer: "https://mumbai.polygonscan.com/tx/",
        isCollateralChain: true,
        tokens: {
            USDC: {
                token: "0x50C79A4748718D78440c7cd02714527CF643F1A0",
                collateral: "0xB1685a238aB47A7f413c84626ADe1B5580dcaAfE",
            },
            USDT: {
                token: "0x79B02116799a1823C4896A0b808E84F83be16C44",
                collateral: "0x0787a1985b77cF03c53B1fFEA579625573399430",
            },
            DAI: {
                token: "0xAE0A1a0A0EFCd639909Df194043a0779256e2D91",
                collateral: "0x9D0AbB417501a94B7e453c4022ceFe741573d5ce",
            },
            BITCOIN: {
                token: "0x89eDB349Ae617F6608AF85F34A4b2E436402BB71",
                collateral: "0x81ee8089780EA1f804B81beE50A36F16cB96d664",
            },  
            LINK: {
                token: "0x4EACa4FDe5ea8cfB7702D187F981346Ec71226fb",
                collateral: "0x324c16105f64d3F77faCc21E47cDb062E36D5969",
            }
        }
    },
    534351: {
        name: "Scroll",
        image: "https://app.nfts2me.com/assets/chains/scrollv2.svg",
        currency: "ETH",
        contract: "0xf55F6BCd848F71d5335F6188B7C343107A384787",
        destDomainIdentifier: 534353,
        rpc: "https://scroll-sepolia.blockpi.network/v1/rpc/public",
        explorer: "https://sepolia.scrollscan.com/tx/",
    }
    // 5001: {
    //     name: "Mantle",
    //     image: "https://miro.medium.com/v2/0*w-6d4VpYha0olTgb.jpg",
    //     currency: "MNT",
    //     contract: "0x6fEcE031149a5864E77497c5f3F910bCD9C0c5E4",
    //     destDomainIdentifier: 5001,
    //     rpc: "https://rpc.testnet.mantle.xyz",
    //     explorer: "https://explorer.testnet.mantle.xyz/tx/",
    // },
    // 1442: {
    //     name: "Polygon zkEVM",
    //     image: "https://zkevm.polygonscan.com/images/svg/brands/mainbrand-1.svg?v=23.10.2.0",
    //     currency: "ETH",
    //     contract: "0x6fEcE031149a5864E77497c5f3F910bCD9C0c5E4",
    //     destDomainIdentifier: 1442,
    //     rpc: "https://rpc.public.zkevm-test.net",
    //     explorer: "https://testnet-zkevm.polygonscan.com/tx/",
    // }
}