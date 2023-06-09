/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-midnightblue flex flex-col pt-[56px] px-6 md:px-14 xl:px-[133px] pb-[32px] box-border items-start justify-start">
            <div className="w-full flex flex-col min-[600px]:flex-row gap-y-10 xl:flex-row items-center justify-between mb-[92px]">
                <Link
                    href="/"
                    className="flex flex-row gap-[12px] no-underline">
                    <img
                        className="w-8 xl:w-10"
                        alt="w-8"
                        src="/logo_icon.svg"
                    />
                    <div className="text-white xl:text-lg">MeshNode</div>
                </Link>
                {/* <div className="flex flex-row items-center justify-end gap-[12px]">
                    <img
                        className="rounded-981xl w-[36px] h-[36px]"
                        alt=""
                        src="/insta.svg"
                    />
                    <img
                        className="rounded-981xl w-[36px] h-[36px]"
                        alt=""
                        src="/facebook.svg"
                    />
                    <img
                        className="rounded-981xl w-[36px] h-[36px]"
                        alt=""
                        src="/linked-in.svg"
                    />
                </div> */}
            </div>
            <div className="w-full flex flex-col min-[600px]:flex-row justify-between items-start mb-12 border-b-[1px] border-white">
                <div className="w-full flex flex-col items-start justify-start gap-y-[35px] mb-10">
                    <h2 className="w-full tracking-[0.9px] text-lg leading-[26px] uppercase text-white border-b-2 border-white m-0 flex flex-col justify-center items-center min-[600px]:items-start">
                        <span className="mb-6">Menu</span>
                        <div className="w-[80px] min-[600px]:w-[200px] h-[2px] bg-white" />
                    </h2>
                    <div className="w-full flex flex-row items-start justify-center min-[600px]:justify-start gap-x-[44px] text-sm leading-[16px]">
                        <div className="flex flex-col py-[0rem] px-[0.06rem] items-start justify-start gap-[1.13rem]">
                            <Link
                                href="/questions"
                                className="text-white no-underline">
                                Questions
                            </Link>
                            <Link
                                href="/tags"
                                className="text-white no-underline">
                                Tags
                            </Link>
                            <Link
                                href="/about"
                                className="text-white no-underline">
                                About Us
                            </Link>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-[1.13rem]">
                            <Link
                                href="/connect-wallet"
                                className="text-white no-underline">
                                Connect Wallet
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className="rounded-21xl bg-gray-300 overflow-hidden flex flex-col py-[44px] px-[34px] box-border items-start justify-start">
                    <h2 className="tracking-[0.9px] text-lg leading-[25px] uppercase m-0 mb-[12px] text-white">
                        having questions?
                    </h2>
                    <p className="leading-[32px] text-lg flex items-center m-0 mb-[24px] text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris sed nulla integer
                    </p>
                    <div className="w-full rounded-11xl bg-darkblue xl:bg-gray-100 text-white py-[0px] px-[24px] box-border flex gap-2 items-center justify-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-white">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                        <input
                            className="placeholder-silver-100 border-none bg-transparent outline-none block w-full h-full py-[12px] text-white text-lg"
                            type="search"
                            placeholder="Search"
                        />
                    </div>
                </div> */}
                {/* <div className="rounded-21xl bg-gray-300 overflow-hidden flex flex-col py-[44px] px-[34px] box-border items-start justify-start">
                    <h2 className="tracking-[0.9px] text-lg leading-[25px] uppercase m-0 mb-[12px] text-white">
                        having questions?
                    </h2>
                    <p className="leading-[32px] text-lg flex items-center m-0 mb-[24px] text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris sed nulla integer
                    </p>
                    <div className="w-full rounded-11xl bg-darkblue xl:bg-gray-100 text-white py-[0px] px-[24px] box-border flex gap-2 items-center justify-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-white">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                        <input
                            className="placeholder-silver-100 border-none bg-transparent outline-none block w-full h-full py-[12px] text-white text-lg"
                            type="search"
                            placeholder="Search"
                        />
                    </div>
                </div> */}
            </div>
            <div className="w-full text-[16px] leading-[26px] text-center xl:text-left text-white">
                <div className="w-full h-[1px] bg-gray-200 mb-6" />
                All rights reserved
            </div>
        </footer>
    );
};

export default Footer;
