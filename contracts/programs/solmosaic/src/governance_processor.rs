use anchor_lang::prelude::*;
use crate::governance::*;

pub fn initialize_governance(
    ctx: Context<InitializeGovernance>,
    name: String,
    min_vote_threshold: u64,
    voting_period: i64,
) -> Result<()> {
    let governance = &mut ctx.accounts.governance;
    governance.authority = ctx.accounts.authority.key();
    governance.name = name;
    governance.min_vote_threshold = min_vote_threshold;
    governance.voting_period = voting_period;
    governance.proposal_count = 0;
    governance.total_communities = 0;
    governance.is_active = true;
    Ok(())
}

pub fn create_community(
    ctx: Context<CreateCommunity>,
    name: String,
    description: String,
) -> Result<()> {
    let governance = &mut ctx.accounts.governance;
    let community = &mut ctx.accounts.community;
    
    community.governance = governance.key();
    community.name = name;
    community.description = description;
    community.authority = ctx.accounts.authority.key();
    community.member_count = 1; // Creator is the first member
    community.proposal_count = 0;
    community.creation_time = Clock::get()?.unix_timestamp;
    community.is_active = true;
    
    // Create membership for community creator
    let membership = &mut ctx.accounts.membership;
    membership.community = community.key();
    membership.user = ctx.accounts.authority.key();
    membership.role = "admin".to_string();
    membership.voting_power = 100; // Admin starts with high voting power
    membership.join_time = Clock::get()?.unix_timestamp;
    membership.reputation_score = 100; // Initial reputation score
    membership.is_active = true;
    
    // Increment total communities counter
    governance.total_communities = governance.total_communities.checked_add(1)
        .ok_or(GovernanceError::MathOverflow)?;
    
    Ok(())
}

pub fn join_community(
    ctx: Context<JoinCommunity>,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let membership = &mut ctx.accounts.membership;
    
    membership.community = community.key();
    membership.user = ctx.accounts.user.key();
    membership.role = "member".to_string();
    membership.voting_power = 10; // New members start with base voting power
    membership.join_time = Clock::get()?.unix_timestamp;
    membership.reputation_score = 10; // Initial reputation score
    membership.is_active = true;
    
    // Increment community member count
    community.member_count = community.member_count.checked_add(1)
        .ok_or(GovernanceError::MathOverflow)?;
    
    // Initialize reputation score for new member
    let reputation = &mut ctx.accounts.reputation;
    reputation.user = ctx.accounts.user.key();
    reputation.governance = ctx.accounts.community.governance;
    reputation.investment_score = 0;
    reputation.participation_score = 10; // Initial participation score for joining
    reputation.contribution_score = 0;
    reputation.total_score = 10;
    reputation.last_updated = Clock::get()?.unix_timestamp;
    
    Ok(())
}

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
    
    // Recalculate total score
    reputation.total_score = reputation.investment_score
        .checked_add(reputation.participation_score).ok_or(GovernanceError::MathOverflow)?
        .checked_add(reputation.contribution_score).ok_or(GovernanceError::MathOverflow)?;
    
    // Create activity reward
    let reward = &mut ctx.accounts.activity_reward;
    reward.user = ctx.accounts.authority.key();
    reward.governance = governance.key();
    reward.reward_type = "proposal".to_string();
    reward.amount = 50; // Reward amount for creating a proposal
    reward.timestamp = current_time;
    reward.is_claimed = false;
    
    Ok(())
}

pub fn cast_vote(
    ctx: Context<CastVote>,
    vote_type: VoteType,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let membership = &ctx.accounts.membership;
    
    // Check if proposal is active
    if proposal.status != ProposalStatus::Active {
        return Err(GovernanceError::InvalidProposalState.into());
    }
    
    // Check if voting period is active
    let current_time = Clock::get()?.unix_timestamp;
    if current_time > proposal.end_time {
        return Err(GovernanceError::VotingEnded.into());
    }
    
    if current_time < proposal.start_time {
        return Err(GovernanceError::VotingNotStarted.into());
    }
    
    // Check if user is a member of the community
    if !membership.is_active || membership.community != proposal.community {
        return Err(GovernanceError::NotCommunityMember.into());
    }
    
    // Record vote
    let vote = &mut ctx.accounts.vote;
    vote.proposal = proposal.key();
    vote.voter = ctx.accounts.authority.key();
    vote.vote_type = vote_type;
    vote.voting_power = membership.voting_power;
    vote.vote_time = current_time;
    
    // Update proposal vote counts
    match vote_type {
        VoteType::For => {
            proposal.for_votes = proposal.for_votes.checked_add(membership.voting_power)
                .ok_or(GovernanceError::MathOverflow)?;
        },
        VoteType::Against => {
            proposal.against_votes = proposal.against_votes.checked_add(membership.voting_power)
                .ok_or(GovernanceError::MathOverflow)?;
        },
        VoteType::Abstain => {
            proposal.abstain_votes = proposal.abstain_votes.checked_add(membership.voting_power)
                .ok_or(GovernanceError::MathOverflow)?;
        },
    }
    
    // Update reputation score for voting
    let reputation = &mut ctx.accounts.reputation;
    reputation.participation_score = reputation.participation_score.checked_add(10)
        .ok_or(GovernanceError::MathOverflow)?;
    reputation.last_updated = current_time;
    
    // Recalculate total score
    reputation.total_score = reputation.investment_score
        .checked_add(reputation.participation_score).ok_or(GovernanceError::MathOverflow)?
        .checked_add(reputation.contribution_score).ok_or(GovernanceError::MathOverflow)?;
    
    // Create activity reward
    let reward = &mut ctx.accounts.activity_reward;
    reward.user = ctx.accounts.authority.key();
    reward.governance = ctx.accounts.governance.key();
    reward.reward_type = "vote".to_string();
    reward.amount = 10; // Reward amount for voting
    reward.timestamp = current_time;
    reward.is_claimed = false;
    
    Ok(())
}

pub fn finalize_proposal(
    ctx: Context<FinalizeProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let governance = &ctx.accounts.governance;
    
    // Check if voting period has ended
    let current_time = Clock::get()?.unix_timestamp;
    if current_time <= proposal.end_time {
        return Err(GovernanceError::VotingNotStarted.into());
    }
    
    // Check if proposal is still active
    if proposal.status != ProposalStatus::Active {
        return Err(GovernanceError::InvalidProposalState.into());
    }
    
    // Calculate total votes
    let total_votes = proposal.for_votes
        .checked_add(proposal.against_votes).ok_or(GovernanceError::MathOverflow)?
        .checked_add(proposal.abstain_votes).ok_or(GovernanceError::MathOverflow)?;
    
    // Check if vote threshold was reached
    if total_votes < governance.min_vote_threshold {
        proposal.status = ProposalStatus::Defeated;
        return Err(GovernanceError::ThresholdNotReached.into());
    }
    
    // Determine outcome
    if proposal.for_votes > proposal.against_votes {
        proposal.status = ProposalStatus::Succeeded;
    } else {
        proposal.status = ProposalStatus::Defeated;
    }
    
    // Update proposer's reputation if proposal succeeded
    if proposal.status == ProposalStatus::Succeeded {
        let reputation = &mut ctx.accounts.proposer_reputation;
        reputation.participation_score = reputation.participation_score.checked_add(50)
            .ok_or(GovernanceError::MathOverflow)?;
            
        // Extra points for investment proposals
        if proposal.is_investment_proposal {
            reputation.investment_score = reputation.investment_score.checked_add(25)
                .ok_or(GovernanceError::MathOverflow)?;
        }
        
        reputation.last_updated = current_time;
        
        // Recalculate total score
        reputation.total_score = reputation.investment_score
            .checked_add(reputation.participation_score).ok_or(GovernanceError::MathOverflow)?
            .checked_add(reputation.contribution_score).ok_or(GovernanceError::MathOverflow)?;
    }
    
    Ok(())
}

pub fn execute_proposal(
    ctx: Context<ExecuteProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    
    // Check if proposal succeeded
    if proposal.status != ProposalStatus::Succeeded {
        return Err(GovernanceError::InvalidProposalState.into());
    }
    
    // In a real implementation, we would execute the stored instructions here
    // For this sample, we'll just mark it as executed
    
    proposal.status = ProposalStatus::Executed;
    proposal.executed_at = Some(Clock::get()?.unix_timestamp);
    
    // Update proposer's reputation for successful execution
    let reputation = &mut ctx.accounts.proposer_reputation;
    reputation.participation_score = reputation.participation_score.checked_add(25)
        .ok_or(GovernanceError::MathOverflow)?;
    reputation.last_updated = Clock::get()?.unix_timestamp;
    
    // Recalculate total score
    reputation.total_score = reputation.investment_score
        .checked_add(reputation.participation_score).ok_or(GovernanceError::MathOverflow)?
        .checked_add(reputation.contribution_score).ok_or(GovernanceError::MathOverflow)?;
    
    Ok(())
}

pub fn create_faction(
    ctx: Context<CreateFaction>,
    name: String,
    description: String,
    investment_strategy: String,
) -> Result<()> {
    let faction = &mut ctx.accounts.faction;
    
    faction.governance = ctx.accounts.governance.key();
    faction.name = name;
    faction.description = description;
    faction.founder = ctx.accounts.authority.key();
    faction.member_count = 1; // Founder is the first member
    faction.creation_time = Clock::get()?.unix_timestamp;
    faction.investment_strategy = investment_strategy;
    faction.is_active = true;
    
    // Create membership for faction founder
    let membership = &mut ctx.accounts.membership;
    membership.faction = faction.key();
    membership.user = ctx.accounts.authority.key();
    membership.join_time = Clock::get()?.unix_timestamp;
    membership.is_active = true;
    
    Ok(())
}

pub fn join_faction(
    ctx: Context<JoinFaction>,
) -> Result<()> {
    let faction = &mut ctx.accounts.faction;
    let membership = &mut ctx.accounts.membership;
    
    membership.faction = faction.key();
    membership.user = ctx.accounts.user.key();
    membership.join_time = Clock::get()?.unix_timestamp;
    membership.is_active = true;
    
    // Increment faction member count
    faction.member_count = faction.member_count.checked_add(1)
        .ok_or(GovernanceError::MathOverflow)?;
    
    Ok(())
}

pub fn create_investment_strategy(
    ctx: Context<CreateInvestmentStrategy>,
    name: String,
    description: String,
    risk_level: u8,
    target_collections: Vec<Pubkey>,
    allocation_percentages: Vec<u8>,
) -> Result<()> {
    // Validate risk level
    if risk_level == 0 || risk_level > 5 {
        return Err(GovernanceError::InvalidInvestmentAllocation.into());
    }
    
    // Validate allocation percentages
    if target_collections.len() != allocation_percentages.len() {
        return Err(GovernanceError::InvalidInvestmentAllocation.into());
    }
    
    // Ensure allocation percentages sum to 100
    let total_percentage: u8 = allocation_percentages.iter().sum();
    if total_percentage != 100 {
        return Err(GovernanceError::InvalidInvestmentAllocation.into());
    }
    
    let strategy = &mut ctx.accounts.strategy;
    let current_time = Clock::get()?.unix_timestamp;
    
    strategy.community = ctx.accounts.community.key();
    strategy.name = name;
    strategy.description = description;
    strategy.creator = ctx.accounts.authority.key();
    strategy.risk_level = risk_level;
    strategy.target_collections = target_collections;
    strategy.allocation_percentages = allocation_percentages;
    strategy.creation_time = current_time;
    strategy.last_updated = current_time;
    strategy.performance_score = 0; // Initial performance score
    strategy.is_active = true;
    
    // Update reputation for strategy creation
    let reputation = &mut ctx.accounts.reputation;
    reputation.investment_score = reputation.investment_score.checked_add(30)
        .ok_or(GovernanceError::MathOverflow)?;
    reputation.last_updated = current_time;
    
    // Recalculate total score
    reputation.total_score = reputation.investment_score
        .checked_add(reputation.participation_score).ok_or(GovernanceError::MathOverflow)?
        .checked_add(reputation.contribution_score).ok_or(GovernanceError::MathOverflow)?;
    
    Ok(())
}

// Account contexts for the instructions

#[derive(Accounts)]
#[instruction(name: String, min_vote_threshold: u64, voting_period: i64)]
pub struct InitializeGovernance<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + name.len() + 8 + 8 + 8 + 8 + 1,
        seeds = [b"governance".as_ref(), authority.key().as_ref()],
        bump
    )]
    pub governance: Account<'info, GovernanceConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, description: String)]
pub struct CreateCommunity<'info> {
    #[account(
        mut,
        seeds = [b"governance".as_ref(), governance.authority.as_ref()],
        bump,
        constraint = governance.is_active
    )]
    pub governance: Account<'info, GovernanceConfig>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + name.len() + 4 + description.len() + 32 + 8 + 8 + 8 + 1,
        seeds = [b"community".as_ref(), governance.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub community: Account<'info, Community>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 4 + 10 + 8 + 8 + 8 + 1, // "admin".len() = 5
        seeds = [b"membership".as_ref(), community.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub membership: Account<'info, Membership>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinCommunity<'info> {
    #[account(
        mut,
        constraint = community.is_active
    )]
    pub community: Account<'info, Community>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 4 + 10 + 8 + 8 + 8 + 1, // "member".len() = 6
        seeds = [b"membership".as_ref(), community.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub membership: Account<'info, Membership>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 8,
        seeds = [b"reputation".as_ref(), community.governance.as_ref(), user.key().as_ref()],
        bump
    )]
    pub reputation: Account<'info, ReputationScore>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, description: String, is_investment_proposal: bool, target_collection: Option<Pubkey>, investment_amount: Option<u64>)]
pub struct CreateProposal<'info> {
    #[account(
        seeds = [b"governance".as_ref(), governance.authority.as_ref()],
        bump,
        constraint = governance.is_active
    )]
    pub governance: Account<'info, GovernanceConfig>,
    
    #[account(
        mut,
        constraint = community.governance == governance.key(),
        constraint = community.is_active
    )]
    pub community: Account<'info, Community>,
    
    #[account(
        constraint = membership.community == community.key(),
        constraint = membership.user == authority.key(),
        constraint = membership.is_active
    )]
    pub membership: Account<'info, Membership>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 32 + 4 + title.len() + 4 + description.len() + 
            1 + 8 + 8 + 1 + 8 + 8 + 8 + 9 + 1 + 33 + 9,
        seeds = [b"proposal".as_ref(), community.key().as_ref(), community.proposal_count.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(
        mut,
        seeds = [b"reputation".as_ref(), community.governance.as_ref(), authority.key().as_ref()],
        bump
    )]
    pub reputation: Account<'info, ReputationScore>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 4 + 10 + 8 + 8 + 1,
        seeds = [b"activity_reward".as_ref(), authority.key().as_ref(), governance.key().as_ref(), "proposal".as_bytes()],
        bump
    )]
    pub activity_reward: Account<'info, ActivityReward>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(vote_type: VoteType)]
pub struct CastVote<'info> {
    #[account(
        seeds = [b"governance".as_ref(), governance.authority.as_ref()],
        bump,
        constraint = governance.is_active
    )]
    pub governance: Account<'info, GovernanceConfig>,
    
    #[account(
        mut,
        constraint = proposal.governance == governance.key(),
        constraint = proposal.status == ProposalStatus::Active
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(
        constraint = membership.community == proposal.community,
        constraint = membership.user == authority.key(),
        constraint = membership.is_active
    )]
    pub membership: Account<'info, Membership>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 1 + 8 + 8,
        seeds = [b"vote".as_ref(), proposal.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub vote: Account<'info, Vote>,
    
    #[account(
        mut,
        seeds = [b"reputation".as_ref(), governance.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub reputation: Account<'info, ReputationScore>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 4 + 6 + 8 + 8 + 1,
        seeds = [b"activity_reward".as_ref(), authority.key().as_ref(), governance.key().as_ref(), "vote".as_bytes()],
        bump
    )]
    pub activity_reward: Account<'info, ActivityReward>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(
        seeds = [b"governance".as_ref(), governance.authority.as_ref()],
        bump,
        constraint = governance.is_active
    )]
    pub governance: Account<'info, GovernanceConfig>,
    
    #[account(
        mut,
        constraint = proposal.governance == governance.key(),
        constraint = proposal.status == ProposalStatus::Active
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(
        mut,
        seeds = [b"reputation".as_ref(), governance.key().as_ref(), proposal.proposer.as_ref()],
        bump
    )]
    pub proposer_reputation: Account<'info, ReputationScore>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(
        mut,
        constraint = proposal.status == ProposalStatus::Succeeded
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(
        mut,
        seeds = [b"reputation".as_ref(), proposal.governance.as_ref(), proposal.proposer.as_ref()],
        bump
    )]
    pub proposer_reputation: Account<'info, ReputationScore>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(name: String, description: String, investment_strategy: String)]
pub struct CreateFaction<'info> {
    #[account(
        seeds = [b"governance".as_ref(), governance.authority.as_ref()],
        bump,
        constraint = governance.is_active
    )]
    pub governance: Account<'info, GovernanceConfig>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + name.len() + 4 + description.len() + 32 + 8 + 8 + 4 + investment_strategy.len() + 1,
        seeds = [b"faction".as_ref(), governance.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub faction: Account<'info, StrategicFaction>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 8 + 1,
        seeds = [b"faction_membership".as_ref(), faction.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub membership: Account<'info, FactionMembership>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinFaction<'info> {
    #[account(
        mut,
        constraint = faction.is_active
    )]
    pub faction: Account<'info, StrategicFaction>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 1,
        seeds = [b"faction_membership".as_ref(), faction.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub membership: Account<'info, FactionMembership>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, description: String, risk_level: u8, target_collections: Vec<Pubkey>, allocation_percentages: Vec<u8>)]
pub struct CreateInvestmentStrategy<'info> {
    #[account(
        constraint = community.is_active
    )]
    pub community: Account<'info, Community>,
    
    #[account(
        constraint = membership.community == community.key(),
        constraint = membership.user == authority.key(),
        constraint = membership.is_active
    )]
    pub membership: Account<'info, Membership>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + name.len() + 4 + description.len() + 32 + 1 + 
                4 + (target_collections.len() * 32) + 4 + allocation_percentages.len() + 8 + 8 + 8 + 1,
        seeds = [b"investment_strategy".as_ref(), community.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub strategy: Account<'info, InvestmentStrategy>,
    
    #[account(
        mut,
        seeds = [b"reputation".as_ref(), community.governance.as_ref(), authority.key().as_ref()],
        bump
    )]
    pub reputation: Account<'info, ReputationScore>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
} 