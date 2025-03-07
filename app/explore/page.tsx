'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import NFTCard from '@/app/components/NFTCard';
import { mockNFTs } from '@/app/utils/mockData';
import { NFT } from '@/types/index';

export default function ExplorePage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setNfts(mockNFTs);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter NFTs
  const filteredNFTs = nfts.filter(nft => {
    if (searchQuery && !nft.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filter === 'all') return true;
    if (filter === 'art' && nft.collection === 'art') return true;
    if (filter === 'gaming' && nft.collection === 'gaming') return true;
    if (filter === 'metaverse' && nft.collection === 'metaverse') return true;
    
    return false;
  });
  
  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/20 to-background">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore NFT Collections
            </h1>
            <p className="text-xl opacity-80 max-w-3xl mx-auto mb-8">
              Discover, collect, and invest in the finest Solana NFT collections
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 backdrop-blur-sm border border-white/10 rounded-lg py-3 px-5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 top-3 text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full border ${
                filter === 'all' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
              } transition`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('art')}
              className={`px-6 py-2 rounded-full border ${
                filter === 'art' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
              } transition`}
            >
              Art
            </button>
            <button
              onClick={() => setFilter('gaming')}
              className={`px-6 py-2 rounded-full border ${
                filter === 'gaming' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
              } transition`}
            >
              Gaming
            </button>
            <button
              onClick={() => setFilter('metaverse')}
              className={`px-6 py-2 rounded-full border ${
                filter === 'metaverse' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
              } transition`}
            >
              Metaverse
            </button>
          </div>
        </div>
      </section>
      
      {/* NFT Grid */}
      <section className="py-8">
        <div className="container px-4 mx-auto max-w-6xl">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredNFTs.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No NFTs Found</h3>
              <p className="opacity-70">Try different search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <NFTCard nft={nft} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 