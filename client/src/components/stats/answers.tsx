import { useEffect, useState } from "react";
import {
    useAccount,
    useContractRead,
    useContractReads,
    useNetwork,
} from "wagmi";
import { BigNumber } from "ethers";

import { get_answers_by_user_address } from "@/abi/user";
import usePaginationStore from "@/store/pagination";
import { Address, Answer } from "@/types";
import { get_answer_by_id_abi } from "@/abi/social";
import AnswerCardLarge from "../cards/answerLarge";

const Answers = ({ data }: { data: BigNumber[] }) => {
    const { chain } = useNetwork();
    const { address } = useAccount();

    const [currentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [items, setItems] = useState<BigNumber[]>([]);

    const { pageSize } = usePaginationStore();

    useEffect(() => {
        if (data) {
            let count: any = data as BigNumber[];
            count = count.length;

            setTotalItems(count);
            setTotalPages(count < pageSize ? 1 : Math.ceil(count / pageSize));
        }
    }, [data]);

    useEffect(() => {
        if (totalItems > 0 && currentPage > 0) {
            let startIndex = 0;
            let endIndex = 0;

            if (totalPages === 1) {
                startIndex = 0;
                endIndex = totalItems;
            } else {
                startIndex = (totalPages - currentPage) * 10;
                endIndex = startIndex + 10;
            }

            let temp = [...data];

            setItems(temp.reverse().slice(startIndex, endIndex));
        }
    }, [totalItems, currentPage]);

    const contract = {
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: get_answer_by_id_abi,
        functionName: "getAnswerById",
    };

    const {
        data: answers,
        isLoading: isAnswersLoading,
        isError: isAnswersError,
        refetch: refetchAnswers,
    } = useContractReads({
        contracts: items?.map((id: BigNumber) => ({
            ...contract,
            args: [id],
        })) as any,
        enabled: false,
    });

    let questions_list: Answer[] = answers as Answer[];

    useEffect(() => {
        if (items.length > 0) {
            refetchAnswers();
        }
    }, [items]);

    if (isAnswersLoading) {
        return (
            <Wrapper total={data?.length}>
                <div className="text-[20px] text-silver-100">
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

    if (isAnswersError) {
        return (
            <Wrapper total={data?.length}>
                <div className="text-[20px] text-silver-100">
                    Something went wrong.
                </div>
            </Wrapper>
        );
    }

    if (items.length === 0 || questions_list?.length === 0) {
        return (
            <Wrapper total={data?.length}>
                <div className="text-[20px] text-silver-100">
                    No questions to show.
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper total={data?.length}>
            <div>
                {questions_list?.map((question: Answer) => (
                    <div className="m-0 mb-3" key={question?.id.toString()}>
                        <AnswerCardLarge {...question} />
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

export default Answers;

const Wrapper = ({
    children,
    total,
}: {
    children: JSX.Element;
    total: number;
}) => {
    return (
        <div>
            <h2 className="m-0 mb-6 text-[28px] flex flex-col lg:flex-row lg:items-center lg:gap-x-4 gap-y-10">
                {"Answers Posted "}
                <span className="text-silver-100 text-base">
                    ({total} Answers)
                </span>
            </h2>
            {children}
        </div>
    );
};
