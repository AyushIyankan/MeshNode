/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    useAccount,
    useContractRead,
    useContractReads,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useQuery,
} from "wagmi";
import { create } from "zustand";
import { BigNumber } from "ethers";

import { get_user_by_address_abi } from "@/abi/user";
import MarkdownRenderer from "@/components/mdx/renderer";
import AvatarLarge from "@/components/user/avatarLarge";
import { Address, Comment, UserContract, UserMetadata } from "@/types";
import {
    choose_best_answer_abi,
    get_comment_by_id,
    is_user_voted_a_abi,
    post_comment_abi,
    vote_answer_abi,
} from "@/abi/social";
import { uploadJSONToPinata } from "@/utils";
import CommentCard from "../comment";
import LoadingModal from "@/components/modals/loader";
import ErrorModal from "@/components/modals/error";
import SuccessModal from "@/components/modals/success";

enum VoteType {
    "Downvote" = -1,
    "Null" = 0,
    "Upvote" = 1,
}

type State = {
    newComment: string;
    commentUrl: string;
    voteType: VoteType;
};

type Actions = {
    changeComment: (newComment: string) => void;
    changeCommentUrl: (commentUrl: string) => void;
    changeVoteType: (voteType: VoteType) => void;
};

const useCountStore = create<State & Actions>((set) => ({
    newComment: "",
    commentUrl: "",
    voteType: VoteType.Null,
    changeComment: (newComment: string) =>
        set((state: State) => ({ ...state, newComment })),
    changeCommentUrl: (commentUrl: string) =>
        set((state: State) => ({ ...state, commentUrl })),
    changeVoteType: (voteType: VoteType) =>
        set((state: State) => ({ ...state, voteType })),
}));

interface Props {
    uri: string;
    voteCount: number;
    comments: any[];
    authorAddress: Address;
    questionAuthor: Address;
    postId: number;
    isBestAnswer: boolean;
    isBestAnswerChosen: boolean;
    refetchAnswers: any;
    refetchQuestion: any;
}

const AnswerContentCard = (props: Props) => {
    const { chain } = useNetwork();
    const { address } = useAccount();

    const [isCommentActive, toggleCommentActive] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successTitle, setSuccessTitle] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loadingTitle, setLoadingTitle] = useState<string>("");
    const [loadingMessage, setLoadingMessage] = useState<string>("");

    const {
        newComment,
        changeComment,
        commentUrl,
        changeCommentUrl,
        voteType,
        changeVoteType,
    } = useCountStore();

    const {
        data: answer,
        isError: isAnswerError,
        isLoading: isAnswerLoading,
        refetch: fetch_answer,
    } = useQuery(
        ["answer-details", props?.postId, props?.uri],
        () => axios.get(props?.uri),
        { enabled: false }
    );

    const answer_details = answer?.data as { answer: string };

    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
        refetch: fetch_user,
    } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: get_user_by_address_abi,
        functionName: "getUserByAddress",
        chainId: chain?.id,
        args: [props?.authorAddress],
        enabled: false,
        onError(error: Error) {
            console.log(error.message);
        },
    });

    const author = user as UserContract;

    const {
        data: profile,
        isError: isProfileError,
        isLoading: isProfileLoading,
        refetch: fetch_metadata,
    } = useQuery(
        ["user-profile", props?.authorAddress],
        () => axios.get(author?.uri),
        { enabled: false }
    );

    const metadata = profile?.data as UserMetadata;

    useEffect(() => {
        fetch_answer();
        fetch_user();
        fetch_is_a_voted();
    }, [fetch_answer, fetch_user]);

    useEffect(() => {
        if (user) {
            fetch_metadata();
        }
    }, [fetch_metadata, user]);

    /**
     * Commenting on this question
     */
    const isCommenting = useRef<boolean>(false);

    const { config: post_comment_config } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: post_comment_abi,
        functionName: "postComment",
        args: [
            1,
            props.postId,
            commentUrl,
            process.env.NEXT_PUBLIC_HASH_SECRET,
        ],
    });

    const { write: post_comment } = useContractWrite({
        ...post_comment_config,
        onError(error) {
            setErrorTitle(error.message);
            setErrorMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        },
        async onSuccess(data) {
            await data.wait();
            setErrorTitle("");
            setErrorMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle("Commented Successfully!");
            setSuccessMessage("");
            changeCommentUrl("");
            toggleCommentActive(false);
            // refetchComments();
            await props.refetchAnswers();
            await setSuccessTitle("");
        },
    });

    if (commentUrl && post_comment && isCommenting.current) {
        console.log(post_comment);
        post_comment?.();
        isCommenting.current = false;
    }

    const onComment = async () => {
        setLoadingTitle("Posting Comment...");
        const data = {
            comment: newComment,
            createdAt: new Date(),
        };

        const url = await uploadJSONToPinata(data);
        changeCommentUrl(url);
        isCommenting.current = true;
    };
    /**
     * Comment related code end here
     */

    // =================================================

    /**
     * Upvote/Downvote question
     */
    const isVoting = useRef<boolean>(false);

    const { config: vote_answer_config } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: vote_answer_abi,
        functionName: "voteAnswer",
        args: [props.postId, voteType, process.env.NEXT_PUBLIC_HASH_SECRET],
        onError(error) {
            console.log(error);
        },
    });

    const { write: vote_answer } = useContractWrite({
        ...vote_answer_config,
        onError(error) {
            setErrorTitle(error.message);
            setErrorMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        },
        async onSuccess(data) {
            await data.wait();
            setErrorTitle("");
            setErrorMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle(
                `${voteType === 1 ? "Upvoted" : "Downvoted"} Successfully!`
            );
            setSuccessMessage("");
            changeVoteType(VoteType.Null);
            await props.refetchAnswers();
            await fetch_is_a_voted();
        },
    });

    if (voteType !== VoteType.Null && vote_answer && isVoting.current) {
        vote_answer?.();
        isVoting.current = false;
    }

    const onVote = async (vote: VoteType) => {
        setLoadingTitle("Voting Answer...");
        changeVoteType(vote);
        isVoting.current = true;
    };
    /**
     * Voting related code end here
     */

    // =================================================

    /**
     * Check if user have voted on this answer
     */
    const { data: isAVoted, refetch: fetch_is_a_voted } = useContractRead({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: is_user_voted_a_abi,
        functionName: "s_userVotedAnswer",
        args: [address, props.postId],
        enabled: false,
    });
    /**
     * User answer vote check end here
     */

    const contract = {
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: get_comment_by_id,
        functionName: "getCommentById",
    };

    const {
        data: comments,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        refetch: refetchComments,
    } = useContractReads({
        contracts: props.comments?.map((comment: BigNumber) => ({
            ...contract,
            args: [comment],
        })) as any,
    });

    let comments_list: Comment[] = comments as Comment[];

    const { config: choose_best_answer_config } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
        abi: choose_best_answer_abi,
        functionName: "chooseBestAnswer",
        args: [props.postId, process.env.NEXT_PUBLIC_HASH_SECRET],
    });

    const { write: choose_best_answer } = useContractWrite({
        ...choose_best_answer_config,
        onError(error) {
            setErrorTitle(error.message);
            setErrorMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle("");
            setSuccessMessage("");
        },
        async onSuccess(data) {
            await data.wait();
            setErrorTitle("");
            setErrorMessage("");
            setLoadingTitle("");
            setLoadingMessage("");
            setSuccessTitle(`Best answer chosen successfully`);
            setSuccessMessage("");
            await props.refetchAnswers();
            await props.refetchQuestion();
        },
    });

    const chooseBestAnswer = () => {
        setLoadingTitle("Choosing as best answer...");
        choose_best_answer?.();
    };

    if (
        isAnswerLoading ||
        isUserLoading ||
        isProfileLoading ||
        isCommentsLoading
    ) {
        return (
            <Wrapper
                postId={props.postId}
                author={props.questionAuthor}
                haveVoted={isAVoted as number}
                vote={onVote}
                content={answer_details?.answer}
                isBestAnswer={props.isBestAnswer}
                isBestAnswerChosen={props.isBestAnswerChosen}
                chooseBestAnswer={chooseBestAnswer}
                voteCount={props.voteCount}>
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

    if (isAnswerError || isUserError || isProfileError || isCommentsError) {
        return (
            <Wrapper
                postId={props.postId}
                author={props.questionAuthor}
                haveVoted={isAVoted as number}
                vote={onVote}
                content={answer_details?.answer}
                isBestAnswer={props.isBestAnswer}
                isBestAnswerChosen={props.isBestAnswerChosen}
                chooseBestAnswer={chooseBestAnswer}
                voteCount={props.voteCount}>
                <div className="text-[20px] text-silver-100">
                    Something went wrong
                </div>
            </Wrapper>
        );
    }

    if (!author || !user) {
        return (
            <Wrapper
                postId={props.postId}
                author={props.questionAuthor}
                haveVoted={isAVoted as number}
                vote={onVote}
                content={answer_details?.answer}
                isBestAnswer={props.isBestAnswer}
                isBestAnswerChosen={props.isBestAnswerChosen}
                chooseBestAnswer={chooseBestAnswer}
                voteCount={props.voteCount}>
                <div className="text-[20px] text-silver-100">
                    No data found regarding author.
                </div>
            </Wrapper>
        );
    }

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
            <Wrapper
                postId={props.postId}
                haveVoted={isAVoted as number}
                vote={onVote}
                content={answer_details?.answer}
                voteCount={props.voteCount}
                author={props.questionAuthor}
                isBestAnswer={props.isBestAnswer}
                chooseBestAnswer={chooseBestAnswer}
                isBestAnswerChosen={props.isBestAnswerChosen}>
                <>
                    <div className="flex items-center justify-between mt-10 w-full">
                        <button
                            onClick={() =>
                                toggleCommentActive(!isCommentActive)
                            }
                            className="border-none py-3 px-5 rounded-md cursor-pointer font-semibold text-dark-blue">
                            {isCommentActive ? "Cancel" : "Add comment"}
                        </button>
                        <AvatarLarge
                            image={metadata?.profile}
                            name={metadata?.name}
                            id={author?.id?.toString()}
                            address={author?.userAddress as string}
                        />
                    </div>
                    {isCommentActive && (
                        <div>
                            <textarea
                                onChange={(event) =>
                                    changeComment(event.target.value)
                                }
                                placeholder="Enter your comment"
                                rows={4}
                                className="mt-8 block w-full border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm bg-gray-50 border rounded-md text-gray-900 text-sm focus:border-blue dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue resize-y"></textarea>
                            <div className="w-full flex justify-end gap-x-4 mt-4">
                                <button
                                    onClick={() => toggleCommentActive(false)}
                                    className="border-none py-3 px-5 rounded-md cursor-pointer font-semibold bg-white text-dark-blue">
                                    Cancel
                                </button>
                                <button
                                    onClick={onComment}
                                    className="border-none py-3 px-5 rounded-md cursor-pointer font-semibold bg-blue text-white">
                                    Comment
                                </button>
                            </div>
                        </div>
                    )}
                    {comments &&
                        comments.length > 0 &&
                        comments_list.length > 0 && (
                            <div className="mt-8">
                                <h2 className="m-0 mb-4 text-white text-lg">
                                    Comments
                                </h2>
                                <div className="flex flex-col gap-y-3">
                                    {comments_list.map((comment: Comment) => (
                                        <CommentCard
                                            key={comment?.id?.toNumber()}
                                            {...comment}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                </>
            </Wrapper>
        </>
    );
};

export default AnswerContentCard;

const Wrapper = ({
    content,
    voteCount,
    children,
    vote,
    haveVoted,
    author,
    isBestAnswerChosen,
    isBestAnswer,
    chooseBestAnswer,
    postId,
}: {
    children: JSX.Element;
    content: string;
    voteCount: number;
    vote: (vote: VoteType) => void;
    chooseBestAnswer: (() => void) | undefined;
    haveVoted: number;
    author: Address;
    isBestAnswerChosen: boolean;
    isBestAnswer: boolean;
    postId: number;
}) => {
    const { address } = useAccount();

    return (
        <div
            id={postId.toString()}
            className="rounded-xl bg-gray-500 px-4 py-6 xl:p-8 flex flex-row items-start gap-x-4 w-full overflow-x-scroll">
            <div className="flex flex-col items-center gap-y-2 justify-center text-silver-100">
                {haveVoted === 1 ? (
                    <button className="border-none bg-transparent w-[max-content] h-[max-content] flex m-0 p-0 text-blue">
                        <svg
                            width="32"
                            height="19"
                            viewBox="0 0 32 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M31.71 16.5545L31.53 16.3465L17.93 0.851486C17.47 0.326735 16.78 0 16.01 0C15.24 0 14.55 0.336636 14.09 0.851486L0.5 16.3168L0.27 16.5743C0.1 16.8218 0 17.1188 0 17.4356C0 18.297 0.74 19 1.66 19L30.34 19C31.26 19 32 18.297 32 17.4356C32 17.1089 31.89 16.802 31.71 16.5545Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                ) : (
                    <button
                        disabled={haveVoted === -1}
                        onClick={() => vote(VoteType.Upvote)}
                        className="border-none bg-transparent w-[max-content] h-[max-content] flex m-0 p-0 cursor-pointer text-silver-100 hover:text-blue">
                        <svg
                            width="32"
                            height="19"
                            viewBox="0 0 32 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M31.71 16.5545L31.53 16.3465L17.93 0.851486C17.47 0.326735 16.78 0 16.01 0C15.24 0 14.55 0.336636 14.09 0.851486L0.5 16.3168L0.27 16.5743C0.1 16.8218 0 17.1188 0 17.4356C0 18.297 0.74 19 1.66 19L30.34 19C31.26 19 32 18.297 32 17.4356C32 17.1089 31.89 16.802 31.71 16.5545Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                )}
                <div className="relative font-medium">{voteCount}</div>
                {haveVoted === -1 ? (
                    <button className="border-none bg-transparent w-[max-content] h-[max-content] flex m-0 p-0 text-blue">
                        <svg
                            width="32"
                            height="19"
                            viewBox="0 0 32 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.29 2.44554L0.47 2.65347L14.07 18.1485C14.53 18.6733 15.22 19 15.99 19C16.76 19 17.45 18.6634 17.91 18.1485L31.5 2.68317L31.73 2.42574C31.9 2.17822 32 1.88119 32 1.56436C32 0.702971 31.26 0 30.34 0H1.66C0.74 0 0 0.702971 0 1.56436C0 1.89109 0.11 2.19802 0.29 2.44554Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                ) : (
                    <button
                        disabled={haveVoted === 1}
                        onClick={() => vote(VoteType.Downvote)}
                        className="border-none bg-transparent w-[max-content] h-[max-content] flex m-0 p-0 cursor-pointer text-silver-100 hover:text-blue">
                        <svg
                            width="32"
                            height="19"
                            viewBox="0 0 32 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.29 2.44554L0.47 2.65347L14.07 18.1485C14.53 18.6733 15.22 19 15.99 19C16.76 19 17.45 18.6634 17.91 18.1485L31.5 2.68317L31.73 2.42574C31.9 2.17822 32 1.88119 32 1.56436C32 0.702971 31.26 0 30.34 0H1.66C0.74 0 0 0.702971 0 1.56436C0 1.89109 0.11 2.19802 0.29 2.44554Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                )}
                {isBestAnswerChosen ? (
                    isBestAnswer ? (
                        <button className="border-none bg-transparent w-[max-content] h-[max-content] flex m-0 p-0 text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="green"
                                className="w-8 h-8">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                                />
                            </svg>
                        </button>
                    ) : null
                ) : author === address ? (
                    <button
                        onClick={() => chooseBestAnswer?.()}
                        className="border-none bg-transparent w-[max-content] h-[max-content] flex m-0 p-0 cursor-pointer text-silver-100 hover:text-white">
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
                                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                            />
                        </svg>
                    </button>
                ) : null}
            </div>
            <div className="w-full">
                <div>
                    <MarkdownRenderer markdown={content} />
                </div>
                {children}
            </div>
        </div>
    );
};
