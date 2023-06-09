"use client";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <div>
        <div
          className="flex flex-col items-center justify-center bg-darkblue w-full h-[58.25rem] overflow-hidden text-center text-[11.25rem] text-white font-desktop-body-2"
          // style={{ backgroundImage: 'url("/group.svg")' }}
        >
          <b className="flex leading-[10rem] text-blue">404</b>
          <b className="flex text-[2.63rem] tracking-[-0.42px] leading-[3.44rem] mt-4">
            Page Not Found
          </b>
          <div className="flex text-[1.13rem] leading-[2rem] flex items-center justify-center w-[34.81rem] mt-4">
            {`The page you're looking for can't be found. Double-check the URL and
          try again. Or click the button below.`}
          </div>
          <Link href={"/"} className="text-white no-underline">
            <div className="flex w-auto mt-9 h-[4.38rem] text-[1rem]">
              <div className="rounded-61xl bg-blue flex flex-row py-[1.69rem] px-[2rem] items-center justify-center">
                <b className="tracking-[1.6px] leading-[1rem] uppercase">
                  Go Home
                </b>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
