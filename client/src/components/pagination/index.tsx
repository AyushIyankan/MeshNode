/* eslint-disable @next/next/no-img-element */
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { PaginationProps } from '@/types/pagination';

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) => {
  return (
    <div className='mt-8 overflow-hidden flex flex-row items-center justify-start gap-[1rem] text-[1.13rem] text-white font-desktop-body-2'>
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className='cursor-pointer border-none relative inline-flex items-center rounded-full px-2 py-2 text-white ring-1 ring-inset ring-gray-300 bg-midnightblue'>
        <span className='sr-only'>Previous</span>
        <ChevronLeftIcon className='h-7 w-7' aria-hidden='true' />
      </button>

      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`border-none cursor-pointer bg-transparent self-stretch flex flex-col py-[0.25rem] px-[0.5rem] items-center justify-center text-white`}>
          <div
            className={`relative leading-[2rem] ${
              currentPage === i + 1
                ? 'border-b border-solid border-t-0 border-l-0 border-r-0 border-b-white'
                : 'border-none'
            }`}>
            {i + 1}
          </div>
        </button>
      ))}

      <button
        disabled={totalPages === currentPage}
        onClick={() => setCurrentPage(currentPage + 1)}
        className='cursor-pointer border-none relative inline-flex items-center rounded-full px-2 py-2 text-white ring-1 ring-inset ring-gray-300 bg-midnightblue'>
        <span className='sr-only'>Previous</span>
        <ChevronRightIcon className='h-7 w-7' aria-hidden='true' />
      </button>
    </div>
  );
};

export default Pagination;
