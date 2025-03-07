// 模拟 NFT 数据
export const mockNFTs: NFT[] = [
  {
    id: '1',
    name: '宇宙探险家 #001',
    description: '一个来自数字星系的探险家，寻找稀有的区块链奇迹。',
    image: 'https://arweave.net/placeholder1',
    creator: 'Studio Nebula',
    owner: 'user1',
    price: 2.5,
    collection: 'art',
    attributes: [
      { trait_type: '背景', value: '深空' },
      { trait_type: '种族', value: '人类' },
      { trait_type: '装备', value: '太空服' },
      { trait_type: '稀有度', value: '稀有' }
    ]
  },
  {
    id: '2',
    name: '赛博朋克街头 #042',
    description: '在霓虹闪烁的未来城市中，一位神秘的数字流浪者。',
    image: 'https://arweave.net/placeholder2',
    creator: 'DigitalFuture',
    owner: 'user2',
    price: 1.8,
    collection: 'art',
    attributes: [
      { trait_type: '背景', value: '城市夜景' },
      { trait_type: '种族', value: '赛博格' },
      { trait_type: '装备', value: '霓虹夹克' },
      { trait_type: '稀有度', value: '普通' }
    ]
  },
  {
    id: '3',
    name: '魔法学院学生 #137',
    description: '来自魔法世界的年轻学徒，掌握着元素魔法。',
    image: 'https://arweave.net/placeholder3',
    creator: 'MagicRealm',
    owner: 'user3',
    price: 3.2,
    collection: 'gaming',
    attributes: [
      { trait_type: '背景', value: '魔法学院' },
      { trait_type: '种族', value: '精灵' },
      { trait_type: '装备', value: '法师长袍' },
      { trait_type: '稀有度', value: '史诗' }
    ]
  },
  {
    id: '4',
    name: '元宇宙建筑师 #089',
    description: '虚拟世界的创造者，设计数字领域的宏伟建筑。',
    image: 'https://arweave.net/placeholder4',
    creator: 'MetaBuild',
    owner: 'user4',
    price: 5.0,
    collection: 'metaverse',
    attributes: [
      { trait_type: '背景', value: '数字蓝图' },
      { trait_type: '种族', value: 'AI' },
      { trait_type: '装备', value: '全息工具' },
      { trait_type: '稀有度', value: '传奇' }
    ]
  },
  {
    id: '5',
    name: '像素冒险家 #210',
    description: '复古风格的像素角色，来自经典游戏世界。',
    image: 'https://arweave.net/placeholder5',
    creator: 'RetroPixel',
    owner: 'user5',
    price: 1.5,
    collection: 'gaming',
    attributes: [
      { trait_type: '背景', value: '像素森林' },
      { trait_type: '种族', value: '人类' },
      { trait_type: '装备', value: '像素剑盾' },
      { trait_type: '稀有度', value: '普通' }
    ]
  },
  {
    id: '6',
    name: '未来运动员 #055',
    description: '来自2150年的职业电子运动员，多次世界冠军。',
    image: 'https://arweave.net/placeholder6',
    creator: 'FutureSports',
    owner: 'user6',
    price: 2.8,
    collection: 'gaming',
    attributes: [
      { trait_type: '背景', value: '竞技场' },
      { trait_type: '种族', value: '改造人类' },
      { trait_type: '装备', value: '神经接口' },
      { trait_type: '稀有度', value: '稀有' }
    ]
  },
  {
    id: '7',
    name: '抽象思维 #023',
    description: '无法用传统语言描述的抽象艺术表达。',
    image: 'https://arweave.net/placeholder7',
    creator: 'AbstractMinds',
    owner: 'user7',
    price: 4.2,
    collection: 'art',
    attributes: [
      { trait_type: '风格', value: '抽象主义' },
      { trait_type: '色彩', value: '多彩' },
      { trait_type: '技法', value: '数字油彩' },
      { trait_type: '稀有度', value: '史诗' }
    ]
  },
  {
    id: '8',
    name: '数字土地 #A451',
    description: '元宇宙中的优质地段，位于繁华中心区域。',
    image: 'https://arweave.net/placeholder8',
    creator: 'MetaRealEstate',
    owner: 'user8',
    price: 8.5,
    collection: 'metaverse',
    attributes: [
      { trait_type: '类型', value: '商业用地' },
      { trait_type: '位置', value: '中心区' },
      { trait_type: '面积', value: '大型' },
      { trait_type: '稀有度', value: '传奇' }
    ]
  }
];

// 模拟收藏集数据
export const mockCollections = [
  {
    id: 'art',
    name: '数字艺术',
    description: '由顶尖数字艺术家创作的独特作品集',
    image: 'https://arweave.net/collection1',
    creator: 'ArtDAO',
    floorPrice: 1.5,
    volumeTraded: 5420,
    items: 1000,
    holders: 450
  },
  {
    id: 'gaming',
    name: '游戏角色',
    description: '可在多个虚拟世界中使用的游戏角色和物品',
    image: 'https://arweave.net/collection2',
    creator: 'GameStudios',
    floorPrice: 1.2,
    volumeTraded: 3250,
    items: 2500,
    holders: 830
  },
  {
    id: 'metaverse',
    name: '元宇宙资产',
    description: '元宇宙中的虚拟土地、建筑和其他资产',
    image: 'https://arweave.net/collection3',
    creator: 'MetaFoundation',
    floorPrice: 4.8,
    volumeTraded: 12800,
    items: 500,
    holders: 320
  }
];

// 模拟投资组合数据
export const mockPortfolios = [
  {
    id: 'p1',
    name: '蓝筹NFT组合',
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
    name: '游戏资产组合',
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