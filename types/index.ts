// NFT related types
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  owner: string;
  price: number;
  collection?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

// Collection related types
export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  floorPrice: number;
  volumeTraded: number;
  items: number;
  holders: number;
}

// Portfolio related types
export interface Portfolio {
  id: string;
  name: string;
  owner: string;
  totalValue: number;
  assets: NFT[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

// Fractional ownership related types
export interface FractionalShare {
  id: string;
  nftId: string;
  nftName: string;
  nftImage: string;
  percentage: number;
  owner: string;
  value: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Solana error type
export interface SolanaError {
  code: number;
  message: string;
  data?: unknown;
}

// MosaicBlock props type
export interface MosaicBlockProps {
  color: 'primary' | 'secondary' | 'tertiary';
  delay?: number;
}

// NFT Card props type
export interface NFTCardProps {
  nft: NFT;
}

// Wallet Context props
export interface WalletProviderProps {
  children: React.ReactNode;
} 