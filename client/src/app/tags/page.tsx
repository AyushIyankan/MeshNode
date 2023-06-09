/* eslint-disable @next/next/no-img-element */
"use client";

import type { NextPage } from "next";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "wagmi";
import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import TrendingTags from "@/components/trendingTags";
import TagCardLarge from "@/components/cards/tagLarge";

const tags = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

const Tags: NextPage = () => {
    const loadQnMetadata = async (tags: number[]) => {
        try {
            const response = await Promise.all(
                tags.map((tag: number) =>
                    axios.get(
                        `${
                            process.env.NEXT_PUBLIC_TAGS_IPFS_LINK
                        }${tag.toString()}.json`
                    )
                )
            );
            return response.map((item): any => item.data);
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isLoading, isError, refetch } = useQuery(
        ["load-all-tags-metadata"],
        () => loadQnMetadata(tags),
        { enabled: false }
    );

    useEffect(() => {
        refetch();
    });

    if (isError) {
        return (
            <div className="text-white">
                Something went wrong. Not able to load the tags.
            </div>
        );
    }

    return isLoading ? (
        <div className="bg-darkblue px-6 py-14 xl:p-[56px]">
            <div className="grid grid-cols-12 gap-x-6 items-start justify-start">
                <div className="hidden lg:flex col-span-3 flex-col gap-y-6">
                    <TrendingTags />
                </div>
                <div className="col-span-12 lg:col-span-9 rounded-3xl bg-gray-100 p-9">
                    <div className="flex flex-col md:flex-row gap-y-6 items-center justify-between text-[32px] text-white mb-16 md:mb-7">
                        <h1 className="text-[32px] leading-10 text-center xl:text-left m-0">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="42px"
                                width="80px"
                            />
                        </h1>
                        <Link
                            href="/ask-question"
                            className="w-full md:max-w-[220px]">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height={60}
                                // width={220}
                                borderRadius={500}
                            />
                        </Link>
                    </div>

                    <div className="text-[24px] leading-6 mb-4 font-medium text-silver-100">
                        <Skeleton
                            baseColor="#22294d"
                            highlightColor="#313a67"
                            height="28px"
                            width="110px"
                        />
                    </div>

                    <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:md-grid-cols-4 gap-4 items-stretch">
                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>

                        <div className="cursor-pointer [border:none] rounded-xl w-full flex-col box-border justify-start no-underline">
                            <Skeleton
                                baseColor="#22294d"
                                highlightColor="#313a67"
                                height="138px"
                                borderRadius={20}
                                // width="110px"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Skeleton
                            baseColor="#22294d"
                            highlightColor="#313a67"
                            height="40px"
                            borderRadius={20}
                            width="230px"
                        />
                        {/* <Pagination currentPage={1} totalPages={192} /> */}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="bg-darkblue px-6 py-14 xl:p-[56px]">
            <div className="grid grid-cols-12 gap-x-6 items-start justify-start">
                <div className="hidden lg:flex col-span-3 flex-col gap-y-6">
                    <TrendingTags />
                </div>
                <div className="col-span-12 lg:col-span-9 rounded-3xl bg-gray-100 p-9">
                    <div className="flex flex-col md:flex-row gap-y-6 items-center justify-between text-[32px] text-white mb-16 md:mb-7">
                        <h1 className="text-[32px] leading-10 text-center xl:text-left m-0">
                            Tags
                        </h1>
                        <Link
                            href="/ask-question"
                            className="no-underline w-full md:w-max cursor-pointer outline-none [border:none] py-[20px] px-[32px] bg-blue rounded-61xl flex flex-row box-border items-center justify-center">
                            <b className="text-[16px] outline-none tracking-[1.6px] leading-[16px] uppercase text-white text-center font-bold">
                                Ask A Question
                            </b>
                        </Link>
                    </div>

                    <div className="text-[24px] leading-6 mb-4 font-medium text-silver-100">
                        {tags.length} Tags
                    </div>

                    <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:md-grid-cols-4 gap-4 items-stretch">
                        {data?.map((item: any) => (
                            <div key={item.id}>
                                <TagCardLarge
                                    name={item.name}
                                    description={item.description}
                                    icon={item.icon}
                                    id={item.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tags;
