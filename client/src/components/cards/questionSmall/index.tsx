import Link from 'next/link';

interface Props {
  question: string;
  voteCount: number;
}

const QuestionCardSmall = (props: Props) => {
  const { question, voteCount } = props;

  return (
    <Link
      href='/question'
      className='cursor-pointer [border:none] py-[8px] px-3.5 bg-gray-500 rounded-xl w-full gap-x-2 flex flex-row box-border items-center justify-start text-white no-underline'>
      <div className='text-3xs px-2 py-1 rounded-smi-5 bg-darkslateblue'>
        {voteCount}
      </div>
      <p className='text-xs leading-4'>{question}</p>
    </Link>
  );
};

export default QuestionCardSmall;
