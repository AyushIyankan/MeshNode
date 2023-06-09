import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

const NFTCard = ({ isFetching }: { isFetching: boolean }) => {
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
            className="p-2 bg-blue bg-gradient-to-t from-blue-500 to-[#011163] rounded-xl mb-2"
            style={{
                background: "linear-gradient(180deg, #0328EE 0%, #011163 100%)",
            }}>
            <div className="flex flex-col items-center justify-center max-h-[331px] max-w-[270px]  lg:max-h-[361px] lg:max-w-[298px] rounded-xl">
                <div className="flex w-[300px] max-h-[230px] lg:max-h-[260px] lg:w-auto object-cover rounded-tr-xl rounded-tl-xl items-center">
                    <img
                        src="nft-sample.png"
                        alt="NFT Image"
                        className="mx-auto rounded-tr-xl rounded-tl-xl object-cover w-[267px] max-h-[225px] lg:max-h-[260px] lg:w-auto"
                    />
                </div>
                <div className="flex flex-col items-center justify-center p-[19px] w-full bg-[#030C30] rounded-br-xl rounded-bl-xl">
                    <div className="flex flex-col items-center justify-center w-full max-w-[261px] max-h-[68px] rounded-[8px] p-2 bg-[#171F41] border-2 border-white">
                        <div className="flex text-center items-center text-base text-white font-normal">
                            Answer 10 questions
                        </div>
                        <div className="flex text-center items-center text-xl text-white font-medium">
                            Javascript
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTCard;
