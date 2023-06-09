/* eslint-disable @next/next/no-img-element */
"use client";

import { get_question_by_uri_abi } from "@/abi/social";
import { Address } from "@/types";
import search from "@/utils/search";
import { BigNumber } from "ethers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import { useAccount, useContractReads, useDisconnect } from "wagmi";

const Navigation = () => {
    const [toggle, set_toggle] = useState<boolean>(false);
    const [isSearching, set_isSearching] = useState<boolean>(false);
    const [searchTerm, set_searchTerm] = useState<string>("");
    const [uris, set_uris] = useState<any[]>([]);
    const [ids, set_ids] = useState<string[]>([]);
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const pathname = usePathname();

    const { data, isLoading, refetch } = useContractReads({
        contracts: uris.map((uri) => ({
            address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
            abi: get_question_by_uri_abi,
            functionName: "getQuestionByUri",
            args: [`${process.env.NEXT_PUBLIC_IPFS_LINK}${uri.ipfs_pin_hash}`],
        })),
        onError(error) {
            console.log(error);
        },
        onSuccess() {
            set_isSearching(false);
        },
    });

    const onInputKeydown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && searchTerm) {
            set_isSearching(true);
            const data: any[] = await search(searchTerm);

            set_uris(data);
        }
    };

    useEffect(() => {
        if (uris.length > 0) {
            refetch();
        }
    }, [refetch, uris]);

    useEffect(() => {
        const ids = data as BigNumber[];

        if (ids?.length > 0) {
            set_ids(ids.map((id) => id.toString()));
        }
    }, [data]);

    return (
        <header className="py-0 px-0 lg:py-[16px] xl:px-[60px] xl:flex xl:justify-between">
            <div className="flex flex-row items-center justify-between py-4 px-6 xl:py-0 xl:px-0 xl:basis-1/3">
                <Link
                    prefetch={false}
                    href="/"
                    className="flex flex-row gap-x-2 items-center justify-center w-[max-content] no-underline">
                    <img
                        className="w-8 xl:w-10"
                        alt="w-8"
                        src="/logo_icon.svg"
                    />
                    <div className="text-white xl:text-lg">MeshNode</div>
                </Link>
                <button
                    onClick={() => set_toggle(false)}
                    className={`${
                        toggle ? "flex" : "hidden"
                    } cursor-pointer border-none bg-transparent items-center justify-center text-white xl:hidden`}
                    aria-label="Close Menu">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <button
                    onClick={() => set_toggle(true)}
                    className={`${
                        !toggle ? "flex" : "hidden"
                    } cursor-pointer border-none bg-transparent flex items-center justify-center text-white xl:hidden`}
                    aria-label="Open Menu">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>
            <div
                className={`${
                    toggle ? "flex" : "hidden"
                } xl:flex bg-gray-100 p-6 flex-col items-center gap-y-10 lg:flex-row lg:justify-between xl:gap-x-10 xl:bg-transparent xl:p-0 xl:w-full xl:min-w-max`}>
                <div className="relative flex items-center h-12 focus-within:shadow-lg bg-gray-900 xl:bg-gray-100 rounded-full  w-[300px] py-[0px] px-[24px]">
                    <div className="grid place-items-center h-full w-12 text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#fff">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <input
                        onChange={(event) => set_searchTerm(event.target.value)}
                        onKeyDown={onInputKeydown}
                        className="flex flex-col items-center justify-center bg-gray-900 xl:bg-gray-100 peer h-full w-full outline-none text-md text-white placeholder-white pr-2 border-none focus:border-none active:border-none border-transparent focus:border-transparent focus:ring-0"
                        type="text"
                        id="search"
                        placeholder="Search"
                        value={searchTerm}
                    />

                    {searchTerm === "" ? null : (
                        <div className="absolute left-0 top-12 w-full bg-silver-100 rounded-xl z-30">
                            {(isSearching || isLoading) &&
                            searchTerm.length > 0 ? (
                                <p className="text-center">Loading...</p>
                            ) : uris.length > 0 ? (
                                <ul className="list-none px-0 py-2 m-0 overflow-hidden">
                                    {uris.map((uri, index) => (
                                        <li
                                            className="w-full p-0 m-0"
                                            key={uri?.ipfs_pin_hash}>
                                            <Link
                                                onClick={() =>
                                                    set_searchTerm("")
                                                }
                                                className="no-underline text-dark-blue block px-6 py-2 hover:bg-slate-500 cursor-pointer"
                                                href={`/question/${ids[index]}`}>
                                                {uri?.metadata?.name.substring(
                                                    0,
                                                    25
                                                )}
                                                ...
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center">
                                    No questions found!
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <ul className="list-none flex flex-row items-center justify-center gap-[24px] text-base leading-[16px] font-medium p-0 m-0">
                    <li className="w-max">
                        <Link
                            prefetch={false}
                            href="/questions"
                            className={`text-white px-4 py-2 text-sm xl:text-lg ${
                                pathname.includes("questions")
                                    ? "underline underline-offset-8"
                                    : "no-underline"
                            }`}>
                            Questions
                        </Link>
                    </li>
                    <li className="w-max">
                        <Link
                            prefetch={false}
                            href="/tags"
                            className={`text-white px-4 py-2 text-sm xl:text-lg ${
                                pathname.includes("tags")
                                    ? "underline underline-offset-8"
                                    : "no-underline"
                            }`}>
                            Tags
                        </Link>
                    </li>
                    <li className="w-max">
                        <Link
                            prefetch={false}
                            href="/about"
                            className={`text-white px-4 py-2 text-sm xl:text-lg ${
                                pathname.includes("about")
                                    ? "underline underline-offset-8"
                                    : "no-underline"
                            }`}>
                            About Us
                        </Link>
                    </li>
                </ul>
                <div
                    className={`${
                        isConnected ? "flex" : "hidden"
                    } items-center gap-x-4`}>
                    <Link
                        prefetch={false}
                        href="/profile"
                        className="no-underline cursor-pointer outline-none bg-white text-darkblue flex flex-row gap-x-2 box-border items-center justify-center py-[11px] px-[32px] rounded-61xl h-[max-content]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span className="no-underline">
                            {address?.substring(0, 6)}...
                            {address?.substring(38)}
                        </span>
                    </Link>
                    <button
                        onClick={() => disconnect()}
                        className="cursor-pointer outline-none [border:none] py-[18px] px-[32px] bg-blue text-white rounded-61xl flex flex-row box-border items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                        </svg>
                    </button>
                </div>
                <div className={`${!isConnected ? "flex" : "hidden"} w-max`}>
                    <Link
                        prefetch={false}
                        href="/connect-wallet"
                        className="no-underline w-max cursor-pointer outline-none [border:none] py-[20px] px-[32px] bg-blue rounded-61xl flex flex-row box-border items-center justify-center">
                        <b className="text-[16px] outline-none tracking-[1.6px] leading-[16px] uppercase text-white text-center font-bold">
                            CONNECT WALLET
                        </b>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navigation;
