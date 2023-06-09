/* eslint-disable @next/next/no-img-element */

import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "wagmi";

interface Props {
    id: number;
    locked?: boolean;
}

const BadgeCard = (props: Props) => {
    const { id, locked } = props;

    const { data, isLoading, isError } = useQuery(["get-badge", id], () =>
        axios.get(
            `https://hackathon.mypinata.cloud/ipfs/QmPLtEYjGY7LfkWTi6CiWspK5MRY5cnQb2t3cimyqAVHHp/${id}.json`
        )
    );

    if (isLoading) {
        return <Skeleton width={300} height={300} />;
    }

    if (isError) {
        return <div>Error</div>;
    }

    if (data?.status !== 200) return <div>Error</div>;

    return (
        <div
            className="relative p-2 bg-blue bg-gradient-to-t from-blue-500 to-[#011163] rounded-xl mb-2"
            style={{
                background: "linear-gradient(180deg, #0328EE 0%, #011163 100%)",
            }}>
            <div className="flex flex-col items-center justify-center max-h-[331px] max-w-[270px]  lg:max-h-[361px] lg:max-w-[298px] rounded-xl">
                <div className="flex w-[300px] max-h-[230px] lg:max-h-[260px] lg:w-auto object-cover rounded-tr-xl rounded-tl-xl items-center">
                    <img
                        src={data?.data?.image}
                        alt="NFT Image"
                        className="mx-auto rounded-tr-xl rounded-tl-xl object-cover w-[270px] max-h-[225px] lg:max-h-[260px] lg:w-[270px]"
                    />
                </div>
                <div className="flex flex-col items-center justify-center p-[19px] w-full bg-[#030C30] rounded-br-xl rounded-bl-xl max-w-[270px] lg:max-w-[298px]">
                    <div className="flex flex-col items-center justify-center w-full max-w-[261px] max-h-[68px] rounded-[8px] p-2 bg-[#171F41] border-2 border-white">
                        <div className="flex text-center items-center text-base text-white font-normal">
                            {data?.data?.title}
                        </div>
                        <div className="flex text-center items-center text-[10px] text-white font-medium">
                            {data?.data?.description}
                        </div>
                    </div>
                </div>
            </div>
            {locked && (
                <div className="absolute inset-0 w-full h-full bg-[#0000008c] rounded-xl flex justify-center items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default BadgeCard;
