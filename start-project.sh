#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================================${NC}"
echo -e "${GREEN}  SolMosaic - Innovative NFT Ecosystem & Financial Platform ${NC}"
echo -e "${GREEN}=========================================================${NC}"
echo ""

# Check Node.js installation
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js (v16 or higher).${NC}"
    echo "Visit https://nodejs.org/ to download and install Node.js."
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}Node.js is installed: ${NODE_VERSION}${NC}"

# Check npm installation
echo -e "${YELLOW}Checking npm installation...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm.${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}npm is installed: ${NPM_VERSION}${NC}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Error installing dependencies. Please try again.${NC}"
    exit 1
fi

echo -e "${GREEN}Dependencies installed successfully!${NC}"

# Start development server
echo -e "${YELLOW}Starting development server...${NC}"
echo -e "${GREEN}The application will be available at http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
npm run dev 