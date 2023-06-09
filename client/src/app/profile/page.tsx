/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import {
    Address,
    useAccount,
    useContractRead,
    useNetwork,
    useQuery,
} from "wagmi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Stats from "@/components/stats";
import Achievements from "@/components/achievement";
import Setting from "@/components/setting";
import { get_user_by_address_abi } from "@/abi/user";
import { UserContract, UserMetadata } from "@/types";

type State = {
    user: any;
    address: string;
    socials: Array<Object>;
};

type Actions = {
    changeUser: (user: UserMetadata) => void;
    changeAddress: (address: string) => void;
    changeSocials: (socials: Array<Object>) => void;
};

const useProfileStore = create<State & Actions>((set) => ({
    user: {
        banner: "",
        bio: "",
        email: "",
        name: "",
        profile: "",
    },
    address: "",
    socials: [],
    //functions
    changeUser: (user: UserMetadata) =>
        set((state: State) => ({ ...state, user })),
    changeAddress: (address: string) =>
        set((state: State) => ({ ...state, address })),
    changeSocials: (socials: Array<Object>) =>
        set((state: State) => ({ ...state, socials })),
}));

const Profile = () => {
    const {
        user: state_user,
        address: state_address,
        socials,
        changeUser,
        changeAddress,
        changeSocials,
    } = useProfileStore((state) => state);

    const [active, set_active] = useState<string>("Stats");
    const [toggleBio, set_toggle_bio] = useState<boolean>(false);
    const [fakeProfileDelay, setFakeProfileDelay] = useState<boolean>(true);

    const { address, isConnected, isDisconnected } = useAccount();
    const { chain } = useNetwork();
    const router = useRouter();

    const {
        data: user_data,
        isLoading: isUserLoading,
        isError: isUserError,
        isFetching: isUserFetching,
        refetch: refetchUser,
    } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: get_user_by_address_abi,
        functionName: "getUserByAddress",
        chainId: chain?.id,
        args: [address],
        onError(error: Error) {
            console.log(error.message);
        },
    });

    const profile_contract = user_data as UserContract;

    const {
        data: profile,
        isError: isProfileError,
        isLoading: isProfileLoading,
        isFetching: isProfileFetching,
        refetch: refetchProfile,
    } = useQuery(["user-profile", address, profile_contract?.uri], () =>
        axios.get(profile_contract?.uri)
    );

    const user = profile?.data as UserMetadata;

    /**
     * @calls UseEffect calls for setting state address, user, questions, questionIds, answerIds
     * and answers
     */
    useEffect(() => {
        changeUser(user);
        changeAddress(address as string);
    }, [address, user, changeAddress, changeUser]);

    useEffect(() => {
        if (!isProfileFetching) {
            setTimeout(() => {
                setFakeProfileDelay(false);
            }, 1000);
        }
    }, [isProfileFetching]);

    useEffect(() => {
        refetchUser();
    }, [user_data]);

    useEffect(() => {
        if (!isConnected || isDisconnected) {
            router.push("/connect-wallet");
        }
    }, [isConnected, isDisconnected, router]);

    return fakeProfileDelay ? (
        <div className="relative w-full flex flex-col items-center bg-darkblue">
            <div className="w-full h-40 z-1">
                <Skeleton
                    baseColor="#1A203B"
                    highlightColor="#242c4f"
                    // height="54px"
                    width="100%"
                    height="100%"
                />
            </div>
            <div className="absolute top-[120px] lg:top-20 left-0 right-0 flex items-end justify-between px-4 lg:px-8 w-full lg:w-9/12 mx-auto">
                <div className="w-20 h-20 lg:w-36 lg:h-36 rounded-full overflow-hidden">
                    <Skeleton
                        baseColor="#242c52"
                        highlightColor="#2b355f"
                        // height="54px"
                        width="100%"
                        height="100%"
                        borderRadius={500}
                    />
                </div>
                <ul className="list-none flex flex-row gap-x-4 m-0 p-0">
                    <li>
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            // height="54px"
                            width="36px"
                            height="36px"
                            borderRadius={500}
                        />
                    </li>
                    <li>
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            // height="54px"
                            width="36px"
                            height="36px"
                            borderRadius={500}
                        />
                    </li>

                    <li>
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            // height="54px"
                            width="36px"
                            height="36px"
                            borderRadius={500}
                        />
                    </li>
                    <li>
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            // height="54px"
                            width="36px"
                            height="36px"
                            borderRadius={500}
                        />
                    </li>
                    <li>
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            // height="54px"
                            width="36px"
                            height="36px"
                            borderRadius={500}
                        />
                    </li>
                </ul>
            </div>
            <div className="mt-20 px-6 lg:px-8 pb-14 w-full lg:w-9/12">
                <div className="flex flex-col justify-center items-start lg:w-1/3">
                    <div className="flex flex-col items-start w-full">
                        <h1 className="m-0 mb-2 text-lg lg:text-[2rem] text-white w-full">
                            <Skeleton
                                baseColor="#1A203B"
                                highlightColor="#242c4f"
                                height="100%"
                                width="200px"
                            />
                        </h1>
                    </div>
                    <p className="m-0 mb-2 text-sm lg:text-lg text-gray-200  w-full">
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            height="100%"
                            width="100%"
                        />
                    </p>
                    <p className="m-0 mb-10 text-base lg:text-lg text-gray-50 w-full">
                        <Skeleton
                            baseColor="#1A203B"
                            highlightColor="#242c4f"
                            height="100%"
                            width="100%"
                        />
                    </p>
                </div>
                <ul className="m-0 mb-10 p-0 flex items-center gap-x-8 list-none overflow-auto w-full">
                    <li className="p-0 m-0">
                        <div className={``}>
                            <Skeleton
                                baseColor="#1A203B"
                                highlightColor="#242c4f"
                                height="52px"
                                width="120px"
                                borderRadius={500}
                            />
                        </div>
                    </li>
                    <li className="p-0 m-0">
                        <div className={``}>
                            <Skeleton
                                baseColor="#1A203B"
                                highlightColor="#242c4f"
                                height="52px"
                                width="200px"
                                borderRadius={500}
                            />
                        </div>
                    </li>
                    <li className="p-0 m-0">
                        <div className={``}>
                            <Skeleton
                                baseColor="#1A203B"
                                highlightColor="#242c4f"
                                height="52px"
                                width="150px"
                                borderRadius={500}
                            />
                        </div>
                    </li>
                </ul>
                <Skeleton
                    baseColor="#1A203B"
                    highlightColor="#242c4f"
                    height="600px"
                    width="100%"
                    borderRadius={24}
                />
            </div>
        </div>
    ) : (
        <div className="relative w-full flex flex-col items-center bg-darkblue">
            <div className="w-full h-40">
                <img
                    className="object-cover w-full h-full"
                    src={user?.banner || "dummy-banner.png"}
                    alt="Banner"
                />
            </div>
            <div className="absolute top-[120px] lg:top-20 left-0 right-0 flex items-end justify-between px-4 lg:px-8 w-full lg:w-9/12 mx-auto">
                <div className="w-20 h-20 lg:w-36 lg:h-36 rounded-full overflow-hidden border-solid border-[3px] border-silver-100">
                    <img
                        className="object-cover w-full h-full"
                        src={user?.profile || "profile.jpeg"}
                        alt="Profile picture"
                    />
                </div>
                <ul className="list-none flex flex-row gap-x-4 m-0 p-0">
                    <li>
                        <a
                            className={`text-white ${
                                user?.email ? "" : "pointer-events-none"
                            }`}
                            href={`mailto:${user?.email}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                                stroke={
                                    user?.email ? "currentColor" : "#899499"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <g id="style=linear">
                                    <g id="email">
                                        <path
                                            id="vector"
                                            d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                                            stroke={
                                                user?.email
                                                    ? "currentColor"
                                                    : "#899499"
                                            }
                                            strokeWidth="1.5"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            id="vector_2"
                                            d="M18.7698 7.7688L13.2228 12.0551C12.5025 12.6116 11.4973 12.6116 10.777 12.0551L5.22998 7.7688"
                                            stroke={
                                                user?.email
                                                    ? "currentColor"
                                                    : "#899499"
                                            }
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-white ${
                                user?.personalWebsite
                                    ? ""
                                    : "pointer-events-none"
                            }`}
                            target="_blank"
                            href={user?.personalWebsite}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                    user?.personalWebsite
                                        ? "currentColor"
                                        : "#899499"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-globe">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-white ${
                                user?.linkedin ? "" : "pointer-events-none"
                            }`}
                            target="_blank"
                            href={user?.linkedin}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                    user?.linkedin ? "currentColor" : "#899499"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-linkedin">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-white ${
                                user?.github ? "" : "pointer-events-none"
                            }`}
                            target="_blank"
                            href={user?.github}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                    user?.github ? "currentColor" : "#899499"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-github">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-white ${
                                user?.twitter ? "" : "pointer-events-none"
                            }`}
                            target="_blank"
                            href={user?.twitter}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                    user?.twitter ? "currentColor" : "#899499"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-twitter">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="mt-20 px-6 lg:px-8 pb-14 w-full lg:w-9/12">
                <div className="flex flex-col justify-center items-start lg:w-1/3">
                    <div className="flex flex-col items-start">
                        <h1 className="m-0 mb-2 text-lg lg:text-[2rem] text-white">
                            {user?.name}
                        </h1>
                    </div>
                    <p className="m-0 mb-2 text-sm lg:text-lg text-gray-200">
                        {address?.substring(0, 10)}...{address?.substring(30)}
                    </p>
                    <p className="m-0 mb-10 text-base lg:text-lg text-gray-50">
                        {user?.bio.length > 150 ? (
                            <>
                                {toggleBio
                                    ? user?.bio
                                    : user?.bio.substring(0, 150)}
                                ...{" "}
                                <button
                                    onClick={() =>
                                        set_toggle_bio((prev) => !prev)
                                    }
                                    className="border-none bg-transparent font-semibold text-silver-100 cursor-pointer">
                                    {toggleBio ? "See less" : "See more"}
                                </button>
                            </>
                        ) : (
                            user?.bio
                        )}
                    </p>
                </div>
                <ul className="m-0 mb-10 p-0 flex items-center gap-x-8 list-none overflow-auto w-full">
                    <li className="p-0 m-0">
                        <button
                            onClick={() => set_active("Stats")}
                            className={`cursor-pointer bg-transparent flex items-center gap-x-1 py-3 px-6 rounded-full ${
                                active === "Stats"
                                    ? "text-darkblue bg-white"
                                    : "text-white"
                            }`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    fill="#000000"
                                    d="M9 17a1 1 0 102 0H9zm2-14a1 1 0 10-2 0h2zM3 17a1 1 0 102 0H3zm2-7a1 1 0 00-2 0h2zm10 7a1 1 0 102 0h-2zm2-10a1 1 0 10-2 0h2zm-6 10V3H9v14h2zm-6 0v-7H3v7h2zm12 0V7h-2v10h2z"
                                />
                            </svg>
                            <span
                                className={`${
                                    active === "Stats" && "font-medium"
                                } text-lg`}>
                                Stats
                            </span>
                        </button>
                    </li>
                    <li className="p-0 m-0">
                        <button
                            onClick={() => set_active("Achievements")}
                            className={`cursor-pointer bg-transparent flex items-center gap-x-2 py-3 px-6 rounded-full ${
                                active === "Achievements"
                                    ? "text-darkblue bg-white"
                                    : "text-white"
                            }`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                            </svg>

                            <span
                                className={`${
                                    active === "Stats" && "font-medium"
                                } text-lg`}>
                                Achievements
                            </span>
                        </button>
                    </li>
                    <li className="p-0 m-0">
                        <button
                            onClick={() => set_active("Setting")}
                            className={`cursor-pointer bg-transparent flex items-center gap-x-2 py-3 px-6 rounded-full ${
                                active === "Setting"
                                    ? "text-darkblue bg-white"
                                    : "text-white"
                            }`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    // fill="#000000"
                                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                    // stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    // fill="#000000"
                                    d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
                                    // stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span
                                className={`${
                                    active === "Stats" && "font-medium"
                                } text-lg`}>
                                Settings
                            </span>
                        </button>
                    </li>
                </ul>
                {active === "Stats" ? (
                    <Stats
                        aUpvotes={profile_contract?.aUpvotes}
                        answers={profile_contract?.answers}
                        qUpvotes={profile_contract?.qUpvotes}
                        questions={profile_contract?.questions}
                        id={profile_contract?.id}
                        comments={profile_contract?.comments}
                        bestAnswerCount={profile_contract?.bestAnswerCount}
                    />
                ) : active === "Achievements" ? (
                    <Achievements address={address as string} />
                ) : active === "Setting" ? (
                    <Setting refetchUser={refetchUser} />
                ) : null}
            </div>
        </div>
    );
};

export default Profile;
