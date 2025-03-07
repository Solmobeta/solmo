'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import MosaicBlock from '@/app/components/MosaicBlock';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Ensure wallet adapter UI only renders client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <section className="flex flex-col items-center justify-center py-16 md:py-32">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center md:text-left"
              >
                <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
                  Revolutionary NFT Ecosystem & Financial Platform
                </h1>
                <p className="text-xl mb-8 opacity-80">
                  SolMosaic integrates art, finance, and social functionalities into a comprehensive NFT ecosystem, creating a new paradigm for NFT and DeFi through unique modular design and dynamic smart contracts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/explore" className="btn-primary text-center">
                    Explore NFTs
                  </Link>
                  <Link href="/portfolio" className="btn-secondary text-center">
                    Portfolio
                  </Link>
                  {mounted && (
                    <div className="wallet-adapter-button-container flex justify-center md:justify-start">
                      <WalletMultiButton />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4 relative">
                  <MosaicBlock color="primary" delay={0} />
                  <MosaicBlock color="secondary" delay={0.1} />
                  <MosaicBlock color="tertiary" delay={0.2} />
                  <MosaicBlock color="primary" delay={0.3} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg animate-pulse-slow" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core Innovation Features
            </h2>
            <p className="text-xl opacity-70 max-w-2xl mx-auto">
              SolMosaic goes beyond traditional NFT fund models to build a comprehensive NFT ecosystem
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:border-primary/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${featureColors[index % featureColors.length]}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="opacity-70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}

const featureColors = [
  'bg-primary/20 text-primary',
  'bg-secondary/20 text-secondary',
  'bg-tertiary/20 text-tertiary',
];

// Features data
const features = [
  {
    title: "Dynamic NFT Portfolio",
    description: "Adaptive investment algorithms analyze on-chain data to identify emerging collection trends and value opportunities",
    icon: "📊"
  },
  {
    title: "Liquid Fractal Ownership",
    description: "Automatically optimize fragment quantities based on NFT characteristics and market value, creating micro-collection markets",
    icon: "🧩"
  },
  {
    title: "NFT Financial Innovation",
    description: "Multi-dimensional collateral mechanisms, derivatives markets, yield farming, and zero-knowledge lending",
    icon: "💰"
  },
  {
    title: "Creator Ecosystem",
    description: "Incubator projects, dynamic royalty systems, collaborative creation tools, and on-demand custom NFTs",
    icon: "🎨"
  },
  {
    title: "Social Finance Integration",
    description: "Community curation models, reputation systems, NFT social graphs, and activity rewards",
    icon: "🌐"
  },
  {
    title: "Cross-chain NFT Bridging",
    description: "Multi-chain NFT management, value transfer protocols, cross-chain liquidity pools, and universal NFT identifiers",
    icon: "🌉"
  }
]; 