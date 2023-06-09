<h1 align="center" style="font-size: 36px; font-weight: 500; font-family: DM Sans, sans-serif;">MeshNode</h1>
<p align="center" style="font-size: 24px; font-weight: 500; font-family: DM Sans, sans-serif;">Fully Decentralized Community with Rewards</p>

<p align="center">
  <img src="https://github.com/AyushIyankan/MeshNode/assets/75990868/981cd9bc-2272-43d7-8fdf-c42c6716836e" alt="MeshNode Banner">
</p>

## Component Repos
Smart Contracts: https://github.com/moonman369/MeshNode-Web3 <br />
Frontend: https://github.com/VijayKumarKTG/hackathon-front-end


## Demo
[[Demo]](https://www.youtube.com/watch?v=4nLXyhjVucg)

## About
 MeshNode creates a interactive ecosystem where users can post questions on diverse topics or tags, seeking insights and solutions from a community of experts and enthusiasts. Likewise, users are encouraged to contribute their knowledge by answering questions posed by others. This collaborative environment facilitates the exchange of ideas, information, and expertise, and last but not the least incentivize user with rewards like badges and NFTs.
The platform uses Chainlink VRF to select random winners from existing users and airdrop NFTs to them.

## Features
1. Connect wallet from listed providers (Metamask/Coinbase/WalletConnect) and create account.
2. View profile which included stats of user, questions asked, answers posted, rewards and badges earned, claim unclaimed rewards, and to update profile details.
3. Ask questions tag-wise, upvote questions, post answers, upvote answers, address who posted question can choose best answer, add comments
   to question or answer.
4. Tag based filtering and searching features.

## Upcoming Features
1. Leverage the power of AI for rareminting NFT rewards to user.
2. Introduce a new reward model in which user can be rewarded with real ETH.
3. Feature to follow and unfollow a particular user address.
4. Chat with like minded people and in communities.

## Prerequesites
 Make sure you have Node.js(v16.15.0 or above), Metamask installed.

## Getting Started
1. Clone MeshNode repository 
   
   ```bash
   git clone https://github.com/AyushIyankan/MeshNode.git
   ```
2. Install all necessary dependancies with npm at root of the cloned project.

   ```bash
   npm install
   ```
3. Setup environment variables
   ```bash       
      NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
      NEXT_PUBLIC_HASH_SECRET=YOUR_HASH_SECRET_FROM_CONTRACT_DEPLOY
      NEXT_PUBLIC_PINATA_API_KEY=YOUR_PINATA_KEY
      NEXT_PUBLIC_PINATA_API_SECRET=YOUR_PINATA_SECRET
      NEXT_PUBLIC_IPFS_LINK=YOUR_IPFS_LINK
      NEXT_PUBLIC_TAGS_IPFS_LINK=YOUR_IPFS_LINK_FOR_TAGS
      NEXT_PUBLIC_RAREMINT_NFTS_IPFS_LINK=YOUR_IPFS_LINK_FOR_RAREMINT_NFTS
      NEXT_PUBLIC_STACK3_ADDRESS=YOUR_MESHNODE_ADDRESS_FROM_CONTRACT_DEPLOY
      NEXT_PUBLIC_STACK3_BADGES_ADDRESS=YOUR_MESHNODE_BADGES_ADDRESS_FROM_CONTRACT_DEPLOY
      NEXT_PUBLIC_STACK3_RAREMINT_ADDRESS=YOUR_MESHNODE_RAREMINT_ADDRESS_FROM_CONTRACT_DEPLOY
      NEXT_PUBLIC_STACK3_AUTOMATION_ADDRESS=YOUR_MESHNODE_AUTOMATION_ADDRESS_FROM_CONTRACT_DEPLOY
      NEXT_PUBLIC_RAREMINT_OPENSEA_BASE_URL=https://testnets.opensea.io/assets/mumbai/
   ```
5. Start your local development server
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) (or running port) with your browser to see the result.

## Contributing
 If you find any bugs or you have a feature in mind, feel free to open an issue and submit a PR upon assignment.
