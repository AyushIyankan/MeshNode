export const register_user_abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: '_secret',
        type: 'bytes32',
      },
    ],
    name: 'registerUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const is_user_exists_abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address',
      },
    ],
    name: '_userExists',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const set_user_uri_by_address_abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newUri',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: '_secret',
        type: 'bytes32',
      },
    ],
    name: 'setUserURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const get_user_by_address_abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getUserByAddress',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bestAnswerCount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'qUpvotes',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'aUpvotes',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'userAddress',
            type: 'address',
          },
          {
            internalType: 'uint256[]',
            name: 'questions',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'answers',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'comments',
            type: 'uint256[]',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
        ],
        internalType: 'struct Stack3.User',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const get_answers_by_user_address = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getAnswersByUserAddress',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const get_questions_by_user_address = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getQuestionsByUserAddress',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const set_user_uri_abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newUri',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: '_secret',
        type: 'bytes32',
      },
    ],
    name: 'setUserURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const get_user_badges_abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getUserBadges',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
