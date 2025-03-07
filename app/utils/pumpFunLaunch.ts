import { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Pump.fun API endpoint
const PUMP_API_ENDPOINT = 'https://api.pump.fun';

// Interface for token creation
export interface TokenCreationParams {
  name: string;
  symbol: string;
  description: string;
  image: string;
  supply: number;
  decimals: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

// Interface for Pump.fun launch parameters
export interface PumpLaunchParams {
  tokenMint: string;
  initialPrice: number;
  maxSupply: number;
  tradingFee: number;
  creatorFee: number;
  liquidityPercentage: number;
}

/**
 * Create a new SPL token on Solana
 * @param wallet Connected wallet
 * @param connection Solana connection
 * @param params Token creation parameters
 * @returns The mint address of the new token
 */
export const createToken = async (
  wallet: WalletContextState,
  connection: Connection,
  params: TokenCreationParams
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Create a new mint
    const mintKeypair = Keypair.generate();
    const mintAuthority = wallet.publicKey;
    const freezeAuthority = wallet.publicKey;

    // Create token mint
    const tokenMint = await createMint(
      connection,
      wallet as any, // This is a hack, as the wallet adapter doesn't perfectly match the spl-token expected type
      mintAuthority,
      freezeAuthority,
      params.decimals
    );

    // Get the token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet as any,
      tokenMint,
      wallet.publicKey
    );

    // Mint tokens to the token account
    await mintTo(
      connection,
      wallet as any,
      tokenMint,
      tokenAccount.address,
      mintAuthority,
      params.supply * Math.pow(10, params.decimals)
    );

    // Create metadata for the token
    // Note: This is simplified and would need more implementation for actual metadata creation
    console.log('Token created with mint address:', tokenMint.toBase58());
    
    return tokenMint.toBase58();
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

/**
 * Register a token for launch on Pump.fun
 * @param wallet Connected wallet
 * @param connection Solana connection
 * @param params Pump.fun launch parameters
 * @returns Response from Pump.fun API
 */
export const registerPumpLaunch = async (
  wallet: WalletContextState,
  connection: Connection,
  params: PumpLaunchParams
): Promise<any> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Create a challenge message for signing to authenticate with Pump.fun
    const challenge = await fetchPumpChallenge(wallet.publicKey.toBase58());
    
    // Sign the challenge
    const signedChallenge = await signPumpChallenge(wallet, challenge);
    
    // Register the token on Pump.fun
    const response = await submitPumpLaunch(wallet.publicKey.toBase58(), signedChallenge, params);
    
    return response;
  } catch (error) {
    console.error('Error registering token on Pump.fun:', error);
    throw error;
  }
};

/**
 * Fetch a challenge from Pump.fun for authentication
 * @param walletAddress Wallet public key
 * @returns Challenge message
 */
const fetchPumpChallenge = async (walletAddress: string): Promise<string> => {
  try {
    const response = await fetch(`${PUMP_API_ENDPOINT}/auth/challenge?wallet=${walletAddress}`);
    const data = await response.json();
    return data.challenge;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

/**
 * Sign a challenge message with wallet
 * @param wallet Connected wallet
 * @param challenge Challenge message to sign
 * @returns Signed challenge message
 */
const signPumpChallenge = async (wallet: WalletContextState, challenge: string): Promise<string> => {
  if (!wallet.signMessage) {
    throw new Error('Wallet does not support message signing');
  }
  
  try {
    // Convert challenge string to Uint8Array
    const messageBytes = new TextEncoder().encode(challenge);
    
    // Sign the message
    const signature = await wallet.signMessage(messageBytes);
    
    // Convert signature to base64 string
    return Buffer.from(signature).toString('base64');
  } catch (error) {
    console.error('Error signing challenge:', error);
    throw error;
  }
};

/**
 * Submit token launch details to Pump.fun
 * @param walletAddress Wallet public key
 * @param signedChallenge Signed challenge message
 * @param params Pump.fun launch parameters
 * @returns Response from Pump.fun API
 */
const submitPumpLaunch = async (
  walletAddress: string,
  signedChallenge: string,
  params: PumpLaunchParams
): Promise<any> => {
  try {
    const response = await fetch(`${PUMP_API_ENDPOINT}/token/launch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Wallet ${walletAddress}:${signedChallenge}`
      },
      body: JSON.stringify({
        tokenMint: params.tokenMint,
        initialPrice: params.initialPrice,
        maxSupply: params.maxSupply,
        tradingFee: params.tradingFee,
        creatorFee: params.creatorFee,
        liquidityPercentage: params.liquidityPercentage,
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting launch details:', error);
    throw error;
  }
};

/**
 * Track token launch status on Pump.fun
 * @param tokenMint Token mint address
 * @returns Current status of the token launch
 */
export const getPumpLaunchStatus = async (tokenMint: string): Promise<any> => {
  try {
    const response = await fetch(`${PUMP_API_ENDPOINT}/token/status/${tokenMint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching launch status:', error);
    throw error;
  }
}; 