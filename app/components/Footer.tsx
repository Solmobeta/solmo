'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background/90 backdrop-blur-md py-16 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Logo />
              <span className="text-xl font-bold">SolMosaic</span>
            </div>
            <p className="opacity-70 mb-4">
              Revolutionary NFT ecosystem and financial platform on Solana.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.599-.1-.898a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"/>
                </svg>
              </a>
              <a href="https://discord.gg/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"/>
                </svg>
              </a>
              <a href="https://github.com/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-foreground/70 hover:text-foreground transition">
                  Explore NFTs
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-foreground/70 hover:text-foreground transition">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/fractional" className="text-foreground/70 hover:text-foreground transition">
                  Fractional Ownership
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-foreground/70 hover:text-foreground transition">
                  Creator Platform
                </Link>
              </li>
              <li>
                <Link href="/financial" className="text-foreground/70 hover:text-foreground transition">
                  NFT Financial Services
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-foreground/70 hover:text-foreground transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-foreground/70 hover:text-foreground transition">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/70 hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-foreground/70 hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/70 hover:text-foreground transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.gg/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://t.me/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://github.com/solmosaic" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition">
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/governance" className="text-foreground/70 hover:text-foreground transition">
                  Governance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-foreground/50">
            © {new Date().getFullYear()} SolMosaic. All rights reserved.
          </p>
          <p className="text-foreground/50 text-sm mt-2">
            <a href="https://solmo.co" className="hover:text-primary">solmo.co</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 