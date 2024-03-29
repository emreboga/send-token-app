import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useAccount, useBalance, useGasPrice, useSendTransaction } from 'wagmi';
import { avalancheFuji } from '@wagmi/core/chains';
import { formatUnits, isAddress, parseEther } from 'viem';
import Account from './components/account';
import Connectors from './components/connectors';

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
    sendTransaction,
    isPending,
  } = useSendTransaction();

  const { data: gasPrice } = useGasPrice({
    chainId: avalancheFuji.id,
  });

  const { data: addressBalance } = useBalance({
    address: account.address,
  });

  const isSendDisabled = useMemo(
    () => isPending || !account.address || !address || !amount || !!addressError || !!amountError,
    [isPending, account?.address, address, amount, addressError, amountError]
  );

  const balance = useMemo(() => {
    if (!addressBalance?.value) {
      return null; 
    }

    return `Balance: ${formatUnits(addressBalance?.value, 18)} ${addressBalance?.symbol}`;
  }, []);

  const onAddressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const targetAddress = e.target.value;
    setAddress(targetAddress);
    if (!!targetAddress && !isAddress(targetAddress)) {
      setAddressError('Please enter a valid address');
    } else {
      setAddressError('');
    }
  }, []);

  const onAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const targetAmount = e.target.value;
    setAmount(targetAmount);
    if (addressBalance?.value) {
      const balanceEtherVal = formatUnits(addressBalance.value, 18);
      if (!!targetAmount && balanceEtherVal < targetAmount) {
        setAmountError(
          'Insufficient balance'
        );
      } else {
        setAmountError('');
      }
    }
  }, [addressBalance?.value]);

  const onMaxClick = useCallback(() => {
    if (addressBalance?.value) {
      const etherVal = formatUnits(addressBalance.value, 18);
      setAmount(etherVal);
    }
  }, [addressBalance?.value]);

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
        flex: "1, 0, auto",
        flexDirection: 'column',
        alignItems: 'start',
        background: '#1a1a1c',
        color: '#f8f8fb',
        minWidth: '400px',
        maxWidth: '600px',
        width: '100%',
        padding: '40px',
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
            onChange={onAddressChange}
            style={{ height: '40px', marginTop: '10px', width: '100%' }}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>Amount</span>
          <span>{balance}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyItems: 'center',
            marginTop: '10px',
            width: '100%',
          }}
        >
          <input
            onChange={onAmountChange}
            style={{ height: '40px', width: '90%', marginRight: '8px' }}
            type="number"
            value={amount}
            placeholder="0.0"
          ></input>
          <button
            disabled={!addressBalance?.value}
            style={{ textAlign: 'center' }}
            onClick={onMaxClick}
          >
            Max
          </button>
        </div>
        <div style={{ height: '20px', color: 'red' }}>{amountError}</div>
      </div>
      <div style={{ marginTop: '20px', width: '100%' }}>
        <button
          data-testId="sendBtn"
          style={{ width: '100%' }}
          disabled={isSendDisabled}
          onClick={onSend}
        >
          {isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div style={{ marginTop: '20px', width: '100%' }}>
        {account.isConnected ? <Account /> : <Connectors />}
      </div>
      <div>{error?.message ?? null}</div>
      <div>{hash ? `Last completed transaction: ${hash}` : null}</div>
    </div>
  );
}

export default App;
