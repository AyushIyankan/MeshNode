interface Wallet {
  logo: string;
  stylesContainer: string;
  stylesImage: string;
}

interface Wallets {
  [key: string]: Wallet;
  metamask: Wallet;
  coinbase: Wallet;
  walletconnect: Wallet;
}

export const wallets: Wallets = {
  metamask: {
    logo: '/metamask-logo.png',
    stylesContainer: ' max-h-[24px] max-w-[24px]',
    stylesImage: 'h-full w-full object-contain',
  },
  coinbase: {
    logo: '/coinbase-logo.png',
    stylesContainer: ' max-h-[39px] max-w-[55px]',
    stylesImage: 'h-full w-full object-contain',
  },
  walletconnect: {
    logo: '/walletconnect-logo.png',
    stylesContainer: ' max-h-[39px] max-w-[55px]',
    stylesImage: 'w-full h-full object-contain',
  },
};

export const TAGS: string[] = [
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Android',
  'HTML',
  'jQuery',
  'C++',
  'CSS',
  'Solidity',
  'Web3.js',
  'Polygon',
  'Blockchain',
  'Smart contract',
  'Hardhat',
  'Truffle',
  'ERC',
  'Ethereum',
  'Metamask',
];
