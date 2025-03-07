'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import NFTCard from '@/app/components/NFTCard';
import { mockPortfolios, mockNFTs } from '@/mockData';

const PortfolioPage = () => {
  const { connected } = useWallet();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 模拟从API加载数据
    setTimeout(() => {
      setPortfolios(mockPortfolios);
      if (mockPortfolios.length > 0) {
        setActivePortfolio(mockPortfolios[0].id);
      }
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // 获取当前选中的投资组合
  const currentPortfolio = portfolios.find(p => p.id === activePortfolio);
  
  // 渲染未连接钱包的状态
  const renderNotConnected = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">连接钱包查看您的 NFT 投资组合</h2>
      <p className="mb-8 opacity-70">使用 Solana 钱包连接以访问您的 NFT 资产、投资组合分析和财务仪表板。</p>
      <WalletMultiButton />
    </div>
  );
  
  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  // 渲染没有投资组合的状态
  const renderNoPortfolios = () => (
    <div className="text-center p-12 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">还没有投资组合</h2>
      <p className="mb-8 opacity-70">开始创建您的第一个 NFT 投资组合，或者探索我们的精选收藏。</p>
      <div className="flex gap-4 justify-center">
        <button className="btn-primary">创建投资组合</button>
        <button className="btn-secondary">探索精选</button>
      </div>
    </div>
  );
  
  // 渲染投资组合内容
  const renderPortfolioContent = () => {
    if (!currentPortfolio) return renderNoPortfolios();
    
    return (
      <div className="space-y-8">
        {/* 投资组合概览 */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentPortfolio.name}</h2>
              <p className="opacity-70 mb-4">总资产价值: {currentPortfolio.totalValue} SOL</p>
              
              <div className="flex gap-4">
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    currentPortfolio.performance.daily >= 0 ? 'text-tertiary' : 'text-red-500'
                  }`}>
                    {currentPortfolio.performance.daily > 0 ? '+' : ''}{currentPortfolio.performance.daily}%
                  </p>
                  <p className="text-xs opacity-70">今日</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    currentPortfolio.performance.weekly >= 0 ? 'text-tertiary' : 'text-red-500'
                  }`}>
                    {currentPortfolio.performance.weekly > 0 ? '+' : ''}{currentPortfolio.performance.weekly}%
                  </p>
                  <p className="text-xs opacity-70">本周</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    currentPortfolio.performance.monthly >= 0 ? 'text-tertiary' : 'text-red-500'
                  }`}>
                    {currentPortfolio.performance.monthly > 0 ? '+' : ''}{currentPortfolio.performance.monthly}%
                  </p>
                  <p className="text-xs opacity-70">本月</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="btn-primary">调整投资组合</button>
              <button className="btn-secondary">提取收益</button>
            </div>
          </div>
        </div>
        
        {/* 投资组合资产 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">投资组合资产</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentPortfolio.assets.map((nft, index) => (
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
        </div>
        
        {/* 推荐资产 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">为您推荐</h3>
          <p className="text-sm opacity-70 mb-6">根据您的投资组合和市场趋势，我们为您推荐以下资产：</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockNFTs
              .filter(nft => !currentPortfolio.assets.some(a => a.id === nft.id))
              .slice(0, 4)
              .map((nft, index) => (
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
        </div>
      </div>
    );
  };
  
  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              NFT 投资组合
            </h1>
            <p className="text-xl opacity-80 max-w-3xl mx-auto mb-8">
              管理您的 NFT 资产，查看投资业绩，优化投资策略
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Portfolio Tabs (if user has multiple portfolios) */}
      {connected && !isLoading && portfolios.length > 0 && (
        <section className="py-4 border-b border-white/10">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="flex overflow-x-auto no-scrollbar gap-4">
              {portfolios.map(portfolio => (
                <button
                  key={portfolio.id}
                  onClick={() => setActivePortfolio(portfolio.id)}
                  className={`px-4 py-2 whitespace-nowrap ${
                    activePortfolio === portfolio.id
                      ? 'text-white border-b-2 border-secondary'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {portfolio.name}
                </button>
              ))}
              <button className="px-4 py-2 text-primary whitespace-nowrap flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建投资组合
              </button>
            </div>
          </div>
        </section>
      )}
      
      {/* Main Content */}
      <section className="py-8">
        <div className="container px-4 mx-auto max-w-6xl">
          {!connected 
            ? renderNotConnected() 
            : isLoading 
              ? renderLoading() 
              : portfolios.length === 0 
                ? renderNoPortfolios() 
                : renderPortfolioContent()
          }
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default PortfolioPage; 