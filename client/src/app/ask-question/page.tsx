/* eslint-disable react/no-children-prop */
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { create } from 'zustand';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useQuery,
} from 'wagmi';

import './editor.css';

import { uploadFileToPinata, uploadJSONToPinata } from '@/utils';
import { post_question_abi } from '@/abi/social';
import { Address, UserContract, UserMetadata } from '@/types';
import LoadingModal from '@/components/modals/loader';
import ErrorModal from '@/components/modals/error';
import SuccessModal from '@/components/modals/success';
import { get_user_by_address_abi } from '@/abi/user';
import TagInput from '@/components/tagInput';
import { TAGS } from '@/constants/wallets';

enum TagsEnum {
  'Javascript',
  'Python',
  'Java',
  'PHP',
  'Android',
  'HTML',
  'jQuery',
  'C++',
  'CSS',
  'Web3.js',
  'Remix',
  'Blockchain',
  'Smart Contract',
  'Hardhat',
  'Truffle',
  'ERC',
  'Ethereum',
  'Metamask',
}

type State = {
  title: string;
  question: string;
  solution: string;
  tags: number[];
  url: string;
};

type Actions = {
  changeTitle: (title: string) => void;
  changeQuestion: (question: string) => void;
  changeSolution: (solution: string) => void;
  changeTags: (tags: number[]) => void;
  changeUrl: (url: string) => void;
};

const useCountStore = create<State & Actions>((set) => ({
  title: '',
  question: '',
  solution: '',
  tags: [],
  url: '',
  changeTitle: (title: string) => set((state: State) => ({ ...state, title })),
  changeQuestion: (question: string) =>
    set((state: State) => ({ ...state, question })),
  changeSolution: (solution: string) =>
    set((state: State) => ({ ...state, solution })),
  changeTags: (tags: number[]) => set((state: State) => ({ ...state, tags })),
  changeUrl: (url: string) => set((state: State) => ({ ...state, url })),
}));

const AskQuestion = () => {
  const {
    title,
    question,
    solution,
    tags,
    url,
    // functions
    changeTitle,
    changeQuestion,
    changeSolution,
    changeTags,
    changeUrl,
  } = useCountStore((state) => state);

  const { address, isConnected, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();

  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successTitle, setSuccessTitle] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loadingTitle, setLoadingTitle] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const checkIfSubmitting = useRef<boolean>(false);

  const { config: post_question_config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
    abi: post_question_abi,
    functionName: 'postQuestion',
    args: [tags.reverse(), url, process.env.NEXT_PUBLIC_HASH_SECRET],
  });

  const {
    data: user_data,
    isLoading: isUserLoading,
    isError: isUserError,
    isFetching: isUserFetching,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
    abi: get_user_by_address_abi,
    functionName: 'getUserByAddress',
    chainId: chain?.id,
    args: [address],
    onError(error: Error) {
      console.log(error.message);
    },
  });

  const profile_contract = user_data as UserContract;

  const {
    data: profile,
    isError: isProfileError,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useQuery(['user-profile', address], () =>
    axios.get(profile_contract?.uri)
  );

  const user = profile?.data as UserMetadata;

  const { write: post_question, isLoading: isQuestionPosting } =
    useContractWrite({
      ...post_question_config,
      onError(error) {
        setErrorTitle(error.message);
        setErrorMessage('');
        setLoadingTitle('');
        setLoadingMessage('');
        setSuccessTitle('');
        setSuccessMessage('');
      },
      async onSuccess(data) {
        await data.wait();
        setErrorTitle('');
        setErrorMessage('');
        setLoadingTitle('');
        setLoadingMessage('');
        setSuccessTitle('Question Posted Successfully!');
        setSuccessMessage('');
        setTimeout(() => {
          router.push('/questions');
        }, 2000);
        changeUrl('');
      },
    });

  if (url && post_question && checkIfSubmitting.current) {
    post_question?.();
    checkIfSubmitting.current = false;
  }

  const handleQuestionChange = ({ _, text }: any) => {
    changeQuestion(text);
  };

  const handleSolutionChange = ({ html }: any) => {
    changeSolution(html);
  };

  const handleImageUpload = async (file: File, callback: any) => {
    const url: string = await uploadFileToPinata(file);
    callback(url);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setErrorTitle('');
      setErrorMessage('');
      setLoadingTitle('Posting question...');
      setLoadingMessage('');
      setSuccessTitle('');
      setSuccessMessage('');

      const metadata = {
        title,
        question,
        solution,
        tags,
        createdAt: new Date(),
      };

      const tags_object: any = {};

      tags.forEach((tag) => {
        tags_object[TAGS[tag]] = TAGS[tag];
      });

      const temp_url = await uploadJSONToPinata(metadata, {
        name: title,
        keyvalues: tags_object,
      });

      changeUrl(temp_url);
      checkIfSubmitting.current = true;
    } catch (error: any) {
      setErrorTitle(error.message);
      setErrorMessage('');
      setLoadingTitle('');
      setLoadingMessage('');
      setSuccessTitle('');
      setSuccessMessage('');
    }
  };

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
          errorButtonRightText='Close'
        />
      )}
      {successTitle && (
        <SuccessModal
          successTitle={successTitle}
          successMessage={successMessage}
          needSuccessButtonRight={true}
          successButtonRightText='Done'
        />
      )}
      <div className='bg-darkblue py-14 px-2 md:px-20 xl:px-36'>
        <form
          onSubmit={onSubmit}
          className='bg-gray-100 py-11 px-4 md:px-9 rounded-3xl'>
          <h1 className='text-bold text-[32px] leading-10 text-white m-0 mb-10'>
            Ask a Question
          </h1>

          <div className='flex flex-col mb-8'>
            <label
              htmlFor='title'
              className='text-white text-base leading-5 block mb-[14px]'>
              Title*{' '}
              <span className='text-gray-200'>(Must be relevant to topic)</span>
            </label>
            <input
              type='text'
              id='title'
              name='title'
              required
              aria-required
              placeholder='Enter your question title in a single statement'
              className='block bg-gray-500 rounded-sm px-6 py-4 text-lg text-white'
              onChange={(event) => changeTitle(event.target.value)}
            />
          </div>

          <div className='h-[max-content] mb-8'>
            <label
              htmlFor='details'
              className='text-white text-base leading-5 block mb-[14px]'>
              Details of your problem*{' '}
              <span className='text-gray-200'>
                (Please explain clearly, Use Markdown Syntax in the following
                editor)
              </span>
            </label>
            <MdEditor
              id='details'
              name='details'
              aria-required
              className='h-[300px] border-none bg-darkblue rounded-sm'
              shortcuts={true}
              renderHTML={renderHTML}
              onChange={handleQuestionChange}
              onImageUpload={handleImageUpload}
            />
          </div>

          <div className='h-[max-content] mb-8'>
            <label
              htmlFor='solutions'
              className='text-white text-base leading-5 block mb-[14px]'>
              Any solutions which you may have encountered with{' '}
              <span className='text-gray-200'>
                (Optional, Use Markdown Syntax in the following editor)
              </span>
            </label>
            <MdEditor
              id='solutions'
              name='solutions'
              aria-required
              className='h-[300px] border-none bg-darkblue rounded-sm'
              shortcuts={true}
              renderHTML={renderHTML}
              onChange={handleSolutionChange}
              onImageUpload={handleImageUpload}
            />
          </div>

          <div className='flex flex-col mb-8'>
            <label
              htmlFor='tags'
              className='text-white text-md leading-5 block mb-[14px]'>
              Please choose question tags*{' '}
              <span className='text-gray-200'>
                (Type your tags and hit Enter,{' '}
                {tags.length < 10 ? (
                  <span className='text-yellow-400'>
                    {10 - tags.length + ' remaining'}
                  </span>
                ) : (
                  <span className='text-yellow-400'>Max limit reached</span>
                )}
                )
              </span>
            </label>
            <TagInput
              onTagsChange={(tags: number[]) => {
                changeTags(tags);
              }}
              max={10}
            />
          </div>

          <div className='mb-8'>
            <h2 className='text-white'>Community Guidlinies</h2>
            <ul className='text-silver-200'>
              <li>
                Be respectful and considerate: Treat others with respect and
                kindness, even if you disagree with their views or opinions.
              </li>

              <li>
                Stay on topic: Make sure your questions and answers are relevant
                to the platform and specific to the topic you&#39;re discussing.
              </li>

              <li>
                Use clear and concise language: Use clear and easy-to-understand
                language when asking or answering questions.
              </li>

              <li>
                Provide helpful and informative answers: When answering
                questions, make sure your response is helpful and provides
                useful information to the person asking the question.
              </li>

              <li>
                Avoid spamming or self-promotion: Do not use the platform to
                promote yourself or your own products/services.
              </li>

              <li>
                Keep it professional: Avoid using inappropriate language, jokes
                or comments that could be deemed offensive or unprofessional.
              </li>

              <li>
                Follow community rules and policies: Make sure to read and
                follow the platform&#39;s rules and policies, as well as any
                specific guidelines for individual communities or topics.
              </li>
            </ul>
          </div>

          <button
            type='submit'
            disabled={title === '' || question === '' || tags.length === 0}
            className='w-full min-[400px]:w-max cursor-pointer outline-none [border:none] py-[20px] px-[32px] bg-blue rounded-61xl flex flex-row box-border items-center justify-center'>
            <b className='text-[16px] outline-none tracking-[1.6px] leading-[16px] uppercase text-white text-center font-bold'>
              Post Question
            </b>
          </button>
        </form>
      </div>
    </>
  );
};

export default AskQuestion;

function renderHTML(text: string) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={materialOceanic}
              language={match[1]}
              PreTag='div'
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
        h1: (props: any) => <h1 className='m-0 text-white' {...props} />,
        h2: (props: any) => <h2 className='m-0 text-white' {...props} />,
        h3: (props: any) => <h3 className='m-0 text-white' {...props} />,
        h4: (props: any) => <h4 className='m-0 text-white' {...props} />,
        h5: (props: any) => <h5 className='m-0 text-white' {...props} />,
        h6: (props: any) => <h6 className='m-0 text-white' {...props} />,
        p: (props: any) => <p className='m-0 text-white' {...props} />,
        ul: (props: any) => <ul className='m-0 text-white' {...props} />,
        ol: (props: any) => <ol className='m-0 text-white' {...props} />,
        td: (props: any) => <td className='m-0 text-white' {...props} />,
      }}>
      {text}
    </ReactMarkdown>
  );
}
