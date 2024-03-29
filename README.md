# Wallet Actions app

This application provides send action for a connected (injected) wallet.

## Running the app
You can run the below cmd and navigate to http://localhost:5173/ to see the application.
```
npm install && npm run dev
```

## Running tests
You can run the below cmd for unit tests.
```
npm run test
```

## Technical Design Notes

- This application is built purely with React components and CSS styling without any 3rd part component library.
- Wagmi and Viem APIs has been leveraged for Web3 operations and utilities.
- For Unit testing, we are using Jest and React testing library. 

## Limitations and future considerations
- User cannot select any asset, sends using the native asset. This was a deprecation in useBalance I've discovered later in the coding and continued using native asset. I can use useReadContracts to read USDC balance in the account.
- Limited unit testing to verify only the initial state of the app. 
- Supports only send action of the connected Wallet.
- No event wathcing for the transaction. This had to be dropped as I already passed 4 hours. I can use useWatchContractEvent to retrieve transfer logs for a given contract.
