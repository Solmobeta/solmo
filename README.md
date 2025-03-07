<div align="center">
  <svg xmlns="SVG namespace" viewBox="0 0 500 500" width="200">
    <!-- Background -->
    <rect width="500" height="500" fill="#ffffff"/>
    <!-- Floating Block Composition -->
    <g transform="rotate(-10, 250, 250)">
      <rect x="170" y="170" width="60" height="60" fill="#9945FF" opacity="0.8"/>
      <rect x="240" y="170" width="60" height="60" fill="#03E1FF" opacity="0.7"/>
      <rect x="310" y="170" width="60" height="60" fill="#14F195" opacity="0.9"/>
      <rect x="170" y="240" width="60" height="60" fill="#14F195" opacity="0.7"/>
      <rect x="240" y="240" width="60" height="60" fill="#9945FF" opacity="0.8"/>
      <rect x="310" y="240" width="60" height="60" fill="#03E1FF" opacity="0.6"/>
    </g>
    <!-- Central Circle Element -->
    <circle cx="250" cy="250" r="20" fill="#ffffff" stroke="#1E1E1E" stroke-width="3"/>
  </svg>

  <h1>SolMosaic</h1>
  <p>Revolutionary NFT Ecosystem & Financial Platform on Solana</p>
</div>

## Project Overview

SolMosaic is a comprehensive NFT ecosystem that integrates art, finance, and social functionalities. Through its unique modular design and dynamic smart contracts, it creates a new paradigm for combining NFTs with DeFi.

### Core Innovations

#### 1. Dynamic NFT Portfolio (D-Folio)
- **Adaptive Investment Algorithm**: Utilizes AI to analyze on-chain data, identifying emerging collection trends and value opportunities
- **Risk Balancing Mechanism**: Automatically adjusts the ratio of blue-chip to emerging NFTs, optimizing allocations based on market cycles
- **Categorized Investment Pools**: NFTs are segmented into art, gaming, metaverse real estate, and other tracks, allowing users to flexibly choose investment preferences
- **Synthetic Index**: Creates the first comprehensive index for the Solana NFT market, becoming an industry standard reference

#### 2. Liquid Fractal Ownership
- **Dynamic Fragmentation**: Automatically optimizes fragment quantities based on NFT characteristics and market value
- **Partial Rights**: Purchase specific parts of an NFT (such as a quadrant of digital artwork), creating micro-collection markets
- **Progressive Ownership**: Through time-locking mechanisms, long-term holders gain more ownership weight
- **Proof of Equity**: Holders can display partial ownership proof as social identity and membership credentials

#### 3. NFT Financial Innovation System
- **Multi-dimensional Collateral Mechanism**: NFT collection rating system evaluating rarity, liquidity, community activity, and other parameters
- **NFT Derivatives Market**: Creates NFT options and futures markets for risk hedging
- **NFT Yield Farming**: NFTs generate passive income through royalties, rentals, and traffic sharing
- **Zero-Knowledge Lending**: Anonymous NFT collateralized lending, protecting collector privacy

#### 4. Community Governance
- **Community Curation Model**: Professional curators and community members jointly decide investment directions with a two-tier governance structure
- **Reputation System**: A reputation network built on investment performance and community contributions
- **NFT Social Graph**: Visual representation of NFT ownership networks and community relationships
- **Activity Rewards**: Dynamic reward system based on participation and contribution levels

## Project Structure

```
solmosaic/
├── app/                       # Next.js application
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React contexts for state management
│   ├── explore/               # NFT exploration interfaces
│   ├── fractional/            # Fractional ownership features
│   ├── portfolio/             # User portfolio management
│   ├── profile/               # User profile and settings
│   ├── token-launch/          # Token creation and launch tools
│   └── utils/                 # Utility functions
├── contracts/                 # Solana smart contracts
│   ├── programs/              # Contract programs using Anchor framework
│   │   └── solmosaic/         # Main SolMosaic program
│   │       └── src/           # Contract source code
│   └── Anchor.toml            # Anchor configuration
├── public/                    # Static assets
│   └── images/                # Image assets including NFT examples
└── tools/                     # Development and deployment tools
```

## Technical Architecture

SolMosaic combines cutting-edge technologies across frontend, blockchain, and data layers:

### Frontend Architecture
- **Framework**: Next.js with React 18 for SSR and optimal performance
- **Styling**: TailwindCSS for responsive design
- **State Management**: React Context API with custom hooks
- **Wallet Integration**: Solana Wallet Adapter for seamless wallet connections

### Blockchain Architecture
- **Network**: Solana for high-throughput, low-cost transactions
- **Smart Contracts**: Anchor framework for Rust-based program development
- **Token Standards**: SPL Token and Metaplex NFT standards
- **Cross-chain**: Support for bridging to Ethereum and other networks (future)

### Data Architecture
- **Storage**: Arweave for decentralized, permanent storage of NFT media
- **Indexing**: Custom indexer for efficient NFT and transaction data retrieval
- **Analytics**: On-chain and off-chain data analysis for market trends

## Technical Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                         User Interface                            │
│                                                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐       │
│  │  Portfolio  │      │  Fractional │      │  Community  │       │
│  │  Management │      │  Ownership  │      │  Governance │       │
│  └─────────────┘      └─────────────┘      └─────────────┘       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                       Application Logic                           │
│                                                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐       │
│  │    Wallet   │      │     Data    │      │   State     │       │
│  │ Integration │      │   Services  │      │ Management  │       │
│  └─────────────┘      └─────────────┘      └─────────────┘       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                       Blockchain Layer                            │
│                                                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐       │
│  │    Vault    │      │   Lending   │      │  Governance │       │
│  │   Contract  │      │  Contracts  │      │  Contracts  │       │
│  └─────────────┘      └─────────────┘      └─────────────┘       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                        Storage Layer                              │
│                                                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐       │
│  │   Solana    │      │   Arweave   │      │  Indexers & │       │
│  │ Blockchain  │      │  Storage    │      │   Oracles   │       │
│  └─────────────┘      └─────────────┘      └─────────────┘       │
└───────────────────────────────────────────────────────────────────┘
```

## Project Milestones

| Phase | Description | Status | Timeline |
|-------|-------------|--------|----------|
| **Research & Planning** | Market research, technical design, tokenomics | ✅ Completed | Dec 2023 - Jan 2024 |
| **Alpha Development** | Core smart contracts, basic UI implementation | ✅ Completed | Jan 2024 - Feb 2024 |
| **Beta Development** | Feature completion, testing, security audits | 🔄 In Progress | Feb 2024 - Apr 2024 |
| **Public Testnet** | Public testnet deployment, community testing | 🔜 Planned | Apr 2024 - May 2024 |
| **Mainnet Launch** | Production deployment, initial collections | 🔜 Planned | May 2024 - Jun 2024 |
| **Ecosystem Expansion** | Partnerships, additional features, scaling | 🔜 Planned | Jun 2024 onwards |

## Key Code Snippets

### NFT Fractionalization (Solana Contract)

```rust
pub fn fractionalize(ctx: Context<Fractionalize>) -> Result<()> {
    // Transfer NFT from user to vault
    let transfer_ix = anchor_spl::token::Transfer {
        from: ctx.accounts.nft_token_account.to_account_info(),
        to: ctx.accounts.vault_nft_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_ix,
    );
    
    anchor_spl::token::transfer(cpi_ctx, 1)?;
    
    // Mint fractional tokens to the user
    let mint_to_ix = anchor_spl::token::MintTo {
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };
    
    let vault_seeds = &[
        b"vault".as_ref(),
        ctx.accounts.vault.nft_mint.as_ref(),
        &[ctx.bumps.vault],
    ];
    
    let signer_seeds = &[&vault_seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        mint_to_ix,
        signer_seeds,
    );
    
    anchor_spl::token::mint_to(cpi_ctx, ctx.accounts.vault.fractional_shares)?;
    
    Ok(())
}
```

### Governance Proposal Creation

```rust
pub fn create_proposal(
    ctx: Context<CreateProposal>,
    title: String,
    description: String,
    is_investment_proposal: bool,
    target_collection: Option<Pubkey>,
    investment_amount: Option<u64>,
) -> Result<()> {
    // Check if user is a member of the community
    let membership = &ctx.accounts.membership;
    if !membership.is_active {
        return Err(GovernanceError::NotCommunityMember.into());
    }
    
    let community = &mut ctx.accounts.community;
    let proposal = &mut ctx.accounts.proposal;
    let governance = &ctx.accounts.governance;
    
    // Set up proposal details
    proposal.governance = governance.key();
    proposal.community = community.key();
    proposal.proposer = ctx.accounts.authority.key();
    proposal.title = title;
    proposal.description = description;
    proposal.status = ProposalStatus::Active;
    
    let current_time = Clock::get()?.unix_timestamp;
    proposal.start_time = current_time;
    proposal.end_time = current_time.checked_add(governance.voting_period)
        .ok_or(GovernanceError::MathOverflow)?;
    
    proposal.instruction_count = 0;
    proposal.for_votes = 0;
    proposal.against_votes = 0;
    proposal.abstain_votes = 0;
    proposal.executed_at = None;
    proposal.is_investment_proposal = is_investment_proposal;
    proposal.target_collection = target_collection;
    proposal.investment_amount = investment_amount;
    
    // Increment proposal count
    community.proposal_count = community.proposal_count.checked_add(1)
        .ok_or(GovernanceError::MathOverflow)?;
    
    // Update reputation score for proposal creation
    let reputation = &mut ctx.accounts.reputation;
    reputation.participation_score = reputation.participation_score.checked_add(25)
        .ok_or(GovernanceError::MathOverflow)?;
    reputation.last_updated = current_time;
    
    Ok(())
}
```

### NFT Collateralized Lending

```rust
pub fn take_loan(ctx: Context<TakeLoan>, loan_amount: u64, collateral_value: u64) -> Result<()> {
    // Check if the pool has enough liquidity
    if ctx.accounts.lending_pool.total_deposits.checked_sub(ctx.accounts.lending_pool.total_loans).unwrap_or(0) < loan_amount {
        return Err(ErrorCode::InsufficientPoolLiquidity.into());
    }
    
    // Check collateral value against loan amount
    if collateral_value < loan_amount.checked_mul(100).ok_or(ErrorCode::MathOverflow)?.checked_div(ctx.accounts.lending_pool.liquidation_threshold).ok_or(ErrorCode::MathOverflow)? {
        return Err(ErrorCode::InsufficientCollateralValue.into());
    }
    
    // Transfer NFT to collateral vault
    let transfer_ix = anchor_spl::token::Transfer {
        from: ctx.accounts.user_nft_account.to_account_info(),
        to: ctx.accounts.collateral_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_ix,
    );
    
    anchor_spl::token::transfer(cpi_ctx, 1)?;
    
    // Transfer loan amount to user
    let loan_transfer_ix = anchor_spl::token::Transfer {
        from: ctx.accounts.pool_token_account.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.lending_pool.to_account_info(),
    };
    
    // Record loan details and update pool status
    let loan = &mut ctx.accounts.loan;
    loan.borrower = ctx.accounts.authority.key();
    loan.lending_pool = ctx.accounts.lending_pool.key();
    loan.collateral_mint = ctx.accounts.nft_mint.key();
    loan.loan_amount = loan_amount;
    loan.is_active = true;
    
    Ok(())
}
```

## Quick Start

### Prerequisites

Ensure your system has installed:
- Node.js (v16 or higher)
- npm (v8 or higher)
- Solana CLI tools

### Installation and Startup

1. Clone the repository:
```bash
git clone https://github.com/SolMosaic/beta.git
cd beta
```

2. Install dependencies and start the development server:
```bash
chmod +x start-project.sh
./start-project.sh
```

Or manually execute the following steps:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

3. Open your browser and visit [http://localhost:3000](http://localhost:3000)

## Connecting Wallet

1. Install a supported Solana wallet (such as Phantom, Solflare, etc.)
2. Click the "Connect Wallet" button in the application
3. Select your wallet and authorize the connection

## Contributing

Contributions to the project are welcome! Please participate in project development by submitting issues or creating pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 