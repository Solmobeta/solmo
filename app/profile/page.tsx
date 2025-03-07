'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  userDataManager, 
  UserProfile, 
  UserActivity, 
  UserNFT, 
  UserNotification,
  UserReputationScore
} from '../utils/userDataManager';

const UserProfilePage = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // User data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [nfts, setNFTs] = useState<UserNFT[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [reputationScore, setReputationScore] = useState<UserReputationScore | null>(null);
  
  // Form state for profile editing
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    twitter: '',
    discord: ''
  });
  
  // Initialize user data manager when wallet is connected
  useEffect(() => {
    if (wallet.connected && connection) {
      userDataManager.initialize(wallet, connection);
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [wallet.connected, connection]);
  
  // Load user data
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const profile = await userDataManager.getUserProfile();
      const activities = await userDataManager.getUserActivities(5);
      const nfts = await userDataManager.getUserNFTs();
      const notifications = await userDataManager.getUserNotifications();
      const reputationScore = await userDataManager.getUserReputationScore();
      
      setProfile(profile);
      setActivities(activities);
      setNFTs(nfts);
      setNotifications(notifications);
      setReputationScore(reputationScore);
      
      // Initialize form data
      if (profile) {
        setFormData({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          twitter: profile.twitter || '',
          discord: profile.discord || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle profile form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const success = await userDataManager.updateUserProfile({
        ...profile,
        displayName: formData.displayName,
        bio: formData.bio,
        twitter: formData.twitter,
        discord: formData.discord
      });
      
      if (success) {
        toast.success('Profile updated successfully');
        loadUserData(); // Reload user data
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    if (!notifications.length) return;
    
    const unreadIds = notifications
      .filter(notification => !notification.isRead)
      .map(notification => notification.id);
    
    if (unreadIds.length === 0) return;
    
    try {
      const success = await userDataManager.markNotificationsAsRead(unreadIds);
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({
            ...notification,
            isRead: true
          }))
        );
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Render connect wallet UI if not connected
  if (!wallet.connected) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Header />
        
        <section className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md p-8 bg-white/5 rounded-lg border border-white/10 text-center">
            <h1 className="text-2xl font-bold mb-6">Connect Your Wallet</h1>
            <p className="mb-8 text-gray-300">
              Please connect your wallet to view your profile and activities.
            </p>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        </section>
        
        <Footer />
      </main>
    );
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Header />
        
        <section className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-300">Loading your profile...</p>
        </section>
        
        <Footer />
      </main>
    );
  }
  
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <section className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-12 bg-white/5 rounded-lg border border-white/10 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-700 rounded-full overflow-hidden">
              {profile?.avatar ? (
                <Image 
                  src={profile.avatar} 
                  alt={profile.displayName || 'User'} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-400">
                  {profile?.displayName?.charAt(0) || wallet.publicKey?.toString().charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {profile?.displayName || 'Anonymous User'}
              </h1>
              
              <div className="mt-2 text-sm flex flex-wrap justify-center md:justify-start gap-4">
                <div className="text-gray-400">
                  <span className="font-mono text-xs bg-white/10 py-1 px-2 rounded">
                    {wallet.publicKey?.toString().substring(0, 8)}...
                    {wallet.publicKey?.toString().substring(wallet.publicKey.toString().length - 8)}
                  </span>
                </div>
                
                {profile?.twitter && (
                  <div className="flex items-center text-blue-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    {profile.twitter}
                  </div>
                )}
                
                {profile?.discord && (
                  <div className="flex items-center text-indigo-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                    {profile.discord}
                  </div>
                )}
                
                {profile?.joinedDate && (
                  <div className="text-gray-400">
                    Joined {formatDate(profile.joinedDate)}
                  </div>
                )}
              </div>
              
              {profile?.bio && !isEditing && (
                <p className="mt-4 text-gray-300 max-w-2xl">
                  {profile.bio}
                </p>
              )}
              
              {reputationScore && !isEditing && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Reputation Score</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 px-3 py-2 rounded">
                      <div className="text-lg font-bold">{reputationScore.overall}</div>
                      <div className="text-xs text-gray-400">Overall</div>
                    </div>
                    <div className="bg-primary/10 px-3 py-2 rounded">
                      <div className="text-lg font-bold">{reputationScore.investment}</div>
                      <div className="text-xs text-gray-400">Investment</div>
                    </div>
                    <div className="bg-secondary/10 px-3 py-2 rounded">
                      <div className="text-lg font-bold">{reputationScore.governance}</div>
                      <div className="text-xs text-gray-400">Governance</div>
                    </div>
                    <div className="bg-tertiary/10 px-3 py-2 rounded">
                      <div className="text-lg font-bold">{reputationScore.community}</div>
                      <div className="text-xs text-gray-400">Community</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {isEditing ? (
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary px-4 py-2"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {/* Profile Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-8 border-t border-white/10 pt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="mb-4">
                  <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="twitter" className="block text-sm font-medium mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="discord" className="block text-sm font-medium mb-2">
                    Discord
                  </label>
                  <input
                    type="text"
                    id="discord"
                    name="discord"
                    value={formData.discord}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary px-6 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Profile Tabs */}
        <div className="mb-6">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'nfts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                NFTs ({nfts.length})
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activities'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Notifications
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-lg border border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                {activities.length === 0 ? (
                  <p className="text-gray-400">No recent activity to display.</p>
                ) : (
                  <div className="space-y-4">
                    {activities.slice(0, 3).map(activity => (
                      <div key={activity.id} className="pb-4 border-b border-white/5">
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-400">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                        <div>
                          {activity.activityType === 'proposal' && (
                            <span>
                              Created proposal: <strong>{activity.details.title}</strong>
                            </span>
                          )}
                          {activity.activityType === 'vote' && (
                            <span>
                              Voted <strong>{activity.details.vote}</strong> on proposal
                            </span>
                          )}
                          {activity.activityType === 'investment' && (
                            <span>
                              Invested <strong>{activity.details.amount} SOL</strong> in {activity.details.collectionName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="text-sm text-primary mt-2"
                    >
                      View all activities
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white/5 rounded-lg border border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-4">NFT Collection</h2>
                {nfts.length === 0 ? (
                  <p className="text-gray-400">No NFTs in your collection yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {nfts.slice(0, 4).map(nft => (
                      <div key={nft.mint} className="bg-white/5 rounded-lg overflow-hidden">
                        <div className="relative aspect-square">
                          <Image 
                            src={nft.imageUrl} 
                            alt={nft.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm truncate">{nft.name}</h3>
                          <p className="text-xs text-gray-400">{nft.collection}</p>
                        </div>
                      </div>
                    ))}
                    {nfts.length > 4 && (
                      <button
                        onClick={() => setActiveTab('nfts')}
                        className="text-sm text-primary mt-2"
                      >
                        View all NFTs
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* NFTs Tab */}
          {activeTab === 'nfts' && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              <h2 className="text-xl font-semibold mb-6">Your NFT Collection</h2>
              {nfts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">You don't have any NFTs yet.</p>
                  <button className="btn-primary px-6 py-3">Explore NFTs</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {nfts.map(nft => (
                    <div key={nft.mint} className="bg-white/5 rounded-lg overflow-hidden">
                      <div className="relative aspect-square">
                        <Image 
                          src={nft.imageUrl} 
                          alt={nft.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm truncate">{nft.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">{nft.collection}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Rarity: {nft.rarity?.toFixed(3) || 'N/A'}</span>
                          <span className="text-gray-400">
                            Acquired: {formatDate(nft.acquiredAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              <h2 className="text-xl font-semibold mb-6">Activity History</h2>
              {activities.length === 0 ? (
                <p className="text-gray-400">No activities to display.</p>
              ) : (
                <div className="space-y-6">
                  {activities.map(activity => (
                    <div key={activity.id} className="pb-6 border-b border-white/5">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-400">
                          {formatDate(activity.timestamp)}
                        </span>
                        <span className="ml-3 px-2 py-1 text-xs rounded-full bg-white/10">
                          {activity.activityType}
                        </span>
                      </div>
                      <div>
                        {activity.activityType === 'proposal' && (
                          <div>
                            <p className="font-medium">Created proposal: {activity.details.title}</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Status: <span className="capitalize">{activity.details.status}</span>
                            </p>
                          </div>
                        )}
                        {activity.activityType === 'vote' && (
                          <div>
                            <p className="font-medium">
                              Voted <span className="capitalize">{activity.details.vote}</span> on proposal
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Weight: {activity.details.weight}
                            </p>
                          </div>
                        )}
                        {activity.activityType === 'investment' && (
                          <div>
                            <p className="font-medium">
                              Invested {activity.details.amount} SOL in {activity.details.collectionName}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Type: {activity.details.type}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Notifications</h2>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-sm text-primary"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <p className="text-gray-400">No notifications to display.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg ${
                        notification.isRead 
                          ? 'bg-white/5 border border-white/10' 
                          : 'bg-primary/10 border border-primary/20'
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          notification.type === 'governance' ? 'bg-blue-500/20 text-blue-300' :
                          notification.type === 'investment' ? 'bg-green-500/20 text-green-300' :
                          notification.type === 'social' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-white/10 text-gray-300'
                        }`}>
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                      {notification.actionUrl && (
                        <a 
                          href={notification.actionUrl} 
                          className="block mt-3 text-sm text-primary hover:underline"
                        >
                          View details
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default UserProfilePage; 