import {
    Address,
    useAccount,
    useContractRead,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
} from "wagmi";
import Skeleton from "react-loading-skeleton";
import { BigNumber } from "ethers";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { create } from "zustand";

import "react-loading-skeleton/dist/skeleton.css";
import NFTCard from "../cards/nftcard";
import RaremintNFTCard from "../cards/raremintnft";
import { get_user_badges_abi } from "@/abi/user";
import BadgeCard from "../cards/badgecard";
import {
    check_for_unclaimed_rewards_abi,
    claim_reward_abi,
    user_to_rare_token_id_abi,
} from "@/abi/raremint";
import ErrorModal from "../modals/error";
import SuccessModal from "../modals/success";
import LoadingModal from "../modals/loader";
import { RaremintNFTType } from "@/types/raremint";

type State = {
    nftmetadata: RaremintNFTType;
};

type Actions = {
    changeNftMetadata: (metadata: RaremintNFTType) => void;
};

const useAchievementsStore = create<State & Actions>((set) => ({
    nftmetadata: {
        id: 0,
        collection: "",
        description: "",
        image: "",
        name: "",
    },
    changeNftMetadata: (nftmetadata: RaremintNFTType) =>
        set((state: State) => ({ ...state, nftmetadata })),
}));

const Achievements = ({ address }: { address: string }) => {
    const {
        nftmetadata,
        // functions
        changeNftMetadata,
    } = useAchievementsStore((state) => state);

    const [errorTitle, setErrorTitle] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successTitle, setSuccessTitle] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loadingTitle, setLoadingTitle] = useState<string>("");
    const [loadingMessage, setLoadingMessage] = useState<string>("");

    const [isClaimRewardProcessing, setIsClaimRewardProcessing] =
        useState<boolean>(false);

    /**
     * @get hooks from wagmi
     */
    const { chain } = useNetwork();
    const { address: userAddress } = useAccount();
    const checkIfClaimIsClicked = useRef<boolean>(false);

    /**
     * @config to read user data with address
     */
    const { data, isError, isLoading, refetch } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_BADGES_ADDRESS as Address,
        abi: get_user_badges_abi,
        functionName: "getUserBadges",
        chainId: chain?.id,
        args: [address],
        enabled: false,
        onError(error: Error) {
            console.log(error.message);
        },
    });

    let badges = data as BigNumber[];

    useEffect(() => {
        refetch();
    }, []);

    /**
     * @config to fetch user rewards
     */
    const {
        data: userRewardsData,
        isError: userRewardsError,
        isLoading: userRewardsLoading,
        isFetching: userRewardsFetching,
        refetch: userRewardsRefetch,
    } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_AUTOMATION_ADDRESS as Address,
        abi: user_to_rare_token_id_abi,
        functionName: "s_userToRareTokenId",
        chainId: chain?.id,
        args: [address],
        enabled: false,
        onError(error: Error) {
            console.log(error);
            setLoadingTitle("");
            setLoadingMessage("");
            setErrorTitle(error.message);
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        },
        onSuccess: async (data) => {
            console.log(data);
            setLoadingTitle("");
            setLoadingMessage("");
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        },
    });

    useEffect(() => {
        userRewardsRefetch();
    }, []);

    useEffect(() => {
        if (address === userAddress && userRewardsFetching) {
            setLoadingTitle("Fetching user rewards...");
            setLoadingMessage("");
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        }
    }, [userRewardsFetching]);

    let rewardTokenId = userRewardsData as BigNumber;

    /**
     * @config to refetch user rewards
     */
    const {
        data: userUnclaimedRewardsData,
        isError: userUnclaimedRewardsError,
        isLoading: userUnclaimedRewardsLoading,
        isFetching: userUnclaimedRewardsFetching,
        refetch: userUnclaimedRewardsRefetch,
    } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_AUTOMATION_ADDRESS as Address,
        abi: check_for_unclaimed_rewards_abi,
        functionName: "checkForUnclaimedRewards",
        chainId: chain?.id,
        args: [address],
        enabled: false,
        onError(error: Error) {
            console.log(error);
        },
        onSuccess: async (data) => {
            console.log(data);
            setLoadingTitle("");
            setLoadingMessage("");
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        },
    });

    useEffect(() => {
        address === userAddress && userUnclaimedRewardsRefetch();
    }, []);

    useEffect(() => {
        if (userUnclaimedRewardsFetching) {
            setLoadingTitle("Checking for unclaimed rewards...");
            setLoadingMessage("");
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        }
    }, [userUnclaimedRewardsFetching]);

    let doesUserHaveAnyUnclaimedReward = userUnclaimedRewardsData as boolean;

    console.log({ userUnclaimedRewardsData });

    /**
     * @config to claim user reward
     */
    const loadNFTMetadata = async (tokenId: number) => {
        try {
            const response = await axios.get(
                `${
                    process.env.NEXT_PUBLIC_RAREMINT_NFTS_IPFS_LINK
                }${tokenId.toString()}.json`
            );
            console.log(response.data);
            changeNftMetadata(response.data);
            // setTagsMetadata(response.map((item): any => item.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (rewardTokenId?.toNumber() != 0) {
            loadNFTMetadata(rewardTokenId?.toNumber());
        }
    }, [rewardTokenId]);

    /**
     * @config to claim user reward
     */
    const { config: claim_reward_config } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_STACK3_AUTOMATION_ADDRESS as Address,
        abi: claim_reward_abi,
        functionName: "claimReward",
        chainId: chain?.id,
        args: [address],
        onError: (error: any) => {
            console.log(error.message);
        },
    });

    const { write: claim_reward } = useContractWrite({
        ...claim_reward_config,
        onError(error: Error) {
            console.log(error);
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
            setErrorTitle(error.message);
            setIsClaimRewardProcessing(false);
        },
        async onSuccess(data) {
            await data.wait();
            setIsClaimRewardProcessing(false);
            setLoadingTitle("");
            setLoadingMessage("");
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("Claimed reward successfully");
            await userRewardsRefetch();
            await userUnclaimedRewardsRefetch();
            console.log(data);
        },
    });

    useEffect(() => {
        if (isClaimRewardProcessing) {
            setLoadingTitle("Claiming reward...");
            setLoadingMessage("");
            setErrorTitle("");
            setErrorMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        }
    }, [isClaimRewardProcessing]);

    console.log(nftmetadata);

    async function handleClaimReward() {
        checkIfClaimIsClicked.current = true;
        console.log(checkIfClaimIsClicked);
        claim_reward?.();
        checkIfClaimIsClicked.current = false;
        setIsClaimRewardProcessing(true);
    }

    if (isLoading)
        return (
            <div className="bg-gray-100 rounded-xl p-6 lg:p-10 text-white">
                <div className="mb-12">
                    <h2 className="m-0 mb-6 text-[28px]">
                        <Skeleton
                            baseColor="#22294d"
                            highlightColor="#313a67"
                            height="42px"
                            width="300px"
                        />
                    </h2>
                    <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start">
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                    </div>
                </div>
                <div className="mb-12">
                    <h2 className="m-0 mb-6 text-[28px] flex flex-col lg:flex-row gap-y-10">
                        <Skeleton
                            baseColor="#22294d"
                            highlightColor="#313a67"
                            height="42px"
                            width="300px"
                        />
                    </h2>
                    <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start">
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                    </div>
                </div>
                <div className="">
                    <h2 className="m-0 mb-6 text-[28px] flex flex-col lg:flex-row gap-y-10">
                        <Skeleton
                            baseColor="#22294d"
                            highlightColor="#313a67"
                            height="42px"
                            width="300px"
                        />
                    </h2>
                    <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start">
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                        <div className="m-0 mb-3">
                            <NFTCard isFetching={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        );

    if (isError)
        return <div className="text-white">Not able to get badges.</div>;

    if (badges?.length === 0)
        return <div className="text-white">No Achievements</div>;

    const achievements: number[] = [],
        locked: number[] = [];

    badges?.map((badge: BigNumber, index: number) =>
        badge.gt(0) ? achievements.push(index) : locked.push(index)
    );

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
            <div className="bg-gray-100 rounded-xl p-6 lg:p-10 text-white">
                <div className="mb-12">
                    <div className="flex flex-col justify-between items-center mb-6 md:flex-row">
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="m-0 text-[28px]">
                                Raremint NFTs{" "}
                                <span className="text-silver-100 text-base">
                                    (
                                    {rewardTokenId?.toNumber() === 0
                                        ? "0"
                                        : "1"}{" "}
                                    NFT)
                                </span>
                            </h2>
                        </div>
                        {address === userAddress && (
                            <div>
                                <button
                                    className="no-underline w-full md:w-max cursor-pointer outline-none [border:none] py-[16px] px-[26px] bg-blue rounded-61xl flex flex-row box-border items-center justify-center"
                                    onClick={
                                        userUnclaimedRewardsRefetch as any
                                    }>
                                    <b className="text-[14px] outline-none tracking-[1.6px] leading-[16px] uppercase text-white text-center font-bold">
                                        Check for unclaimed rewards
                                    </b>
                                </button>
                            </div>
                        )}
                    </div>
                    {/* <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start">
                    <div className="flex flex-row gap-8 items-center justify-start pb-2">
                        {locked.map((index: number) => (
                            <BadgeCard key={index} id={index} locked />
                        ))}
                    </div>
                </div> */}
                    {rewardTokenId?.toNumber() === 0 ? (
                        <div className="flex flex-row gap-8 items-center justify-start text-[20px] text-silver-100">
                            No NFTs owned by user
                        </div>
                    ) : (
                        <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start md:overflow-x-auto">
                            <RaremintNFTCard
                                isFetching={false}
                                doesUserHaveAnyUnclaimedReward={
                                    doesUserHaveAnyUnclaimedReward
                                }
                                handleClaimReward={handleClaimReward}
                                nftmetadata={nftmetadata}
                                isInUserRoute={address !== userAddress}
                            />
                        </div>
                    )}
                </div>
                <div className="mb-12">
                    <h2 className="m-0 mb-6 text-[28px]">
                        Badges Collected{" "}
                        <span className="text-silver-100 text-base">
                            ({achievements.length} Badges)
                        </span>
                    </h2>
                    {achievements?.length > 0 ? (
                        <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start">
                            <div className="flex flex-row gap-8 items-center justify-start pb-2">
                                {achievements.map((index: number) => (
                                    <BadgeCard key={index} id={index} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        // <div className="flex flex-row gap-8 items-center justify-start pb-2">
                        //     {achievements.map((index: number) => (
                        //         <BadgeCard key={index} id={index} />
                        //     ))}
                        // </div>
                        <div className="flex flex-row gap-8 items-center justify-start text-lg">
                            No badges found
                        </div>
                    )}
                </div>
                <div className="">
                    <h2 className="m-0 mb-6 text-[28px]">
                        Badges Locked{" "}
                        <span className="text-silver-100 text-base">
                            ({locked.length} Badges)
                        </span>
                    </h2>
                    <div className="flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start">
                        <div className="flex flex-row gap-8 items-center justify-start pb-2">
                            {locked.map((index: number) => (
                                <BadgeCard key={index} id={index} locked />
                            ))}
                        </div>
                    </div>
                </div>

                {/* <div className=''>
        <h2 className='m-0 mb-6 text-[28px] flex flex-col lg:flex-row gap-y-10'>
          Merged NFTs{' '}
          <span className='text-silver-100 text-base'>(3 NFTs)</span>
        </h2>
        <div className='flex flex-row gap-8 overflow-x-scroll overflow-y-hidden items-center justify-start'>
          <div className='m-0 mb-3'>
            <NFTCard isFetching={isLoading} />
          </div>
          <div className='m-0 mb-3'>
            <NFTCard isFetching={isLoading} />
          </div>
          <div className='m-0 mb-3'>
            <NFTCard isFetching={isLoading} />
          </div>
          <div className='m-0 mb-3'>
            <NFTCard isFetching={isLoading} />
          </div>
          <div className='m-0 mb-3'>
            <NFTCard isFetching={isLoading} />
          </div>
        </div>
      </div> */}
            </div>
        </>
    );
};

export default Achievements;
