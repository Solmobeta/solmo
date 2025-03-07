'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { mockNFTs } from '@/mockData';

const FractionalPage = () => {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [fractionCount, setFractionCount] = useState(10);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  
  // 选择NFT进行分形
  const handleSelectNFT = (nft: NFT) => {
    setSelectedNFT(nft);
    // 重置分形和购买值
    setFractionCount(10);
    setPurchaseAmount(1);
  };
  
  // 计算每个分形碎片价格
  const calculateFractionPrice = () => {
    if (!selectedNFT || fractionCount <= 0) return 0;
    return selectedNFT.price / fractionCount;
  };
  
  // 计算购买总价
  const calculateTotalPrice = () => {
    return calculateFractionPrice() * purchaseAmount;
  };
  
  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-tertiary/20 to-background">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              液体分形所有权
            </h1>
            <p className="text-xl opacity-80 max-w-3xl mx-auto mb-8">
              分割 NFT 所有权，降低入场门槛，增加流动性，创造微型收藏市场
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Feature Highlights */}
      <section className="py-12">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card text-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center text-2xl mx-auto mb-4">
                🧩
              </div>
              <h3 className="text-xl font-semibold mb-2">动态碎片化</h3>
              <p className="opacity-70">根据 NFT 特性和市场价值自动优化碎片数量，最大化流动性</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card text-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center text-2xl mx-auto mb-4">
                🔍
              </div>
              <h3 className="text-xl font-semibold mb-2">局部权益</h3>
              <p className="opacity-70">可购买 NFT 的指定部分，如数字艺术品的某个象限，创造微型收藏市场</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card text-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center text-2xl mx-auto mb-4">
                🔒
              </div>
              <h3 className="text-xl font-semibold mb-2">渐进所有权</h3>
              <p className="opacity-70">通过时间锁定机制，长期持有者获得更多的所有权权重和治理权</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Fractional NFT Interface */}
      <section className="py-12">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">创建或购买分形 NFT</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* NFT Selection */}
            <div className="lg:w-1/3">
              <h3 className="text-xl font-semibold mb-4">选择 NFT</h3>
              <div className="h-96 overflow-y-auto pr-2 space-y-4">
                {mockNFTs.map(nft => (
                  <motion.div
                    key={nft.id}
                    className={`card p-4 cursor-pointer transition-all ${
                      selectedNFT?.id === nft.id 
                        ? 'border-tertiary'
                        : 'hover:border-white/30'
                    }`}
                    onClick={() => handleSelectNFT(nft)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-16 w-16 bg-cover bg-center rounded-md" 
                        style={{ backgroundImage: `url(${nft.image.replace('placeholder', 'QmNLr4G7XUAK6ykG4janpvB2MLnwyVmZKPaM5sxTpHG8zz')})` }}
                      />
                      <div>
                        <h4 className="font-semibold">{nft.name}</h4>
                        <p className="text-sm opacity-70">价值: {nft.price} SOL</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Fractionalization Controls */}
            <div className="lg:w-1/3 card p-6">
              <h3 className="text-xl font-semibold mb-6">分形设置</h3>
              
              {selectedNFT ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm opacity-70 mb-2">已选择 NFT</label>
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="h-20 w-20 bg-cover bg-center rounded-md" 
                        style={{ backgroundImage: `url(${selectedNFT.image.replace('placeholder', 'QmNLr4G7XUAK6ykG4janpvB2MLnwyVmZKPaM5sxTpHG8zz')})` }}
                      />
                      <div>
                        <h4 className="font-semibold">{selectedNFT.name}</h4>
                        <p className="text-sm opacity-70">价值: {selectedNFT.price} SOL</p>
                        <p className="text-sm opacity-70">创作者: {selectedNFT.creator}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm opacity-70 mb-2">分形数量</label>
                    <input 
                      type="range" 
                      min="2" 
                      max="100" 
                      value={fractionCount} 
                      onChange={(e) => setFractionCount(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>2</span>
                      <span>{fractionCount}</span>
                      <span>100</span>
                    </div>
                    <p className="text-sm mt-2">
                      每份价格: <span className="text-tertiary font-semibold">{calculateFractionPrice().toFixed(4)} SOL</span>
                    </p>
                  </div>
                  
                  <div>
                    <button className="btn-primary w-full py-3">
                      创建分形 NFT
                    </button>
                    <p className="text-xs opacity-70 text-center mt-2">
                      创建后，你将收到相应数量的分形代币
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 opacity-70">
                  <p>请先从左侧选择一个 NFT</p>
                </div>
              )}
            </div>
            
            {/* Purchase Interface */}
            <div className="lg:w-1/3 card p-6">
              <h3 className="text-xl font-semibold mb-6">购买分形份额</h3>
              
              {selectedNFT ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm opacity-70 mb-2">购买数量</label>
                    <div className="flex items-center">
                      <button 
                        className="bg-background/50 hover:bg-background/80 w-10 h-10 flex items-center justify-center rounded-l-lg border border-white/10"
                        onClick={() => setPurchaseAmount(Math.max(1, purchaseAmount - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        max={fractionCount} 
                        value={purchaseAmount} 
                        onChange={(e) => setPurchaseAmount(Math.min(fractionCount, Math.max(1, Number(e.target.value))))}
                        className="bg-background/30 border-y border-white/10 h-10 w-16 text-center focus:outline-none"
                      />
                      <button 
                        className="bg-background/50 hover:bg-background/80 w-10 h-10 flex items-center justify-center rounded-r-lg border border-white/10"
                        onClick={() => setPurchaseAmount(Math.min(fractionCount, purchaseAmount + 1))}
                      >
                        +
                      </button>
                      <span className="ml-2 text-sm opacity-70">/ {fractionCount} 份</span>
                    </div>
                  </div>
                  
                  <div className="py-4 border-t border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="opacity-70">单价</span>
                      <span>{calculateFractionPrice().toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="opacity-70">数量</span>
                      <span>{purchaseAmount}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>总价</span>
                      <span className="text-tertiary">{calculateTotalPrice().toFixed(4)} SOL</span>
                    </div>
                  </div>
                  
                  <div>
                    <button className="btn-tertiary w-full py-3">
                      购买分形份额
                    </button>
                    <p className="text-xs opacity-70 text-center mt-2">
                      购买后，你将获得对应份额的所有权权益
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 opacity-70">
                  <p>请先从左侧选择一个 NFT</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Explainer Section */}
      <section className="py-16 bg-gradient-to-b from-background to-background/90">
        <div className="container px-4 mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">分形所有权如何运作？</h2>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-3">1. 创建分形 NFT</h3>
              <p className="opacity-70">
                NFT 持有者可以将其 NFT 托管到我们的智能合约中，并设定分形数量。系统会根据 NFT 的属性和市场价值提供建议的分形数量，以最大化流动性。
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-3">2. 获取分形代币</h3>
              <p className="opacity-70">
                创建者会收到相应数量的 ERC-20 分形代币，代表 NFT 的所有权份额。这些代币可以在开放市场上交易，或者通过我们的平台直接出售。
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-3">3. 分形NFT的权益</h3>
              <p className="opacity-70">
                分形持有者可以获得多种权益，包括：收益分配（如版税）、治理权（对 NFT 的展示和使用进行投票）、社区特权等。持有份额越多，获得的权益越大。
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-3">4. 赎回原始 NFT</h3>
              <p className="opacity-70">
                如果某个用户收集了 100% 的分形代币，他们可以赎回原始 NFT，将其从合约中提取出来。这确保了 NFT 的完整性和长期价值保存。
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default FractionalPage; 