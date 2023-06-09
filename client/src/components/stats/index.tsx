import Questions from './questions';
import Answers from './answers';
import { BigNumber } from 'ethers';

interface Props {
  aUpvotes: BigNumber;
  answers: BigNumber[];
  bestAnswerCount: BigNumber;
  comments: BigNumber[];
  id: BigNumber;
  qUpvotes: BigNumber;
  questions: BigNumber[];
}

const Stats = (props: Props) => {
  const {
    id,
    qUpvotes,
    questions,
    aUpvotes,
    answers,
    comments,
    bestAnswerCount,
  } = props;

  return (
    <div className='bg-gray-100 rounded-xl p-6 lg:p-10 text-white'>
      <div className='mb-12'>
        <h2 className='m-0 mb-6 text-[28px]'>Details</h2>

        <div className='flex flex-wrap gap-x-8 gap-y-3'>
          <div className='flex gap-x-2 bg-darkblue py-2 px-4 rounded-md text-sm'>
            <div className='text-silver-100'>Total Question Upvoted:</div>
            <div>{qUpvotes?.toString()}</div>
          </div>
          <div className='flex gap-x-2 bg-darkblue py-2 px-4 rounded-md text-sm'>
            <div className='text-silver-100'>Total Answer Upvoted:</div>
            <div>{aUpvotes?.toString()}</div>
          </div>
          <div className='flex gap-x-2 bg-darkblue py-2 px-4 rounded-md text-sm'>
            <div className='text-silver-100'>Total Comments:</div>
            <div>{comments?.length}</div>
          </div>
          <div className='flex gap-x-2 bg-darkblue py-2 px-4 rounded-md text-sm'>
            <div className='text-silver-100'>Total Best Answer Chosen:</div>
            <div>{bestAnswerCount?.toString()}</div>
          </div>
        </div>
      </div>
      <div className='mb-12'>
        <Questions data={questions} />
      </div>
      <div className=''>
        <Answers data={answers} />
      </div>
    </div>
  );
};

export default Stats;
