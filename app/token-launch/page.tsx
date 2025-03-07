'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  createToken, 
  registerPumpLaunch,
  TokenCreationParams,
  PumpLaunchParams
} from '../utils/pumpFunLaunch';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TokenLaunch = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdTokenMint, setCreatedTokenMint] = useState<string | null>(null);
  
  // Token creation form state
  const [tokenParams, setTokenParams] = useState<TokenCreationParams>({
    name: '',
    symbol: '',
    description: '',
    image: '',
    supply: 1000000000,
    decimals: 9,
    website: '',
    twitter: '',
    telegram: '',
    discord: ''
  });
  
  // Pump.fun launch form state
  const [launchParams, setLaunchParams] = useState<PumpLaunchParams>({
    tokenMint: '',
    initialPrice: 0.000001,
    maxSupply: 1000000000,
    tradingFee: 3,
    creatorFee: 7,
    liquidityPercentage: 90
  });
  
  // Update launch params when token is created
  useEffect(() => {
    if (createdTokenMint) {
      setLaunchParams(prev => ({
        ...prev,
        tokenMint: createdTokenMint,
        maxSupply: tokenParams.supply
      }));
    }
  }, [createdTokenMint, tokenParams.supply]);
  
  // Handle token creation form change
  const handleTokenParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTokenParams(prev => ({
      ...prev,
      [name]: name === 'supply' || name === 'decimals' ? Number(value) : value
    }));
  };
  
  // Handle pump.fun launch form change
  const handleLaunchParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLaunchParams(prev => ({
      ...prev,
      [name]: name === 'tokenMint' ? value : Number(value)
    }));
  };
  
  // Handle token creation
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    try {
      const mintAddress = await createToken(wallet, connection, tokenParams);
      setCreatedTokenMint(mintAddress);
      toast.success(`Token created successfully: ${mintAddress}`);
      setCurrentStep(2);
    } catch (error: any) {
      toast.error(`Error creating token: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle pump.fun launch
  const handleLaunchToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!createdTokenMint && !launchParams.tokenMint) {
      toast.error('Please create a token first or enter a token mint address');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await registerPumpLaunch(wallet, connection, launchParams);
      toast.success('Token launched successfully on Pump.fun!');
      setCurrentStep(3);
      // In a real app, we would store the response and track the launch status
    } catch (error: any) {
      toast.error(`Error launching token: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <section className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center gradient-text">
          Launch Your Token on Pump.fun
        </h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div 
                      className={`h-1 w-16 ${
                        currentStep > step ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">
              {currentStep === 1 && 'Step 1: Create Your Token'}
              {currentStep === 2 && 'Step 2: Launch on Pump.fun'}
              {currentStep === 3 && 'Success! Token Launched'}
            </h2>
            <p className="text-gray-400">
              {currentStep === 1 && 'Fill in the details to create your Solana SPL token'}
              {currentStep === 2 && 'Configure your token launch parameters'}
              {currentStep === 3 && 'Your token is now live on Pump.fun'}
            </p>
          </div>
        </div>
        
        {!wallet.connected ? (
          <div className="text-center p-8 bg-white/5 rounded-lg border border-white/10 mb-8">
            <h3 className="text-xl mb-4">Connect your wallet to continue</h3>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <form onSubmit={handleCreateToken} className="bg-white/5 rounded-lg border border-white/10 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Token Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tokenParams.name}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="SolMosaic Token"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Token Symbol</label>
                    <input
                      type="text"
                      name="symbol"
                      value={tokenParams.symbol}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="SOLMO"
                      required
                    />
                  </div>
                  
                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-2 text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      value={tokenParams.description}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Utility token for the SolMosaic NFT ecosystem"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Token Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={tokenParams.image}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="https://example.com/token-image.png"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={tokenParams.website}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="https://solmo.co"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Supply</label>
                    <input
                      type="number"
                      name="supply"
                      value={tokenParams.supply}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="1000000000"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Decimals</label>
                    <input
                      type="number"
                      name="decimals"
                      value={tokenParams.decimals}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="9"
                      min="0"
                      max="9"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Twitter (optional)</label>
                    <input
                      type="text"
                      name="twitter"
                      value={tokenParams.twitter}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="@solmosaic"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Telegram (optional)</label>
                    <input
                      type="text"
                      name="telegram"
                      value={tokenParams.telegram}
                      onChange={handleTokenParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="solmosaic"
                    />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Token...' : 'Create Token'}
                  </button>
                </div>
              </form>
            )}
            
            {currentStep === 2 && (
              <form onSubmit={handleLaunchToken} className="bg-white/5 rounded-lg border border-white/10 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-2 text-sm font-medium">Token Mint Address</label>
                    <input
                      type="text"
                      name="tokenMint"
                      value={launchParams.tokenMint}
                      onChange={handleLaunchParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Token mint address"
                      readOnly={!!createdTokenMint}
                      required
                    />
                    {createdTokenMint && (
                      <p className="text-xs text-green-400 mt-1">✓ Using your newly created token</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Initial Price (SOL)</label>
                    <input
                      type="number"
                      name="initialPrice"
                      value={launchParams.initialPrice}
                      onChange={handleLaunchParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="0.000001"
                      step="0.000001"
                      min="0.000001"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Max Supply</label>
                    <input
                      type="number"
                      name="maxSupply"
                      value={launchParams.maxSupply}
                      onChange={handleLaunchParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="1000000000"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Trading Fee (%)</label>
                    <input
                      type="number"
                      name="tradingFee"
                      value={launchParams.tradingFee}
                      onChange={handleLaunchParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="3"
                      min="0"
                      max="10"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Creator Fee (%)</label>
                    <input
                      type="number"
                      name="creatorFee"
                      value={launchParams.creatorFee}
                      onChange={handleLaunchParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="7"
                      min="0"
                      max="10"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Liquidity Percentage (%)</label>
                    <input
                      type="number"
                      name="liquidityPercentage"
                      value={launchParams.liquidityPercentage}
                      onChange={handleLaunchParamChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="90"
                      min="50"
                      max="100"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary px-6 py-3"
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Launching Token...' : 'Launch on Pump.fun'}
                  </button>
                </div>
              </form>
            )}
            
            {currentStep === 3 && (
              <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Launch Successful!</h3>
                <p className="mb-6">Your token is now live on Pump.fun</p>
                
                <div className="bg-white/5 p-4 rounded-lg mb-6 inline-block">
                  <p className="text-sm mb-1">Token Mint Address:</p>
                  <p className="font-mono text-primary">{createdTokenMint || launchParams.tokenMint}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    className="btn-secondary px-6 py-3"
                    onClick={() => window.open(`https://solscan.io/token/${createdTokenMint || launchParams.tokenMint}`, '_blank')}
                  >
                    View on Solscan
                  </button>
                  
                  <button
                    className="btn-primary px-6 py-3"
                    onClick={() => window.open(`https://pump.fun/token/${createdTokenMint || launchParams.tokenMint}`, '_blank')}
                  >
                    View on Pump.fun
                  </button>
                </div>
                
                <button
                  className="mt-8 text-sm underline"
                  onClick={() => {
                    setCurrentStep(1);
                    setCreatedTokenMint(null);
                    setTokenParams({
                      name: '',
                      symbol: '',
                      description: '',
                      image: '',
                      supply: 1000000000,
                      decimals: 9,
                      website: '',
                      twitter: '',
                      telegram: '',
                      discord: ''
                    });
                    setLaunchParams({
                      tokenMint: '',
                      initialPrice: 0.000001,
                      maxSupply: 1000000000,
                      tradingFee: 3,
                      creatorFee: 7,
                      liquidityPercentage: 90
                    });
                  }}
                >
                  Launch another token
                </button>
              </div>
            )}
          </>
        )}
      </section>
      
      <Footer />
    </main>
  );
};

export default TokenLaunch; 