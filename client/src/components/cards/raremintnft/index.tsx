import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "./styles.css";
import { RaremintNFTType } from "@/types/raremint";

const RaremintNFTCard = ({
    isFetching,
    doesUserHaveAnyUnclaimedReward,
    handleClaimReward,
    nftmetadata,
    isInUserRoute,
}: {
    isFetching: boolean;
    doesUserHaveAnyUnclaimedReward: boolean;
    handleClaimReward: () => void;
    nftmetadata: RaremintNFTType;
    isInUserRoute: boolean;
}) => {
    async function handleOpenseaLinkOpen(url: string) {
        if (!doesUserHaveAnyUnclaimedReward) {
            let newTab = window.open(url, "_blank");
            newTab?.focus();
        }
    }

    return isFetching ? (
        <div className="mb-2 h-[350px] w-[286px]  lg:h-[377px] lg:w-[300px] rounded-xl">
            <Skeleton
                baseColor="#22294d"
                highlightColor="#313a67"
                width="100%"
                height="100%"
                borderRadius={20}
            />
        </div>
    ) : (
        <div
            onClick={() =>
                handleOpenseaLinkOpen(
                    `${process.env.NEXT_PUBLIC_RAREMINT_OPENSEA_BASE_URL}${process.env.NEXT_PUBLIC_STACK3_RAREMINT_ADDRESS}/${nftmetadata?.id}` as string
                ) as any
            }
            className={`rounded-xl mb-2 background-animate raremint-nft-wrapper ${
                doesUserHaveAnyUnclaimedReward ? "" : "cursor-pointer"
            }`}
            key={nftmetadata?.id}>
            <div
                className={`flex flex-col items-center justify-center max-h-auto max-w-[300px] lg:max-h-auto lg:max-w-[300px] rounded-xl ${
                    doesUserHaveAnyUnclaimedReward ? "relative" : ""
                }`}>
                <div className="flex w-[300px] max-h-[270px] lg:max-h-[260px] lg:w-full object-cover rounded-tr-xl rounded-tl-xl items-center">
                    <img
                        src={nftmetadata?.image}
                        alt="NFT Image"
                        className="mx-auto rounded-tr-xl rounded-tl-xl object-cover w-[270px] max-h-[225px] lg:max-h-[260px] lg:w-[300px]"
                    />
                </div>
                <div className="flex flex-col items-center justify-center p-[19px] w-full rounded-br-xl rounded-bl-xl">
                    <div className="flex flex-col w-full gap-[16px]">
                        <div className="flex flex-col">
                            <div className="flex flex-row w-full justify-between items-center">
                                <div className="flex flex-row items-center justify-start gap-[4px]">
                                    <div className="flex text-[14px] font-normal text-[#8095B8]">
                                        {nftmetadata.collection}
                                    </div>
                                    <div className="flex">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle
                                                cx="11.9998"
                                                cy="12.0001"
                                                r="9.00375"
                                                fill="#00DBB6"
                                            />
                                            <path
                                                d="M8.44238 12.3392L10.6103 14.5071L10.5963 14.4931L15.4873 9.60209"
                                                stroke="#191D24"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_329_1577)">
                                            <path
                                                d="M16.6292 8.83985C16.3003 8.65186 15.8773 8.65186 15.5013 8.83985L12.8695 10.3908L11.0836 11.3777L8.49869 12.9286C8.16971 13.1166 7.74674 13.1166 7.37076 12.9286L5.34987 11.7067C5.02089 11.5187 4.7859 11.1427 4.7859 10.7197V8.36988C4.7859 7.9939 4.97389 7.61792 5.34987 7.38293L7.37076 6.208C7.69974 6.02001 8.12272 6.02001 8.49869 6.208L10.5196 7.42993C10.8486 7.61792 11.0836 7.9939 11.0836 8.41688V9.96779L12.8695 8.93385V7.33594C12.8695 6.95996 12.6815 6.58398 12.3055 6.34899L8.54569 4.14011C8.21671 3.95213 7.79373 3.95213 7.41775 4.14011L3.56397 6.39599C3.18799 6.58398 3 6.95996 3 7.33594V11.7537C3 12.1297 3.18799 12.5057 3.56397 12.7406L7.37076 14.9495C7.69974 15.1375 8.12272 15.1375 8.49869 14.9495L11.0836 13.4456L12.8695 12.4117L15.4543 10.9077C15.7833 10.7197 16.2063 10.7197 16.5822 10.9077L18.6031 12.0827C18.9321 12.2707 19.1671 12.6466 19.1671 13.0696V15.4195C19.1671 15.7955 18.9791 16.1714 18.6031 16.4064L16.6292 17.5814C16.3003 17.7694 15.8773 17.7694 15.5013 17.5814L13.4804 16.4064C13.1514 16.2184 12.9164 15.8425 12.9164 15.4195V13.9156L11.1305 14.9495V16.5004C11.1305 16.8764 11.3185 17.2524 11.6945 17.4874L15.5013 19.6962C15.8303 19.8842 16.2533 19.8842 16.6292 19.6962L20.436 17.4874C20.765 17.2994 21 16.9234 21 16.5004V12.0357C21 11.6597 20.812 11.2837 20.436 11.0487L16.6292 8.83985Z"
                                                fill="#8247E5"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_329_1577">
                                                <rect
                                                    width="24"
                                                    height="24"
                                                    fill="white"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex font-medium text-[24px] text-white">
                                {nftmetadata.name}
                            </div>
                        </div>
                        <div className="flex flex-col border-[1px] border-solid border-[#171F41]"></div>
                        <div className="flex flex-col gap-[4px]">
                            <div className="flex flex-row w-full justify-between items-center">
                                <div className="flex flex-row items-center justify-start gap-[4px]">
                                    <div className="flex text-[14px] font-normal text-[#8095B8]">
                                        Description
                                    </div>
                                </div>
                            </div>
                            <div className="flex font-normal text-[13px] text-white">
                                {nftmetadata.description}
                            </div>
                        </div>
                    </div>
                </div>
                {!isInUserRoute && doesUserHaveAnyUnclaimedReward && (
                    <div className="absolute inset-0 w-full h-full bg-[#0000008c] rounded-xl flex justify-center items-center">
                        <button
                            className="no-underline w-max cursor-pointer outline-none [border:none] py-[13px] px-[20px] bg-blue rounded-61xl flex flex-row box-border items-center justify-center"
                            onClick={handleClaimReward}>
                            <b className="text-[13px] outline-none tracking-[1.6px] leading-[16px] uppercase text-white text-center font-bold">
                                Claim NFT
                            </b>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaremintNFTCard;
