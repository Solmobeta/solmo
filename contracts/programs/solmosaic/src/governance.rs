use anchor_lang::prelude::*;
use std::mem::size_of;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalStatus {
    Draft,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Executed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum VoteType {
    For,
    Against,
    Abstain,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProposalInstruction {
    pub program_id: Pubkey,
    pub accounts: Vec<ProposalAccount>,
    pub data: Vec<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProposalAccount {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}

// Main Governance account to track communities
#[account]
pub struct GovernanceConfig {
    pub authority: Pubkey,
    pub name: String,
    pub min_vote_threshold: u64, // Minimum votes required for a proposal to succeed
    pub voting_period: i64,      // Voting period in seconds
    pub proposal_count: u64,
    pub total_communities: u64,
    pub is_active: bool,
}

// Community group that makes decisions
#[account]
pub struct Community {
    pub governance: Pubkey,
    pub name: String,
    pub description: String,
    pub authority: Pubkey,
    pub member_count: u64,
    pub proposal_count: u64,
    pub creation_time: i64,
    pub is_active: bool,
}

// Community membership
#[account]
pub struct Membership {
    pub community: Pubkey,
    pub user: Pubkey,
    pub role: String,       // "member", "moderator", "admin"
    pub voting_power: u64,  // Weighted voting power
    pub join_time: i64,
    pub reputation_score: u64,
    pub is_active: bool,
}

// Proposal for governance actions
#[account]
pub struct Proposal {
    pub governance: Pubkey,
    pub community: Pubkey,
    pub proposer: Pubkey,
    pub title: String,
    pub description: String,
    pub status: ProposalStatus,
    pub start_time: i64,
    pub end_time: i64,
    pub instruction_count: u8,
    pub for_votes: u64,
    pub against_votes: u64,
    pub abstain_votes: u64,
    pub executed_at: Option<i64>,
    pub is_investment_proposal: bool,  // Flag for investment proposals
    pub target_collection: Option<Pubkey>, // If it's an investment proposal
    pub investment_amount: Option<u64>,    // If it's an investment proposal
}

// Stores executable instructions for a proposal
#[account]
pub struct ProposalInstructions {
    pub proposal: Pubkey,
    pub instructions: Vec<ProposalInstruction>,
}

// Records individual votes
#[account]
pub struct Vote {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub vote_type: VoteType,
    pub voting_power: u64,
    pub vote_time: i64,
}

// Reputation system for users
#[account]
pub struct ReputationScore {
    pub user: Pubkey,
    pub governance: Pubkey,
    pub investment_score: u64,    // Based on investment performance
    pub participation_score: u64, // Based on governance participation
    pub contribution_score: u64,  // Based on community contributions
    pub total_score: u64,         // Overall reputation score
    pub last_updated: i64,
}

// Activity reward tracker
#[account]
pub struct ActivityReward {
    pub user: Pubkey,
    pub governance: Pubkey,
    pub reward_type: String,      // "vote", "proposal", "contribution"
    pub amount: u64,
    pub timestamp: i64,
    pub is_claimed: bool,
}

// Faction/Group for strategic voting
#[account]
pub struct StrategicFaction {
    pub governance: Pubkey,
    pub name: String,
    pub description: String,
    pub founder: Pubkey,
    pub member_count: u64,
    pub creation_time: i64,
    pub investment_strategy: String, // Description of faction's strategy
    pub is_active: bool,
}

// Faction membership
#[account]
pub struct FactionMembership {
    pub faction: Pubkey,
    pub user: Pubkey,
    pub join_time: i64,
    pub is_active: bool,
}

// Investment strategy record
#[account]
pub struct InvestmentStrategy {
    pub community: Pubkey,
    pub name: String,
    pub description: String,
    pub creator: Pubkey,
    pub risk_level: u8,           // 1-5, 1 being lowest risk
    pub target_collections: Vec<Pubkey>,
    pub allocation_percentages: Vec<u8>,
    pub creation_time: i64,
    pub last_updated: i64,
    pub performance_score: i64,   // Can be negative if performing poorly
    pub is_active: bool,
}

// Implementation errors
#[error_code]
pub enum GovernanceError {
    #[msg("Proposal is not in the correct state")]
    InvalidProposalState,
    #[msg("Voting period has ended")]
    VotingEnded,
    #[msg("Voting period has not started")]
    VotingNotStarted,
    #[msg("User is not a member of this community")]
    NotCommunityMember,
    #[msg("User does not have permission for this action")]
    InsufficientPermission,
    #[msg("The vote threshold was not reached")]
    ThresholdNotReached,
    #[msg("User has already voted on this proposal")]
    AlreadyVoted,
    #[msg("Math operation resulted in overflow")]
    MathOverflow,
    #[msg("Invalid investment allocation")]
    InvalidInvestmentAllocation,
} 