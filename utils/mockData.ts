import { NFT, Collection, Portfolio } from '../types/index';

// Mock NFT data
export const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Space Explorer #001',
    description: 'An explorer from the digital galaxy, searching for rare blockchain wonders.',
    image: 'https://arweave.net/placeholder1',
    creator: 'Studio Nebula',
    owner: 'user1',
    price: 2.5,
    collection: 'art',
    attributes: [
      { trait_type: 'Background', value: 'Deep Space' },
      { trait_type: 'Species', value: 'Human' },
      { trait_type: 'Equipment', value: 'Spacesuit' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  },
  {
    id: '2',
    name: 'Cyberpunk Street #042',
    description: 'A mysterious digital wanderer in a neon-lit future city.',
    image: 'https://arweave.net/placeholder2',
    creator: 'DigitalFuture',
    owner: 'user2',
    price: 1.8,
    collection: 'art',
    attributes: [
      { trait_type: 'Background', value: 'City Night' },
      { trait_type: 'Species', value: 'Cyborg' },
      { trait_type: 'Equipment', value: 'Neon Jacket' },
      { trait_type: 'Rarity', value: 'Common' }
    ]
  },
  {
    id: '3',
    name: 'Magic Academy Student #137',
    description: 'A young apprentice from the magical world, mastering elemental magic.',
    image: 'https://arweave.net/placeholder3',
    creator: 'MagicRealm',
    owner: 'user3',
    price: 3.2,
    collection: 'gaming',
    attributes: [
      { trait_type: 'Background', value: 'Magic Academy' },
      { trait_type: 'Species', value: 'Elf' },
      { trait_type: 'Equipment', value: 'Wizard Robe' },
      { trait_type: 'Rarity', value: 'Epic' }
    ]
  },
  {
    id: '4',
    name: 'Metaverse Architect #089',
    description: 'Creator of virtual worlds, designing magnificent structures in the digital realm.',
    image: 'https://arweave.net/placeholder4',
    creator: 'MetaBuild',
    owner: 'user4',
    price: 5.0,
    collection: 'metaverse',
    attributes: [
      { trait_type: 'Background', value: 'Digital Blueprint' },
      { trait_type: 'Species', value: 'AI' },
      { trait_type: 'Equipment', value: 'Holographic Tools' },
      { trait_type: 'Rarity', value: 'Legendary' }
    ]
  },
  {
    id: '5',
    name: 'Pixel Adventurer #210',
    description: 'A retro-style pixel character from a classic game world.',
    image: 'https://arweave.net/placeholder5',
    creator: 'RetroPixel',
    owner: 'user5',
    price: 1.5,
    collection: 'gaming',
    attributes: [
      { trait_type: 'Background', value: 'Pixel Forest' },
      { trait_type: 'Species', value: 'Human' },
      { trait_type: 'Equipment', value: 'Pixel Sword & Shield' },
      { trait_type: 'Rarity', value: 'Common' }
    ]
  },
  {
    id: '6',
    name: 'Future Athlete #055',
    description: 'A professional e-sports athlete from 2150, multiple world champion.',
    image: 'https://arweave.net/placeholder6',
    creator: 'FutureSports',
    owner: 'user6',
    price: 2.8,
    collection: 'gaming',
    attributes: [
      { trait_type: 'Background', value: 'Arena' },
      { trait_type: 'Species', value: 'Enhanced Human' },
      { trait_type: 'Equipment', value: 'Neural Interface' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  },
  {
    id: '7',
    name: 'Abstract Thought #023',
    description: 'An abstract artistic expression that cannot be described in traditional language.',
    image: 'https://arweave.net/placeholder7',
    creator: 'AbstractMinds',
    owner: 'user7',
    price: 4.2,
    collection: 'art',
    attributes: [
      { trait_type: 'Style', value: 'Abstract' },
      { trait_type: 'Color', value: 'Multicolor' },
      { trait_type: 'Technique', value: 'Digital Oil' },
      { trait_type: 'Rarity', value: 'Epic' }
    ]
  },
  {
    id: '8',
    name: 'Digital Land #A451',
    description: 'Prime real estate in the metaverse, located in a bustling central district.',
    image: 'https://arweave.net/placeholder8',
    creator: 'MetaRealEstate',
    owner: 'user8',
    price: 8.5,
    collection: 'metaverse',
    attributes: [
      { trait_type: 'Type', value: 'Commercial Land' },
      { trait_type: 'Location', value: 'Central District' },
      { trait_type: 'Size', value: 'Large' },
      { trait_type: 'Rarity', value: 'Legendary' }
    ]
  }
];

// Mock collection data
export const mockCollections: Collection[] = [
  {
    id: 'art',
    name: 'Digital Art',
    description: 'Unique pieces created by top digital artists',
    image: 'https://arweave.net/collection1',
    creator: 'ArtDAO',
    floorPrice: 1.5,
    volumeTraded: 5420,
    items: 1000,
    holders: 450
  },
  {
    id: 'gaming',
    name: 'Game Characters',
    description: 'Game characters and items usable across multiple virtual worlds',
    image: 'https://arweave.net/collection2',
    creator: 'GameStudios',
    floorPrice: 1.2,
    volumeTraded: 3250,
    items: 2500,
    holders: 830
  },
  {
    id: 'metaverse',
    name: 'Metaverse Assets',
    description: 'Virtual lands, buildings, and other assets in the metaverse',
    image: 'https://arweave.net/collection3',
    creator: 'MetaFoundation',
    floorPrice: 4.8,
    volumeTraded: 12800,
    items: 500,
    holders: 320
  }
];

// Mock portfolio data
export const mockPortfolios: Portfolio[] = [
  {
    id: 'p1',
    name: 'Blue Chip NFT Portfolio',
    owner: 'user1',
    totalValue: 45.8,
    assets: mockNFTs.slice(0, 4),
    performance: {
      daily: 2.5,
      weekly: 8.3,
      monthly: 21.5
    }
  },
  {
    id: 'p2',
    name: 'Gaming Assets Portfolio',
    owner: 'user1',
    totalValue: 28.4,
    assets: mockNFTs.filter(nft => nft.collection === 'gaming'),
    performance: {
      daily: -1.2,
      weekly: 5.7,
      monthly: 16.9
    }
  }
]; 