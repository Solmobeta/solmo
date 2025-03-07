use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};
use std::mem::size_of;

// Include governance modules
pub mod governance;
pub mod governance_processor;

declare_id!("FracSoLmosAicfr6ZGQXpMMbQFAmSoZH5QzJKvn8uh1N");

#[program]
pub mod solmosaic {
    use super::*;
    use crate::governance::*;
    use crate::governance_processor::*;

    // Initialize a new fractional share vault for an NFT
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        name: String,
        symbol: String,
        fractional_shares: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.nft_mint = ctx.accounts.nft_mint.key();
        vault.token_mint = ctx.accounts.token_mint.key();
        vault.name = name;
        vault.symbol = symbol;
        vault.fractional_shares = fractional_shares;
        vault.is_active = true;
        Ok(())
    }

    // Transfer NFT to vault and receive fractional tokens
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

    // Redeem fractional tokens to receive the full NFT
    pub fn redeem(ctx: Context<Redeem>) -> Result<()> {
        // Check if user has all fractional tokens
        let user_token_balance = ctx.accounts.user_token_account.amount;
        if user_token_balance != ctx.accounts.vault.fractional_shares {
            return Err(ErrorCode::InsufficientShares.into());
        }
        
        // Burn all fractional tokens
        let burn_ix = anchor_spl::token::Burn {
            mint: ctx.accounts.token_mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            burn_ix,
        );
        
        anchor_spl::token::burn(cpi_ctx, user_token_balance)?;
        
        // Transfer NFT back to user
        let transfer_ix = anchor_spl::token::Transfer {
            from: ctx.accounts.vault_nft_account.to_account_info(),
            to: ctx.accounts.user_nft_account.to_account_info(),
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
            transfer_ix,
            signer_seeds,
        );
        
        anchor_spl::token::transfer(cpi_ctx, 1)?;
        
        // Deactivate vault
        let vault = &mut ctx.accounts.vault;
        vault.is_active = false;
        
        Ok(())
    }

    // Initialize a new lending pool for NFT collaterals
    pub fn initialize_lending_pool(
        ctx: Context<InitializeLendingPool>,
        lending_rate: u64,
        liquidation_threshold: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.lending_pool;
        pool.authority = ctx.accounts.authority.key();
        pool.lending_token_mint = ctx.accounts.lending_token_mint.key();
        pool.lending_rate = lending_rate;
        pool.liquidation_threshold = liquidation_threshold;
        pool.total_deposits = 0;
        pool.total_loans = 0;
        pool.is_active = true;
        Ok(())
    }

    // Deposit liquidity to lending pool
    pub fn deposit_to_pool(ctx: Context<DepositToPool>, amount: u64) -> Result<()> {
        // Transfer tokens from user to pool
        let transfer_ix = anchor_spl::token::Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_ix,
        );
        
        anchor_spl::token::transfer(cpi_ctx, amount)?;
        
        // Update pool status
        let pool = &mut ctx.accounts.lending_pool;
        pool.total_deposits = pool.total_deposits.checked_add(amount).ok_or(ErrorCode::MathOverflow)?;
        
        // Record user deposit
        let deposit = &mut ctx.accounts.user_deposit;
        deposit.owner = ctx.accounts.authority.key();
        deposit.lending_pool = ctx.accounts.lending_pool.key();
        deposit.amount = deposit.amount.checked_add(amount).ok_or(ErrorCode::MathOverflow)?;
        deposit.timestamp = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    // Take a loan against NFT collateral
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
        
        let pool_seeds = &[
            b"lending_pool".as_ref(),
            ctx.accounts.lending_pool.lending_token_mint.as_ref(),
            &[ctx.bumps.lending_pool],
        ];
        
        let signer_seeds = &[&pool_seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            loan_transfer_ix,
            signer_seeds,
        );
        
        anchor_spl::token::transfer(cpi_ctx, loan_amount)?;
        
        // Record loan details
        let loan = &mut ctx.accounts.loan;
        loan.borrower = ctx.accounts.authority.key();
        loan.lending_pool = ctx.accounts.lending_pool.key();
        loan.collateral_mint = ctx.accounts.nft_mint.key();
        loan.collateral_account = ctx.accounts.collateral_account.key();
        loan.loan_amount = loan_amount;
        loan.collateral_value = collateral_value;
        loan.start_time = Clock::get()?.unix_timestamp;
        loan.is_active = true;
        
        // Update pool status
        let pool = &mut ctx.accounts.lending_pool;
        pool.total_loans = pool.total_loans.checked_add(loan_amount).ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    // Repay loan and reclaim NFT collateral
    pub fn repay_loan(ctx: Context<RepayLoan>, amount: u64) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        
        // Check if the loan is active
        if !loan.is_active {
            return Err(ErrorCode::LoanNotActive.into());
        }
        
        // Calculate interest
        let current_time = Clock::get()?.unix_timestamp;
        let time_diff = (current_time - loan.start_time) as u64;
        let seconds_per_year = 31536000_u64; // 365 days * 24 hours * 60 minutes * 60 seconds
        
        let interest = loan.loan_amount
            .checked_mul(ctx.accounts.lending_pool.lending_rate).ok_or(ErrorCode::MathOverflow)?
            .checked_mul(time_diff).ok_or(ErrorCode::MathOverflow)?
            .checked_div(seconds_per_year).ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000).ok_or(ErrorCode::MathOverflow)?; // lending_rate is in basis points (1/100 of a percent)
        
        let total_repayment = loan.loan_amount.checked_add(interest).ok_or(ErrorCode::MathOverflow)?;
        
        // Check if repayment amount is sufficient
        if amount < total_repayment {
            return Err(ErrorCode::InsufficientRepayment.into());
        }
        
        // Transfer repayment from user to pool
        let transfer_ix = anchor_spl::token::Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_ix,
        );
        
        anchor_spl::token::transfer(cpi_ctx, total_repayment)?;
        
        // Return NFT collateral to user
        let collateral_return_ix = anchor_spl::token::Transfer {
            from: ctx.accounts.collateral_account.to_account_info(),
            to: ctx.accounts.user_nft_account.to_account_info(),
            authority: ctx.accounts.loan.to_account_info(),
        };
        
        let loan_seeds = &[
            b"loan".as_ref(),
            ctx.accounts.loan.borrower.as_ref(),
            ctx.accounts.loan.collateral_mint.as_ref(),
            &[ctx.bumps.loan],
        ];
        
        let signer_seeds = &[&loan_seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            collateral_return_ix,
            signer_seeds,
        );
        
        anchor_spl::token::transfer(cpi_ctx, 1)?;
        
        // Update loan status
        loan.is_active = false;
        
        // Update pool status
        let pool = &mut ctx.accounts.lending_pool;
        pool.total_loans = pool.total_loans.checked_sub(loan.loan_amount).ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    // Initialize the NFT collection rating system
    pub fn initialize_rating_system(
        ctx: Context<InitializeRatingSystem>,
        name: String,
    ) -> Result<()> {
        let system = &mut ctx.accounts.rating_system;
        system.authority = ctx.accounts.authority.key();
        system.name = name;
        system.total_collections = 0;
        system.is_active = true;
        Ok(())
    }

    // Register a collection for rating
    pub fn register_collection(
        ctx: Context<RegisterCollection>,
        collection_name: String,
        collection_symbol: String,
        creator_address: Pubkey,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        collection.name = collection_name;
        collection.symbol = collection_symbol;
        collection.creator = creator_address;
        collection.rating_system = ctx.accounts.rating_system.key();
        collection.rarity_score = 0;
        collection.liquidity_score = 0;
        collection.community_score = 0;
        collection.total_score = 0;
        collection.is_verified = false;
        
        // Update system counter
        let system = &mut ctx.accounts.rating_system;
        system.total_collections = system.total_collections.checked_add(1).ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    // Update collection ratings
    pub fn update_collection_rating(
        ctx: Context<UpdateCollectionRating>,
        rarity_score: u64,
        liquidity_score: u64,
        community_score: u64,
    ) -> Result<()> {
        // Only authority can update ratings
        if ctx.accounts.authority.key() != ctx.accounts.rating_system.authority {
            return Err(ErrorCode::UnauthorizedRatingUpdate.into());
        }
        
        let collection = &mut ctx.accounts.collection;
        collection.rarity_score = rarity_score;
        collection.liquidity_score = liquidity_score;
        collection.community_score = community_score;
        
        // Calculate total score - weighted average
        collection.total_score = rarity_score
            .checked_mul(40).ok_or(ErrorCode::MathOverflow)? // 40% weight for rarity
            .checked_add(liquidity_score.checked_mul(40).ok_or(ErrorCode::MathOverflow)?).ok_or(ErrorCode::MathOverflow)? // 40% weight for liquidity
            .checked_add(community_score.checked_mul(20).ok_or(ErrorCode::MathOverflow)?).ok_or(ErrorCode::MathOverflow)? // 20% weight for community
            .checked_div(100).ok_or(ErrorCode::MathOverflow)?;
            
        Ok(())
    }

    // Verify a collection (grants higher loan-to-value ratios)
    pub fn verify_collection(ctx: Context<VerifyCollection>) -> Result<()> {
        // Only authority can verify collections
        if ctx.accounts.authority.key() != ctx.accounts.rating_system.authority {
            return Err(ErrorCode::UnauthorizedRatingUpdate.into());
        }
        
        let collection = &mut ctx.accounts.collection;
        collection.is_verified = true;
        
        Ok(())
    }

    // Governance module functions
    pub fn initialize_governance(
        ctx: Context<InitializeGovernance>,
        name: String,
        min_vote_threshold: u64,
        voting_period: i64,
    ) -> Result<()> {
        governance_processor::initialize_governance(ctx, name, min_vote_threshold, voting_period)
    }

    pub fn create_community(
        ctx: Context<CreateCommunity>,
        name: String,
        description: String,
    ) -> Result<()> {
        governance_processor::create_community(ctx, name, description)
    }

    pub fn join_community(ctx: Context<JoinCommunity>) -> Result<()> {
        governance_processor::join_community(ctx)
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        is_investment_proposal: bool,
        target_collection: Option<Pubkey>,
        investment_amount: Option<u64>,
    ) -> Result<()> {
        governance_processor::create_proposal(ctx, title, description, is_investment_proposal, target_collection, investment_amount)
    }

    pub fn cast_vote(
        ctx: Context<CastVote>,
        vote_type: VoteType,
    ) -> Result<()> {
        governance_processor::cast_vote(ctx, vote_type)
    }

    pub fn finalize_proposal(ctx: Context<FinalizeProposal>) -> Result<()> {
        governance_processor::finalize_proposal(ctx)
    }

    pub fn execute_proposal(ctx: Context<ExecuteProposal>) -> Result<()> {
        governance_processor::execute_proposal(ctx)
    }

    pub fn create_faction(
        ctx: Context<CreateFaction>,
        name: String,
        description: String,
        investment_strategy: String,
    ) -> Result<()> {
        governance_processor::create_faction(ctx, name, description, investment_strategy)
    }

    pub fn join_faction(ctx: Context<JoinFaction>) -> Result<()> {
        governance_processor::join_faction(ctx)
    }

    pub fn create_investment_strategy(
        ctx: Context<CreateInvestmentStrategy>,
        name: String,
        description: String,
        risk_level: u8,
        target_collections: Vec<Pubkey>,
        allocation_percentages: Vec<u8>,
    ) -> Result<()> {
        governance_processor::create_investment_strategy(ctx, name, description, risk_level, target_collections, allocation_percentages)
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, fractional_shares: u64)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + size_of::<FractionalVault>(),
        seeds = [b"vault".as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, FractionalVault>,
    
    pub nft_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = vault,
    )]
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Fractionalize<'info> {
    #[account(
        mut,
        seeds = [b"vault".as_ref(), vault.nft_mint.as_ref()],
        bump,
        has_one = nft_mint,
        has_one = token_mint,
        constraint = vault.is_active
    )]
    pub vault: Account<'info, FractionalVault>,
    
    pub nft_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(
        mut,
        constraint = nft_token_account.mint == nft_mint.key(),
        constraint = nft_token_account.owner == authority.key()
    )]
    pub nft_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = vault_nft_account.mint == nft_mint.key(),
        constraint = vault_nft_account.owner == vault.key()
    )]
    pub vault_nft_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = user_token_account.mint == token_mint.key(),
        constraint = user_token_account.owner == authority.key()
    )]
    pub user_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(
        mut,
        seeds = [b"vault".as_ref(), vault.nft_mint.as_ref()],
        bump,
        has_one = nft_mint,
        has_one = token_mint,
        constraint = vault.is_active
    )]
    pub vault: Account<'info, FractionalVault>,
    
    pub nft_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(
        mut,
        constraint = user_token_account.mint == token_mint.key(),
        constraint = user_token_account.owner == authority.key()
    )]
    pub user_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = vault_nft_account.mint == nft_mint.key(),
        constraint = vault_nft_account.owner == vault.key()
    )]
    pub vault_nft_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = user_nft_account.mint == nft_mint.key(),
        constraint = user_nft_account.owner == authority.key()
    )]
    pub user_nft_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(lending_rate: u64, liquidation_threshold: u64)]
pub struct InitializeLendingPool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + size_of::<LendingPool>(),
        seeds = [b"lending_pool".as_ref(), lending_token_mint.key().as_ref()],
        bump
    )]
    pub lending_pool: Account<'info, LendingPool>,
    
    pub lending_token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct DepositToPool<'info> {
    #[account(
        mut,
        seeds = [b"lending_pool".as_ref(), lending_pool.lending_token_mint.as_ref()],
        bump,
        constraint = lending_pool.is_active
    )]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + size_of::<UserDeposit>(),
        seeds = [b"user_deposit".as_ref(), authority.key().as_ref(), lending_pool.key().as_ref()],
        bump
    )]
    pub user_deposit: Account<'info, UserDeposit>,
    
    #[account(
        mut,
        constraint = user_token_account.mint == lending_pool.lending_token_mint,
        constraint = user_token_account.owner == authority.key()
    )]
    pub user_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = pool_token_account.mint == lending_pool.lending_token_mint,
        constraint = pool_token_account.owner == lending_pool.key()
    )]
    pub pool_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(loan_amount: u64, collateral_value: u64)]
pub struct TakeLoan<'info> {
    #[account(
        mut,
        seeds = [b"lending_pool".as_ref(), lending_pool.lending_token_mint.as_ref()],
        bump,
        constraint = lending_pool.is_active
    )]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + size_of::<Loan>(),
        seeds = [b"loan".as_ref(), authority.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub loan: Account<'info, Loan>,
    
    pub nft_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(
        mut,
        constraint = user_nft_account.mint == nft_mint.key(),
        constraint = user_nft_account.owner == authority.key()
    )]
    pub user_nft_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = collateral_account.mint == nft_mint.key(),
        constraint = collateral_account.owner == loan.key()
    )]
    pub collateral_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = user_token_account.mint == lending_pool.lending_token_mint,
        constraint = user_token_account.owner == authority.key()
    )]
    pub user_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = pool_token_account.mint == lending_pool.lending_token_mint,
        constraint = pool_token_account.owner == lending_pool.key()
    )]
    pub pool_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct RepayLoan<'info> {
    #[account(
        mut,
        seeds = [b"lending_pool".as_ref(), lending_pool.lending_token_mint.as_ref()],
        bump,
        constraint = lending_pool.is_active
    )]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(
        mut,
        seeds = [b"loan".as_ref(), loan.borrower.as_ref(), loan.collateral_mint.as_ref()],
        bump,
        constraint = loan.is_active,
        constraint = loan.borrower == authority.key(),
        constraint = loan.lending_pool == lending_pool.key()
    )]
    pub loan: Account<'info, Loan>,
    
    #[account(
        mut,
        constraint = user_token_account.mint == lending_pool.lending_token_mint,
        constraint = user_token_account.owner == authority.key()
    )]
    pub user_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = pool_token_account.mint == lending_pool.lending_token_mint,
        constraint = pool_token_account.owner == lending_pool.key()
    )]
    pub pool_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = collateral_account.mint == loan.collateral_mint,
        constraint = collateral_account.owner == loan.key()
    )]
    pub collateral_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(
        mut,
        constraint = user_nft_account.mint == loan.collateral_mint,
        constraint = user_nft_account.owner == authority.key()
    )]
    pub user_nft_account: Account<'info, anchor_spl::token::TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeRatingSystem<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + size_of::<RatingSystem>(),
        seeds = [b"rating_system".as_ref(), authority.key().as_ref()],
        bump
    )]
    pub rating_system: Account<'info, RatingSystem>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(collection_name: String, collection_symbol: String, creator_address: Pubkey)]
pub struct RegisterCollection<'info> {
    #[account(
        mut,
        seeds = [b"rating_system".as_ref(), rating_system.authority.as_ref()],
        bump,
        constraint = rating_system.is_active
    )]
    pub rating_system: Account<'info, RatingSystem>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + size_of::<CollectionRating>(),
        seeds = [b"collection".as_ref(), rating_system.key().as_ref(), collection_name.as_bytes()],
        bump
    )]
    pub collection: Account<'info, CollectionRating>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(rarity_score: u64, liquidity_score: u64, community_score: u64)]
pub struct UpdateCollectionRating<'info> {
    #[account(
        seeds = [b"rating_system".as_ref(), rating_system.authority.as_ref()],
        bump,
        constraint = rating_system.is_active
    )]
    pub rating_system: Account<'info, RatingSystem>,
    
    #[account(
        mut,
        seeds = [b"collection".as_ref(), rating_system.key().as_ref(), collection.name.as_bytes()],
        bump,
        constraint = collection.rating_system == rating_system.key()
    )]
    pub collection: Account<'info, CollectionRating>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyCollection<'info> {
    #[account(
        seeds = [b"rating_system".as_ref(), rating_system.authority.as_ref()],
        bump,
        constraint = rating_system.is_active
    )]
    pub rating_system: Account<'info, RatingSystem>,
    
    #[account(
        mut,
        seeds = [b"collection".as_ref(), rating_system.key().as_ref(), collection.name.as_bytes()],
        bump,
        constraint = collection.rating_system == rating_system.key()
    )]
    pub collection: Account<'info, CollectionRating>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[account]
pub struct FractionalVault {
    pub authority: Pubkey,
    pub nft_mint: Pubkey,
    pub token_mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub fractional_shares: u64,
    pub is_active: bool,
}

#[account]
pub struct LendingPool {
    pub authority: Pubkey,
    pub lending_token_mint: Pubkey,
    pub lending_rate: u64,        // In basis points (1/100 of a percent)
    pub liquidation_threshold: u64, // LTV threshold for liquidation in percentage
    pub total_deposits: u64,
    pub total_loans: u64,
    pub is_active: bool,
}

#[account]
pub struct UserDeposit {
    pub owner: Pubkey,
    pub lending_pool: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub lending_pool: Pubkey,
    pub collateral_mint: Pubkey,
    pub collateral_account: Pubkey,
    pub loan_amount: u64,
    pub collateral_value: u64,
    pub start_time: i64,
    pub is_active: bool,
}

#[account]
pub struct RatingSystem {
    pub authority: Pubkey,
    pub name: String,
    pub total_collections: u64,
    pub is_active: bool,
}

#[account]
pub struct CollectionRating {
    pub name: String,
    pub symbol: String,
    pub creator: Pubkey,
    pub rating_system: Pubkey,
    pub rarity_score: u64,     // 0-100 based on rarity attributes
    pub liquidity_score: u64,  // 0-100 based on trading volume and frequency
    pub community_score: u64,  // 0-100 based on community metrics
    pub total_score: u64,      // Weighted average of all scores
    pub is_verified: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("User doesn't have all fractional shares to redeem the NFT")]
    InsufficientShares,
    #[msg("Math operation resulted in overflow")]
    MathOverflow,
    #[msg("Insufficient liquidity in the lending pool")]
    InsufficientPoolLiquidity,
    #[msg("Collateral value is too low for the requested loan amount")]
    InsufficientCollateralValue,
    #[msg("Loan is not active")]
    LoanNotActive,
    #[msg("Repayment amount is insufficient to cover loan plus interest")]
    InsufficientRepayment,
    #[msg("Only rating system authority can update collection ratings")]
    UnauthorizedRatingUpdate,
} 