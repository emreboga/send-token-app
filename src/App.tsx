import { useCallback, useState } from 'react';
import { useAccount, useBalance, useGasPrice, useSendTransaction } from 'wagmi';
import { Account } from './account';
import { avalancheFuji } from '@wagmi/core/chains';
import { WalletOptions } from './wallet-options';
import { formatEther, isAddress, parseEther } from 'viem';

import './App.css';

function App() {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  const account = useAccount();
  const {
    data: hash,
    error,
    isError,
    sendTransaction,
    isPending,
  } = useSendTransaction();

  const { data: gasPrice } = useGasPrice({
    chainId: avalancheFuji.id,
  });

  const { data: addressBalance } = useBalance({
    address: account.address,
  });

  const onSend = useCallback(() => {
    if (isAddress(address)) {
      sendTransaction({
        to: address,
        value: parseEther(amount),
        gasPrice,
      });
    }
  }, [address, amount]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        background: '#1a1a1c',
        color: '#f8f8fb',
        width: '400px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}
      >
        <div>Send To</div>
        <div style={{ width: '100%' }}>
          <input
            value={address}
            onChange={(e) => {
              const targetAddress = e.target.value;
              setAddress(targetAddress);
              if (!!targetAddress && !isAddress(targetAddress)) {
                setAddressError('Please enter a valid address');
              } else {
                setAddressError('');
              }
            }}
            onBlur={() => {
              if (!address) {
                return;
              }
            }}
            style={{ height: '40px', width: '100%' }}
            placeholder="Enter 0x Address"
          />
        </div>
        <div style={{ height: '20px', color: 'red' }}>{addressError}</div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          marginTop: '20px',
          width: '100%',
        }}
      >
        <div>Amount</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyItems: 'center',
            width: '100%',
          }}
        >
          <input
            onChange={(e) => {
              const targetAmount = e.target.value;
              setAmount(targetAmount);
              if (addressBalance?.value) {
                const balanceEtherVal = formatEther(addressBalance.value);
                if (!!targetAmount && balanceEtherVal < targetAmount) {
                  setAmountError(
                    'Amount cannot be more than the account balance'
                  );
                } else {
                  setAmountError('');
                }
              }
            }}
            style={{ height: '40px', width: '80%', marginRight: '8px' }}
            type="number"
            value={amount}
            placeholder="0.0"
          ></input>
          <button
            disabled={!addressBalance?.value}
            style={{ textAlign: 'center' }}
            onClick={() => {
              if (addressBalance?.value) {
                const etherVal = formatEther(addressBalance.value);
                setAmount(etherVal);
              }
            }}
          >
            max
          </button>
        </div>
        <div style={{ height: '20px', color: 'red' }}>{amountError}</div>
      </div>
      <div style={{ marginTop: '20px', width: '100%' }}>
        <button style={{ width: '100%' }} disabled={isPending} onClick={onSend}>
          {isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
      {account.isConnected ? <Account /> : <WalletOptions />}
      <div>{isError ? error.message : null}</div>
    </div>
  );
}

export default App;
