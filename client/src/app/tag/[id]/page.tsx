/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useContractRead, useContractReads, useQuery } from "wagmi";
import { BigNumber } from "ethers";
import Skeleton from "react-loading-skeleton";
import { create } from "zustand";

import "react-loading-skeleton/dist/skeleton.css";
import TrendingTags from "@/components/trendingTags";
import QuestionCardLarge from "@/components/cards/questionLarge";
import {
    get_all_questions_by_tag_abi,
    get_question_by_id_abi,
} from "@/abi/social";
import { Address, Question } from "@/types";
import { TAGS } from "@/constants/wallets";
import Pagination from "@/components/pagination";
import axios from "axios";

type PaginationState = {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    items: any[];
};

type PaginationActions = {
    setCurrentPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setTotalItems: (totalItems: number) => void;
    setTotalPages: (totalPages: number) => void;
    setItems: (items: any[]) => void;
};

const useTagQuestionsPaginationStore = create<
    PaginationState & PaginationActions
>((set) => ({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    items: [],
    setCurrentPage: (page) => set({ currentPage: page }),
    setPageSize: (pageSize) => set({ pageSize }),
    setTotalItems: (totalItems) => set({ totalItems }),
    setTotalPages: (totalPages) => set({ totalPages }),
    setItems: (items) => set({ items }),
}));

const tags = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

const Tag = ({ params }: { params: { id: number } }) => {
    const {
        currentPage,
        totalItems,
        pageSize,
        totalPages,
        items,
        setCurrentPage,
        setTotalItems,
        setTotalPages,
        setItems,
    } = useTagQuestionsPaginationStore();

    const [totalCount, setTotalCount] = useState(0);
    const [activeTag, setActiveTag] = useState(null);
    const [filteredQuestions, setFilteredQuestions] = useState<BigNumber[]>([]);

    const {
        data: ids,
        isLoading: isLoading,
        isError: isError,
        refetch: refetch,
        isFetching,
    } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: get_all_questions_by_tag_abi,
        functionName: "getQuestionsByTag",
        args: [params.id],
        enabled: false,
    });

    useEffect(() => {
        const questionIds = ids as BigNumber[];
        // setFilteredQuestions(questionIds)
        setFilteredQuestions(questionIds?.filter((id) => Number(id) != 0));
    }, [ids]);

    console.log({ filteredQuestions });

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

    const { data } = useQuery(
        ["load-all-tags-metadata"],
        () => loadQnMetadata(tags),
        { enabled: false }
    );

    useEffect(() => {
        if (data) {
            setActiveTag(data[params.id]);
        }
    }, [data, params.id]);

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (!isLoading && !isError && filteredQuestions) {
            const count_list: BigNumber[] = filteredQuestions as BigNumber[];
            const temp_count = count_list.length;

            setTotalItems(temp_count);
            setTotalPages(Math.ceil(temp_count / pageSize));
        }
    }, [
        filteredQuestions,
        isError,
        isLoading,
        pageSize,
        setTotalItems,
        setTotalPages,
    ]);

    useEffect(() => {
        if (totalItems > 0) {
            const temp_ids = filteredQuestions as BigNumber[];
            const start = totalItems - (currentPage - 1) * pageSize;
            const end = Math.max(start - pageSize + 1, 1);

            console.log({ totalItems });
            setItems(temp_ids?.slice(start, end));
        }
    }, [
        totalItems,
        currentPage,
        filteredQuestions,
        totalPages,
        setItems,
        pageSize,
    ]);

    const contract = {
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: get_question_by_id_abi,
        functionName: "getQuestionById",
    };

    const {
        data: questions,
        isLoading: isQuestionsLoading,
        isError: isQuestionsError,
        refetch: refetchQuestions,
    } = useContractReads({
        contracts: items?.map((id: number) => ({
            ...contract,
            args: [id],
        })) as any,
        enabled: false,
    });

    let questions_list: Question[] = questions as Question[];

    console.log({ items });

    useEffect(() => {
        if (items?.length > 0) {
            refetchQuestions();
        }
    }, [items, refetchQuestions]);

    useEffect(() => {
        if (totalItems > 0) {
            const start = totalItems - (currentPage - 1) * pageSize;
            const end = Math.max(start - pageSize + 1, 1);

            const items_list: number[] = [];

            for (let i = start; i >= end; i--) {
                items_list.push(i);
            }

            setItems(items_list);
        }
    }, [totalItems, currentPage, totalPages, setItems, pageSize]);

    useEffect(() => {
        const parseTotalItemsWithParams = async (questions: Question[]) => {
            const totalCount = questions?.reduce(
                (count: number, question: Question) => {
                    const isNumberIncluded = question?.tags.some(
                        (obj) =>
                            parseInt(obj._hex, 16) ===
                            parseInt(params?.id as any)
                    );

                    if (isNumberIncluded) {
                        count += 1;
                    }

                    return count;
                },
                0
            );

            return totalCount;
        };

        const fetchTotalCount = async () => {
            const totalCount = await parseTotalItemsWithParams(
                questions as Question[]
            );
            setTotalCount(totalCount);
        };

        fetchTotalCount();
    }, [params?.id, questions]);

    if (isLoading || isQuestionsLoading) {
        return (
            <Wrapper
                id={params.id}
                isFetching={isFetching}
                activeTag={activeTag}>
                <div className="text-[20px] leading-6 mb-4 font-normal text-silver-100">
                    <div
                        role="status"
                        className="flex flex-col items-center justify-center w-full">
                        <svg
                            aria-hidden="true"
                            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#3a4379"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#4F6AFB"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </Wrapper>
        );
    }

    if (isError || isQuestionsError) {
        return (
            <Wrapper
                id={params.id}
                isFetching={isFetching}
                activeTag={activeTag}>
                <div className="text-[20px] leading-6 mb-4 font-normal text-silver-100">
                    Something went wrong.
                </div>
            </Wrapper>
        );
    }

    if (items?.length === 0 || questions_list?.length === 0) {
        return isFetching ? (
            <Wrapper
                id={params.id}
                isFetching={isFetching}
                activeTag={activeTag}>
                <div className="text-[20px] leading-6 mb-4 font-normal text-silver-100">
                    <Skeleton
                        baseColor="#22294d"
                        highlightColor="#313a67"
                        width={250}
                    />
                </div>
            </Wrapper>
        ) : (
            <Wrapper
                id={params.id}
                isFetching={isFetching}
                activeTag={activeTag}>
                <div className="text-[20px] leading-6 mb-4 font-normal text-silver-100">
                    No questions to show.
                </div>
            </Wrapper>
        );
    }

    return isFetching ? (
        <Wrapper id={params.id} isFetching={isFetching} activeTag={activeTag}>
            <>
                <div className="text-[24px] leading-6 mb-4 font-medium text-silver-100">
                    <Skeleton
                        baseColor="#22294d"
                        highlightColor="#313a67"
                        height="26px"
                        width="150px"
                    />
                </div>

                {questions_list?.map((question: Question) => (
                    <div className="m-0 mb-3" key={question?.id.toString()}>
                        <Skeleton
                            baseColor="#22294d"
                            highlightColor="#313a67"
                            height="92px"
                            width="100%"
                            borderRadius={20}
                        />
                    </div>
                ))}
            </>
        </Wrapper>
    ) : (
        <Wrapper id={params.id} isFetching={isFetching} activeTag={activeTag}>
            <>
                <div className="text-[24px] leading-6 mb-4 font-medium text-silver-100">
                    {totalItems} {totalItems === 1 ? "Question" : "Questions"}
                </div>

                {/* {questions_list?.map((question: Question) => {
          const isNumberIncluded = question?.tags.some(
            (obj) => parseInt(obj._hex, 16) == parseInt(params?.id as any)
          );

          return (
            isNumberIncluded && (
              <div className='m-0 mb-3' key={question?.id.toString()}>
                <QuestionCardLarge {...question} />
              </div>
            )
          );
        })} */}

                {questions_list?.map((question: Question) => (
                    <div className="m-0 mb-3" key={question?.id.toString()}>
                        <QuestionCardLarge {...question} />
                    </div>
                ))}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </>
        </Wrapper>
    );
};

export default Tag;

const Wrapper = ({
    children,
    isFetching,
    id,
    activeTag,
}: {
    children: JSX.Element;
    isFetching: boolean;
    id: number;
    activeTag: any;
}) => {
    return isFetching ? (
        <div className="bg-darkblue px-6 py-14 xl:p-[56px]">
            <div className="grid grid-cols-12 gap-x-6 items-start justify-start">
                <div className="hidden lg:flex col-span-3 flex-col gap-y-6">
                    <TrendingTags />
                </div>
                <div className="col-span-12 lg:col-span-9 rounded-3xl bg-gray-100 p-9">
                    <div className="flex flex-col md:flex-row gap-y-6 items-center justify-between text-[32px] text-white mb-16 md:mb-7">
                        <div className="flex flex-col gap-2 w-1/2">
                            <h1 className="text-[32px] leading-10 text-center xl:text-left m-0">
                                <Skeleton
                                    baseColor="#22294d"
                                    highlightColor="#313a67"
                                    height="42px"
                                    width="220px"
                                />
                            </h1>
                            <p className="hidden text-[16px] text-center xl:text-left m-0 md:flex">
                                <Skeleton
                                    baseColor="#22294d"
                                    highlightColor="#313a67"
                                    height="22px"
                                    width="400px"
                                    count={3}
                                />
                            </p>
                        </div>
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
                    {children}
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
                    <div className="flex flex-col md:flex-row gap-y-6 items-center justify-between text-[32px] text-white mb-16 md:mb-10">
                        <div className="flex flex-col gap-2 md:w-1/2">
                            <h1 className="text-[32px] leading-10 text-center xl:text-left m-0">
                                {TAGS[id]}
                            </h1>
                            <p className="text-[16px] text-center xl:text-left m-0">
                                {activeTag?.description}
                            </p>
                        </div>
                        <Link
                            href="/ask-question"
                            className="no-underline w-full md:w-max cursor-pointer outline-none [border:none] py-[20px] px-[32px] bg-blue rounded-61xl flex flex-row box-border items-center justify-center">
                            <b className="text-[16px] outline-none tracking-[1.6px] leading-[16px] uppercase text-white text-center font-bold">
                                Ask A Question
                            </b>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};
