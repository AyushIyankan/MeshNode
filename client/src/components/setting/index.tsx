/* eslint-disable @next/next/no-img-element */
'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import Skeleton from 'react-loading-skeleton';
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import 'react-loading-skeleton/dist/skeleton.css';

import { get_user_by_address_abi, set_user_uri_abi } from '@/abi/user';
import {
  getPreviewImage,
  uploadFileToPinata,
  uploadJSONToPinata,
} from '@/utils';
import ErrorModal from '../modals/error';
import SuccessModal from '../modals/success';
import LoadingModal from '../modals/loader';

type State = {
  profile: string | null;
  profileFile: File | null;
  banner: string | null;
  bannerFile: File | null;
  personalWebsite: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  name: string | null;
  email: string | null;
  bio: string | null;
  url: string | null;
};

type Actions = {
  changeProfile: (profile: string | null) => void;
  changeProfileFile: (profileFile: File | null) => void;
  changeBanner: (banner: string | null) => void;
  changeBannerFile: (bannerFile: File | null) => void;
  changePersonalWebsite: (personalWebsite: string | null) => void;
  changeLinkedin: (linkedin: string | null) => void;
  changeGithub: (github: string | null) => void;
  changeTwitter: (twitter: string | null) => void;
  changeName: (name: string) => void;
  changeEmail: (email: string) => void;
  changeBio: (bio: string) => void;
  changeUrl: (url: string) => void;
};

const useSettingStore = create<State & Actions>((set) => ({
  profile: '',
  profileFile: null,
  banner: '',
  bannerFile: null,
  personalWebsite: '',
  linkedin: '',
  github: '',
  twitter: '',
  name: '',
  email: '',
  bio: '',
  url: '',
  changeProfile: (profile: string | null) =>
    set((state: State) => ({ ...state, profile })),
  changeProfileFile: (profileFile: File | null) =>
    set((state: State) => ({ ...state, profileFile })),
  changeBanner: (banner: string | null) =>
    set((state: State) => ({ ...state, banner })),
  changeBannerFile: (bannerFile: File | null) =>
    set((state: State) => ({ ...state, bannerFile })),
  changePersonalWebsite: (personalWebsite: string | null) =>
    set((state: State) => ({ ...state, personalWebsite })),
  changeLinkedin: (linkedin: string | null) =>
    set((state: State) => ({ ...state, linkedin })),
  changeGithub: (github: string | null) =>
    set((state: State) => ({ ...state, github })),
  changeTwitter: (twitter: string | null) =>
    set((state: State) => ({ ...state, twitter })),
  changeName: (name: string) => set((state: State) => ({ ...state, name })),
  changeEmail: (email: string) => set((state: State) => ({ ...state, email })),
  changeBio: (bio: string) => set((state: State) => ({ ...state, bio })),
  changeUrl: (url: string) => set((state: State) => ({ ...state, url })),
}));

const Setting = ({ refetchUser }: { refetchUser: () => void }) => {
  const {
    profile,
    profileFile,
    banner,
    bannerFile,
    personalWebsite,
    linkedin,
    github,
    twitter,
    name,
    email,
    bio,
    url,
    // functions
    changeProfile,
    changeProfileFile,
    changeBanner,
    changeBannerFile,
    changePersonalWebsite,
    changeLinkedin,
    changeGithub,
    changeTwitter,
    changeName,
    changeEmail,
    changeBio,
    changeUrl,
  } = useSettingStore((state) => state);

  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successTitle, setSuccessTitle] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loadingTitle, setLoadingTitle] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const router = useRouter();
  const checkIfUrlGenerated = useRef<boolean>(false);

  /**
   * @get hooks from wagmi
   */
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  /**
   * @config to write set user uri with form data
   */
  const { config: set_user_uri_config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
    abi: set_user_uri_abi,
    functionName: 'setUserURI',
    chainId: chain?.id,
    args: [url, process.env.NEXT_PUBLIC_HASH_SECRET],
    onError: (error: any) => {
      console.log(error);
      setErrorTitle(error.message);
    },
  });

  const { write: set_user_uri } = useContractWrite({
    ...set_user_uri_config,
    onError(error: Error) {
      console.log(error);
      setLoadingTitle('');
      setLoadingMessage('');
      setSuccessTitle('');
      setSuccessMessage('');
      setErrorTitle(error.message);
    },
    async onSuccess(data) {
      await data.wait();
      setLoadingTitle('');
      setLoadingMessage('');
      setErrorTitle('');
      setErrorMessage('');
      setSuccessTitle('Profile updated successfully');
      refetchUser();
      console.log(data);
    },
  });

  /**
   * @config to read user data with address
   */
  const { data, isFetching, refetch } = useContractRead({
    address: process.env.NEXT_PUBLIC_STACK3_ADDRESS as Address,
    abi: get_user_by_address_abi,
    functionName: 'getUserByAddress',
    chainId: chain?.id,
    args: [address],
    onError(error: Error) {
      console.log(error.message);
      setLoadingTitle('');
      setLoadingMessage('');
      setSuccessTitle('');
      setSuccessMessage('');
      setErrorTitle(error.message);
    },
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/connect-wallet');
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (data) {
      const fetchUserJSON = async () => {
        await axios
          .get(data?.uri)
          .then(async (response) => {
            if (!response?.data) {
              throw new Error('User not registered');
            }

            const {
              banner: banner_res,
              bio: bio_res,
              personalWebsite: personalWebsite_res,
              linkedin: linkedin_res,
              github: github_res,
              twitter: twitter_res,
              email: email_res,
              name: name_res,
              profile: profile_res,
            } = response?.data;

            changeProfile(profile_res);
            changeBanner(banner_res);
            changePersonalWebsite(personalWebsite_res);
            changeLinkedin(linkedin_res);
            changeGithub(github_res);
            changeTwitter(twitter_res);
            changeName(name_res);
            changeEmail(email_res);
            changeBio(bio_res);
          })
          .catch(async (error) => {
            if (error.message === 'User not registered') {
              setErrorTitle('User not registered');
              router.push('/register');
              console.log(error.message);
            }
          });
      };

      fetchUserJSON();
    }
  }, [data]);

  if (url && set_user_uri && checkIfUrlGenerated.current) {
    set_user_uri?.();
    checkIfUrlGenerated.current = false;
  }

  /**
   * @section to handle profile details update
   * @param event
   */
  const onSubmitProfile = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setErrorTitle('');
      setErrorMessage('');
      setLoadingTitle('Profile details are updating..');
      setLoadingMessage('Please wait for a few minutes');

      const updated_user = {
        profile,
        banner,
        personalWebsite,
        linkedin,
        github,
        twitter,
        name,
        email,
        bio,
      };

      const updated_url = await uploadJSONToPinata(updated_user, {
        name: name,
      });
      changeUrl(updated_url);
      checkIfUrlGenerated.current = true;
    } catch (error: any) {
      console.log(error);
      setSuccessTitle('');
      setSuccessMessage('');
      setLoadingTitle('');
      setLoadingMessage('');
      setErrorTitle(error.message as any);
    }
  };

  const handleProfileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        changeProfileFile(file as File);
        const profile_url = await uploadFileToPinata(file);
        changeProfile(profile_url);
      }
    } catch (error) {}
  };

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        changeBannerFile(file as File);
        const banner_url = await uploadFileToPinata(file);
        changeBanner(banner_url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return isFetching ? (
    <div className='bg-gray-100 rounded-xl p-6 lg:p-10 text-white'>
      <div className='mb-12'>
        <h2 className='m-0 mb-6 text-[28px]'>
          <Skeleton
            baseColor='#22294d'
            highlightColor='#313a67'
            height='42px'
            width='370px'
          />
        </h2>
        <>
          <div>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              <div className='md:col-span-1'>
                <div className='px-4 sm:px-0'>
                  <h3 className='text-lg font-medium leading-6 text-white'>
                    <Skeleton
                      baseColor='#22294d'
                      highlightColor='#313a67'
                      width={60}
                    />
                  </h3>
                  <p className='mt-[-0.85rem] text-sm text-[#9CA3AF]'>
                    <Skeleton
                      baseColor='#22294d'
                      highlightColor='#313a67'
                      // width={60}
                      count={3}
                    />
                  </p>
                </div>
              </div>
              <div className='mt-5 md:col-span-2 md:mt-0'>
                <form>
                  <div className='shadow sm:overflow-hidden sm:rounded-md'>
                    <div className='space-y-6 bg-gray-500 px-4 py-5 sm:p-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-50'>
                          <Skeleton
                            baseColor='#22294d'
                            highlightColor='#313a67'
                            width={90}
                          />
                        </label>
                        <div
                          className={`mt-1 justify-center rounded-md border-[#6B7280]`}>
                          <Skeleton
                            baseColor='#22294d'
                            highlightColor='#313a67'
                            height={170}
                          />
                          <div className='space-y-1 text-center'></div>
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-50'>
                          <Skeleton
                            baseColor='#22294d'
                            highlightColor='#313a67'
                            width={90}
                          />
                        </label>
                        <div
                          className={`mt-1 justify-center rounded-md border-[#6B7280]`}>
                          <Skeleton
                            baseColor='#22294d'
                            highlightColor='#313a67'
                            height={170}
                          />
                          <div className='space-y-1 text-center'></div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6 w-full'>
                        <div className='col-span-3 sm:col-span-2 w-full'>
                          <label className='block text-sm font-medium text-gray-50'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              width={125}
                            />
                          </label>
                          <div className='mt-1 rounded-md shadow-sm w-full'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              height={40}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label className='block text-sm font-medium text-gray-50'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              width={60}
                            />
                          </label>
                          <div className='mt-1 rounded-md shadow-sm w-full'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              height={40}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label className='block text-sm font-medium text-gray-50'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              width={50}
                            />
                          </label>
                          <div className='mt-1 rounded-md shadow-sm w-full'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              height={40}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label className='block text-sm font-medium text-gray-50'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              width={50}
                            />
                          </label>
                          <div className='mt-1 rounded-md shadow-sm w-full'>
                            <Skeleton
                              baseColor='#22294d'
                              highlightColor='#313a67'
                              height={40}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='justify-center items-start bg-gray-500 px-6 pb-4'>
                      <div className='cursor-pointer border-none items-center justify-center rounded-full w-52'>
                        <Skeleton
                          baseColor='#22294d'
                          highlightColor='#313a67'
                          height={40}
                          borderRadius={500}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  ) : (
    <div className='bg-gray-100 rounded-xl p-6 lg:p-10 text-white'>
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
      <div className='mb-12'>
        <h2 className='m-0 mb-6 text-[28px]'>Change Your Profile Details</h2>
        <>
          <div>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              <div className='md:col-span-1'>
                <div className='px-4 sm:px-0'>
                  <h3 className='text-lg font-medium leading-6 text-white'>
                    Profile
                  </h3>
                  <p className='mt-[-0.85rem] text-sm text-[#9CA3AF]'>
                    This information will be displayed publicly so be careful
                    what you share. It may take longer to update details to
                    blockchain, please check back later once updated.
                  </p>
                </div>
              </div>
              <div className='mt-5 md:col-span-2 md:mt-0'>
                <form onSubmit={onSubmitProfile}>
                  <div className='shadow sm:overflow-hidden sm:rounded-md'>
                    <div className='space-y-6 bg-gray-500 px-4 py-5 sm:p-6'>
                      <div className='flex flex-row gap-x-8 w-full'>
                        <div className='flex flex-col gap-y-2'>
                          <label
                            className='block text-sm font-medium text-white'
                            htmlFor='profile'>
                            Profile
                          </label>
                          <div className='relative w-20 h-20 border-none overflow-hidden rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue flex items-center justify-center'>
                            <input
                              className='absolute w-full h-full opacity-0'
                              type='file'
                              accept='images/*'
                              id='profile'
                              name='profile'
                              placeholder='Enter your profile'
                              onChange={(event) => handleProfileUpload(event)}
                            />
                            {profile ? (
                              <img
                                src={
                                  profileFile
                                    ? getPreviewImage(profileFile)
                                    : profile
                                }
                                alt='Profile'
                                className='object-cover w-full h-full'
                              />
                            ) : (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-6 h-6'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className='flex flex-col gap-y-2 w-full box-border'>
                          <label
                            className='block text-sm font-medium text-white'
                            htmlFor='banner'>
                            Banner
                          </label>
                          <div className='relative box-border w-full h-20 border-none overflow-hidden rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue flex items-center justify-center'>
                            <input
                              className='absolute w-full h-full opacity-0'
                              type='file'
                              accept='images/*'
                              id='banner'
                              name='banner'
                              placeholder='Enter your banner'
                              onChange={(event) => handleBannerUpload(event)}
                            />
                            {banner ? (
                              <img
                                src={
                                  bannerFile
                                    ? getPreviewImage(bannerFile)
                                    : banner
                                }
                                alt='Banner'
                                className='object-cover w-full h-full'
                              />
                            ) : (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-6 h-6'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='first-name'
                            className='block text-sm font-medium text-white'>
                            Name
                          </label>
                          <input
                            type='text'
                            name='first-name'
                            id='first-name'
                            defaultValue={name as string}
                            autoComplete='given-name'
                            placeholder='Enter your name'
                            className='mt-1 bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                            onChange={(event) => changeName(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='email-address'
                            className='block text-sm font-medium text-white'>
                            Email address
                          </label>
                          <input
                            type='text'
                            name='email-address'
                            defaultValue={email as string}
                            id='email-address'
                            autoComplete='email'
                            placeholder='Enter your email address'
                            className='mt-1 bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                            onChange={(event) =>
                              changeEmail(event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='bio'
                            className='block text-sm font-medium text-white'>
                            Bio
                          </label>
                          <div className='mt-1'>
                            <textarea
                              rows={4}
                              name='comment'
                              id='bio'
                              defaultValue={bio as string}
                              placeholder='Enter your bio'
                              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue resize-y'
                              onChange={(event) =>
                                changeBio(event.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='personalWebsite'
                            className='block text-sm font-medium text-white'>
                            Personal Website
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm'>
                            <input
                              onChange={(event) =>
                                changePersonalWebsite(event.target.value)
                              }
                              defaultValue={personalWebsite as string}
                              type='text'
                              name='personalWebsite'
                              id='personalWebsite'
                              className='bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                              placeholder='https://www.user.domain'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='linkedin'
                            className='block text-sm font-medium text-white'>
                            Linkedin
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm'>
                            <input
                              onChange={(event) =>
                                changeLinkedin(event.target.value)
                              }
                              defaultValue={linkedin as string}
                              type='text'
                              name='linkedin'
                              id='linkedin'
                              className='bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                              placeholder='https://www.linkedin.com/username'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='github'
                            className='block text-sm font-medium text-white'>
                            Github
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm'>
                            <input
                              onChange={(event) =>
                                changeGithub(event.target.value)
                              }
                              defaultValue={github as string}
                              type='text'
                              name='github'
                              id='github'
                              className='bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                              placeholder={'https://github.com/username'}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='col-span-3 sm:col-span-2'>
                          <label
                            htmlFor='twitter'
                            className='block text-sm font-medium text-white'>
                            Twitter
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm'>
                            <input
                              onChange={(event) =>
                                changeTwitter(event.target.value)
                              }
                              defaultValue={twitter as string}
                              type='text'
                              name='twitter'
                              id='twitter'
                              className='bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                              placeholder={'https://twitter.com/username'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='flex flex-col justify-center items-start bg-gray-500 px-4 pb-4 text-right sm:px-6'>
                      <button
                        type='submit'
                        className='cursor-pointer border-none flex items-center justify-center py-2 rounded-full w-40 bg-blue text-white font-semibold text-[1rem] leading-6'>
                        Update profile
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default Setting;
