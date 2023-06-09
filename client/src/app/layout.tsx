'use client';
import Navigation from '@/components/navigation';
import { DM_Sans } from 'next/font/google';
import { WagmiConfig, configureChains, createClient, useNetwork } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { useEffect, useState } from 'react';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import NextTopLoader from 'nextjs-toploader';

import './globals.css';
import Footer from '@/components/footer';
import LoadingModal from '@/components/modals/loader';
import ErrorModal from '@/components/modals/error';
import SuccessModal from '@/components/modals/success';

// -------------- WAGMI CONFIG STARTS ----------------

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Hackathon',
        jsonRpcUrl:
          'https://eth-mainnet.g.alchemy.com/v2/5j7hyZzXJirxp1CV2MjzPNB5YM8y3oA8',
      },
    }),
    // new WalletConnectConnector({
    //     chains,
    //     options: {
    //         projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    //     },
    // }),
  ],
  provider,
  webSocketProvider,
});

// -------------- WAGMI CONFIG ENDS ----------------

const dm_sans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successTitle, setSuccessTitle] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loadingTitle, setLoadingTitle] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const { chain } = useNetwork();

  useEffect(() => {
    if (chain && chain!?.id != 80001) {
      setErrorTitle('Please connect to polygon mumbai testnet');
      setErrorMessage('Other networks are not supported currently.');
      setSuccessTitle('');
      setSuccessMessage('');
      setLoadingTitle('');
      setLoadingMessage('');
    } else if (chain && chain!?.id == 80001) {
      setErrorTitle('');
      setErrorMessage('');
      setSuccessTitle('');
      setSuccessMessage('');
      setLoadingTitle('');
      setLoadingMessage('');
    }
  }, [chain?.id, chain]);

  return (
    <html lang='en'>
      <body className={`${dm_sans.className} bg-darkblue`}>
        {loadingTitle && (
          <LoadingModal
            loadingTitle={loadingTitle}
            loadingMessage={loadingMessage}
          />
        )}
        {errorTitle && (
          <ErrorModal
            errorTitle={errorTitle}
            errorMessage={errorMessage}
            needErrorButtonRight={true}
            errorButtonRightText='Close'
          />
        )}
        {successTitle && (
          <SuccessModal
            successTitle={successTitle}
            successMessage={successMessage}
            needSuccessButtonRight={true}
            successButtonRightText='Done'
          />
        )}
        <WagmiConfig client={client}>
          <Navigation />
          <NextTopLoader color='#0328ee' showSpinner={false} />
          {children}
          <Footer />
        </WagmiConfig>
      </body>
    </html>
  );
}
