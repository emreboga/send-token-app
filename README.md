# Wallet Actions app

This application provides send action for a connected (injected) wallet.

## Running the app

```
npm install && npm run dev
```

## Running tests

```
npm run test
```

## Limitations and future considerations
- User cannot select any asset, sends using the native asset. This was a deprecation in useBalance I've discovered later in the coding and continued using native asset. I can use useReadContracts to read USDC balance in the account.
- Limited unit testing to verify only the initial state of the app. 
- Supports only send action of the connected Wallet.
- No event wathcing for the transaction. This had to be dropped as I already passed 4 hours. I can use useWatchContractEvent to retrieve transfer logs for a given contract.
