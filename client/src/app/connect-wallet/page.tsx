/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useAccount, useConnect, useContractRead, useNetwork } from "wagmi";
import { useRouter } from "next/navigation";

import { wallets } from "@/constants/wallets";
import { is_user_exists_abi } from "@/abi/user";
import { Address } from "@/types";
import LoadingModal from "@/components/modals/loader";
import ErrorModal from "@/components/modals/error";
import SuccessModal from "@/components/modals/success";

const Login: NextPage = () => {
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect();
    const { chain } = useNetwork();
    const { isConnected, address } = useAccount();
    const router = useRouter();

    const [errorTitle, setErrorTitle] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successTitle, setSuccessTitle] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loadingTitle, setLoadingTitle] = useState<string>("");
    const [loadingMessage, setLoadingMessage] = useState<string>("");

    const {
        data,
        isLoading: isStatusLoading,
        isError: isStatusError,
    } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: is_user_exists_abi,
        functionName: "_userExists",
        chainId: chain?.id,
        args: [address],
        onError(error: Error) {
            console.log(error.message);
        },
    });

    useEffect(() => {
        if (error) {
            setErrorTitle(error.message);
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
        } else {
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
        }
    }, [error]);

    useEffect(() => {
        if (isStatusLoading) {
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
            setLoadingTitle("Checking user in contract, please wait...");
            setLoadingMessage("");
        } else {
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
        }
    }, [isStatusLoading]);

    useEffect(() => {
        if (isConnected && address && !isStatusLoading && !isStatusError) {
            if (data) {
                router.push("/profile");
            } else {
                router.push("/registration");
            }
        }
    }, [address, data, isConnected, isStatusError, isStatusLoading, router]);

    return (
        <>
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
                    errorButtonRightText="Close"
                />
            )}
            {successTitle && (
                <SuccessModal
                    successTitle={successTitle}
                    successMessage={successMessage}
                    needSuccessButtonRight={true}
                    successButtonRightText="Done"
                />
            )}
            <div className="bg-darkblue px-6 py-14 min-[600px]:px-[100px] md:px-[192px] lg:px-[100px] flex flex-col lg:flex-row items-center justify-center gap-x-16 rounded-24 xl:py-40 xl:px-48">
                <div className="w-full mb-14 lg:basis-1/2 max-w-[430px]">
                    <h1 className="text-[30px] text-center lg:text-left lg:text-40 text-white m-0 mb-10 ">
                        Welcome back 👋 <br className="hidden lg:block" />
                        Connect wallet and <br className="hidden lg:block" />{" "}
                        explore all features
                    </h1>
                    <img
                        className="w-full max-h-[609px] object-contain"
                        alt="Login Image"
                        src="/login.png"
                    />
                </div>
                <div className="flex flex-col gap-4 lg:basis-1/2 max-w-[390px]">
                    <div className="text-white text-lg lg:text-[24px] text-center font-normal">
                        {/* {error
                        ? error.message: */}
                        {"Please select a wallet to connect"}
                        {/* } */}
                    </div>

                    {connectors.map((connector) => (
                        <button
                            disabled={!connector.ready}
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            className={`cursor-pointer border-none flex flex-row items-center justify-center gap-3 rounded-full w-full py-3 ${
                                isLoading &&
                                connector.id === pendingConnector?.id
                                    ? "bg-blue"
                                    : "bg-white"
                            } `}>
                            {isLoading &&
                            connector.id === pendingConnector?.id ? (
                                <div role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className={`flex flex-col items-center justify-center ${
                                            wallets[
                                                connector.name
                                                    .split(" ")[0]
                                                    .toLowerCase()
                                            ].stylesContainer
                                        }`}>
                                        <img
                                            src={
                                                wallets[
                                                    connector.name
                                                        .split(" ")[0]
                                                        .toLowerCase()
                                                ].logo
                                            }
                                            alt="wallet Logo"
                                            className="w-h-7 h-7"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center text-black text-xl font-normal">
                                        {connector.name.split(" ")[0]}
                                        {!connector.ready && " (unsupported)"}
                                        {isLoading &&
                                            connector.id ===
                                                pendingConnector?.id &&
                                            " (connecting)"}
                                    </div>
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

//   return isFakeLoading ? (
//     <div className='bg-darkblue px-6 py-14 min-[600px]:px-[100px] md:px-[192px] lg:px-[100px] flex flex-col lg:flex-row items-center justify-center gap-x-16 rounded-24 xl:py-40 xl:px-48'>
//       <div className='w-full mb-14 lg:basis-1/2 max-w-[430px]'>
//         <h1 className='text-[30px] text-center lg:text-left lg:text-40 text-white m-0 max-h-[134vw]'>
//           {<Skeleton baseColor='#1A203B' highlightColor='#242c4f' />}
//         </h1>
//         <h1 className='text-[30px] text-center lg:text-left lg:text-40 text-white m-0 max-h-[134vw] mb-10 dev1024:mb-0'>
//           {<Skeleton baseColor='#1A203B' highlightColor='#242c4f' />}
//         </h1>
//         <h1 className='text-[30px] text-center lg:text-left lg:text-40 text-white m-0 mb-10 hidden dev1024:block'>
//           {<Skeleton baseColor='#1A203B' highlightColor='#242c4f' />}
//         </h1>
//         <div className='w-full h-[350px] dev350:h-[400px] dev400:h-[470px] dev450:h-[550px] dev500:h-[580px]'>
//           <Skeleton
//             baseColor='#1A203B'
//             highlightColor='#242c4f'
//             height='100%'
//             width='100%'
//             borderRadius={24}
//           />
//         </div>
//       </div>
//       <div className='flex flex-col gap-4 lg:basis-1/2 max-w-[390px]'>
//         <div className='text-white text-lg lg:text-[24px] text-center font-normal'>
//           <Skeleton
//             baseColor='#1A203B'
//             highlightColor='#242c4f'
//             // height="32px"
//             width='100%'
//           />
//         </div>

//         {connectors.map((connector) => (
//           <div
//             key={connector.id}
//             className={`cursor-pointer border-none rounded-full w-full`}>
//             <Skeleton
//               baseColor='#1A203B'
//               highlightColor='#242c4f'
//               height='54px'
//               width='100%'
//               borderRadius={500}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   ) : (
//     <div className='bg-darkblue px-6 py-14 min-[600px]:px-[100px] md:px-[192px] lg:px-[100px] flex flex-col lg:flex-row items-center justify-center gap-x-16 rounded-24 xl:py-40 xl:px-48'>
//       <div className='w-full mb-14 lg:basis-1/2 max-w-[430px]'>
//         <h1 className='text-[30px] text-center lg:text-left lg:text-40 text-white m-0 mb-10 '>
//           Welcome back 👋 <br className='hidden lg:block' />
//           Connect wallet and <br className='hidden lg:block' /> explore all
//           features
//         </h1>
//         <img
//           className='w-full object-contain mix-blend-luminosity'
//           alt='Login Image'
//           src='/login-img.png'
//         />
//       </div>
//       <div className='flex flex-col gap-4 lg:basis-1/2 max-w-[390px]'>
//         <div className='text-white text-lg lg:text-[24px] text-center font-normal'>
//           {error ? error.message : 'Please select a wallet to connect'}
//         </div>

//         {connectors.map((connector) => (
//           <button
//             disabled={!connector.ready}
//             key={connector.id}
//             onClick={() => connect({ connector })}
//             className={`cursor-pointer border-none flex flex-row items-center justify-center gap-3 rounded-full w-full py-3 ${
//               isLoading && connector.id === pendingConnector?.id
//                 ? 'bg-blue'
//                 : 'bg-white'
//             } `}>
//             {isLoading && connector.id === pendingConnector?.id ? (
//               <div role='status'>
//                 <svg
//                   aria-hidden='true'
//                   className='w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-blue-600'
//                   viewBox='0 0 100 101'
//                   fill='none'
//                   xmlns='http://www.w3.org/2000/svg'>
//                   <path
//                     d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
//                     fill='currentColor'
//                   />
//                   <path
//                     d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
//                     fill='currentFill'
//                   />
//                 </svg>
//                 <span className='sr-only'>Loading...</span>
//               </div>
//             ) : (
//               <>
//                 <div
//                   className={`flex flex-col items-center justify-center ${
//                     wallets[connector.name.split(' ')[0].toLowerCase()]
//                       .stylesContainer
//                   }`}>
//                   <img
//                     src={
//                       wallets[connector.name.split(' ')[0].toLowerCase()].logo
//                     }
//                     alt='wallet Logo'
//                     className='w-h-7 h-7'
//                   />
//                 </div>
//                 <div className='flex items-center justify-center text-black text-xl font-normal'>
//                   {connector.name.split(' ')[0]}
//                   {!connector.ready && ' (unsupported)'}
//                   {isLoading &&
//                     connector.id === pendingConnector?.id &&
//                     ' (connecting)'}
//                 </div>
//               </>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

export default Login;
