import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  interface ReactNode {}
}

declare module 'next' {
  interface Metadata {}
}

declare module 'next/font/google' {
  export function Inter(options: any): any;
}

declare module 'framer-motion' {
  export const motion: any;
}

declare module 'react-hot-toast' {
  export function Toaster(props: any): JSX.Element;
  export const toast: {
    success(message: string): void;
    error(message: string): void;
  };
}

declare module '@solana/wallet-adapter-react-ui' {
  export function WalletMultiButton(): JSX.Element;
}

declare module '@solana/wallet-adapter-react' {
  export function useWallet(): {
    publicKey: any;
    signTransaction: any;
    connected: boolean;
  };
  export interface WalletContextState {
    publicKey: any;
    signTransaction: any;
    connected: boolean;
  }
}

declare module '@solana/wallet-adapter-base' {
  export enum WalletAdapterNetwork {
    Devnet = 'devnet',
    Testnet = 'testnet',
    Mainnet = 'mainnet-beta'
  }
}

declare module '@solana/web3.js' {
  export class PublicKey {
    static findProgramAddress(seeds: any[], programId: any): Promise<[any, number]>;
    toBuffer(): Buffer;
    constructor(value: string);
  }
  export function clusterApiUrl(network: string): string;
  export class Connection {
    constructor(endpoint: string, commitment: string);
  }
} 