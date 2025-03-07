import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// User data interfaces
export interface UserProfile {
  publicKey: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  twitter?: string;
  discord?: string;
  joinedDate: number;
  lastActive: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'vote' | 'proposal' | 'investment' | 'nft_creation' | 'token_transaction';
  timestamp: number;
  details: any;
}

export interface UserInvestment {
  id: string;
  userId: string;
  investmentType: 'nft' | 'token' | 'pool';
  assetId: string;
  amount: number;
  timestamp: number;
  status: 'active' | 'exited' | 'liquidated';
}

export interface UserNFTCollection {
  id: string;
  userId: string;
  nfts: UserNFT[];
}

export interface UserNFT {
  mint: string;
  name: string;
  imageUrl: string;
  collection?: string;
  rarity?: number;
  acquiredAt: number;
  acquiredPrice?: number;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'system' | 'governance' | 'investment' | 'social';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

export interface UserReputationScore {
  userId: string;
  overall: number;
  investment: number;
  governance: number;
  community: number;
  lastUpdated: number;
}

// Blockchain API for user data
class BlockchainAPI {
  private connection: Connection;
  
  constructor(connection: Connection) {
    this.connection = connection;
  }
  
  // Fetch on-chain account data for a user
  async fetchAccountData(publicKey: PublicKey): Promise<any> {
    try {
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      console.error('Error fetching account data:', error);
      return null;
    }
  }
  
  // Fetch token balances for a user
  async fetchTokenBalances(publicKey: PublicKey): Promise<any[]> {
    try {
      const tokenAccounts = await this.connection.getTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );
      
      return tokenAccounts.value.map(tokenAccount => {
        const accountData = tokenAccount.account.data;
        // Parse token account data
        // This is simplified - in a real app, we would properly decode the data
        return {
          mint: 'tokenMint', // Would be decoded from accountData
          amount: 'tokenAmount', // Would be decoded from accountData
        };
      });
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }
  
  // Fetch NFTs owned by the user
  async fetchNFTs(publicKey: PublicKey): Promise<UserNFT[]> {
    try {
      // In a real implementation, this would query Metaplex or another NFT indexer
      // For this example, we'll return mock data
      return [
        {
          mint: 'NFT1Mint',
          name: 'SolMosaic #1',
          imageUrl: 'https://arweave.net/sample-nft-1',
          collection: 'SolMosaic',
          rarity: 0.05,
          acquiredAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          acquiredPrice: 1.5,
        },
        {
          mint: 'NFT2Mint',
          name: 'SolMosaic #2',
          imageUrl: 'https://arweave.net/sample-nft-2',
          collection: 'SolMosaic',
          rarity: 0.02,
          acquiredAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          acquiredPrice: 2.1,
        }
      ];
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }
}

// Database API for off-chain user data
class DatabaseAPI {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'https://api.solmosaic.com') {
    this.baseUrl = baseUrl;
  }
  
  // Simulate fetching user profile
  async fetchUserProfile(userId: string): Promise<UserProfile> {
    // In a real app, this would be an API call
    // For this example, we'll return mock data
    return {
      publicKey: userId,
      displayName: 'SolMosaic User',
      avatar: 'https://avatars.com/default',
      bio: 'NFT enthusiast and collector',
      twitter: '@solmosaic_user',
      discord: 'solmosaic_user#1234',
      joinedDate: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      lastActive: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    };
  }
  
  // Simulate saving user profile
  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    try {
      // In a real app, this would be an API call
      console.log('Saving user profile:', profile);
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }
  
  // Simulate fetching user activities
  async fetchUserActivities(userId: string, limit: number = 10): Promise<UserActivity[]> {
    // In a real app, this would be an API call
    // For this example, we'll return mock data
    return [
      {
        id: 'act1',
        userId,
        activityType: 'proposal',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        details: {
          proposalId: 'prop1',
          title: 'Community Treasury Allocation',
          status: 'passed'
        }
      },
      {
        id: 'act2',
        userId,
        activityType: 'vote',
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        details: {
          proposalId: 'prop2',
          vote: 'for',
          weight: 100
        }
      },
      {
        id: 'act3',
        userId,
        activityType: 'investment',
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        details: {
          type: 'nft',
          collectionName: 'SolMosaic',
          amount: 2.5
        }
      }
    ].slice(0, limit);
  }
  
  // Simulate fetching user investments
  async fetchUserInvestments(userId: string): Promise<UserInvestment[]> {
    // In a real app, this would be an API call
    return [
      {
        id: 'inv1',
        userId,
        investmentType: 'nft',
        assetId: 'collection1',
        amount: 2.5,
        timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
        status: 'active'
      },
      {
        id: 'inv2',
        userId,
        investmentType: 'token',
        assetId: 'SolMosaic',
        amount: 1000,
        timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
        status: 'active'
      }
    ];
  }
  
  // Simulate fetching user notifications
  async fetchUserNotifications(userId: string, unreadOnly: boolean = false): Promise<UserNotification[]> {
    // In a real app, this would be an API call
    let notifications = [
      {
        id: 'notif1',
        userId,
        type: 'governance',
        title: 'Proposal Passed',
        message: 'Your proposal for treasury allocation has passed!',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        isRead: false,
        actionUrl: '/governance/proposals/prop1'
      },
      {
        id: 'notif2',
        userId,
        type: 'investment',
        title: 'Price Alert',
        message: 'SolMosaic token has increased by 15% in the last 24 hours.',
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        isRead: true,
        actionUrl: '/markets/tokens/SolMosaic'
      }
    ];
    
    if (unreadOnly) {
      notifications = notifications.filter(notif => !notif.isRead);
    }
    
    return notifications;
  }
  
  // Simulate marking notifications as read
  async markNotificationsAsRead(notificationIds: string[]): Promise<boolean> {
    try {
      // In a real app, this would be an API call
      console.log('Marking notifications as read:', notificationIds);
      return true;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return false;
    }
  }
  
  // Simulate fetching user reputation score
  async fetchUserReputationScore(userId: string): Promise<UserReputationScore> {
    // In a real app, this would be an API call
    return {
      userId,
      overall: 78,
      investment: 82,
      governance: 75,
      community: 76,
      lastUpdated: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
    };
  }
}

// User Data Manager - Main class for managing user data
export class UserDataManager {
  private wallet: WalletContextState | null = null;
  private connection: Connection | null = null;
  private blockchainAPI: BlockchainAPI | null = null;
  private databaseAPI: DatabaseAPI;
  
  constructor(baseApiUrl?: string) {
    this.databaseAPI = new DatabaseAPI(baseApiUrl);
  }
  
  // Initialize with wallet and connection
  initialize(wallet: WalletContextState, connection: Connection) {
    this.wallet = wallet;
    this.connection = connection;
    this.blockchainAPI = new BlockchainAPI(connection);
  }
  
  // Check if the manager is initialized
  isInitialized(): boolean {
    return !!this.wallet && !!this.connection && !!this.blockchainAPI;
  }
  
  // Get current user public key
  getCurrentUserId(): string | null {
    if (!this.wallet || !this.wallet.publicKey) {
      return null;
    }
    return this.wallet.publicKey.toString();
  }
  
  // Get user profile
  async getUserProfile(): Promise<UserProfile | null> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return null;
    }
    
    try {
      return await this.databaseAPI.fetchUserProfile(userId);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
  
  // Update user profile
  async updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }
    
    try {
      const currentProfile = await this.databaseAPI.fetchUserProfile(userId);
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...profile,
        publicKey: userId,
        lastActive: Date.now()
      };
      
      return await this.databaseAPI.saveUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }
  
  // Get user token balances
  async getUserTokenBalances(): Promise<any[]> {
    if (!this.wallet || !this.wallet.publicKey || !this.blockchainAPI) {
      return [];
    }
    
    try {
      return await this.blockchainAPI.fetchTokenBalances(this.wallet.publicKey);
    } catch (error) {
      console.error('Error getting user token balances:', error);
      return [];
    }
  }
  
  // Get user NFTs
  async getUserNFTs(): Promise<UserNFT[]> {
    if (!this.wallet || !this.wallet.publicKey || !this.blockchainAPI) {
      return [];
    }
    
    try {
      return await this.blockchainAPI.fetchNFTs(this.wallet.publicKey);
    } catch (error) {
      console.error('Error getting user NFTs:', error);
      return [];
    }
  }
  
  // Get user activities
  async getUserActivities(limit: number = 10): Promise<UserActivity[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return [];
    }
    
    try {
      return await this.databaseAPI.fetchUserActivities(userId, limit);
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }
  
  // Get user investments
  async getUserInvestments(): Promise<UserInvestment[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return [];
    }
    
    try {
      return await this.databaseAPI.fetchUserInvestments(userId);
    } catch (error) {
      console.error('Error getting user investments:', error);
      return [];
    }
  }
  
  // Get user notifications
  async getUserNotifications(unreadOnly: boolean = false): Promise<UserNotification[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return [];
    }
    
    try {
      return await this.databaseAPI.fetchUserNotifications(userId, unreadOnly);
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }
  
  // Mark notifications as read
  async markNotificationsAsRead(notificationIds: string[]): Promise<boolean> {
    if (!this.getCurrentUserId()) {
      return false;
    }
    
    try {
      return await this.databaseAPI.markNotificationsAsRead(notificationIds);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return false;
    }
  }
  
  // Get user reputation score
  async getUserReputationScore(): Promise<UserReputationScore | null> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return null;
    }
    
    try {
      return await this.databaseAPI.fetchUserReputationScore(userId);
    } catch (error) {
      console.error('Error getting user reputation score:', error);
      return null;
    }
  }
}

// Create a singleton instance
export const userDataManager = new UserDataManager(); 