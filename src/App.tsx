import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useAccount, useBalance, useGasPrice, useSendTransaction } from 'wagmi';
import { avalancheFuji } from '@wagmi/core/chains';
import { formatUnits, isAddress, parseUnits } from 'viem';
import Account from './components/account';
import Connectors from './components/connectors';

import './App.css';

const App = () => {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  // Get connected account
  const account = useAccount();
 
  const {
    data: hash,
    error,
    sendTransaction,
    isPending,
  } = useSendTransaction();

  // Retrieve gas price for a given chain
  const { data: gasPrice } = useGasPrice({
    chainId: avalancheFuji.id,
  });

  // Retrieve address balance of the connected account
  const { data: addressBalance } = useBalance({
    address: account.address,
  });

  // Conditions for the send action to be enabled/disabled
  const isSendDisabled = useMemo(
    () => isPending || !account.address || !address || !amount || !!addressError || !!amountError,
    [isPending, account?.address, address, amount, addressError, amountError]
  );

  // Balance information for the connected account address
  const balance = useMemo(() => {
    if (!addressBalance?.value) {
      return null; 
    }

    return `Balance: ${formatUnits(addressBalance?.value, 18)} ${addressBalance?.symbol}`;
  }, []);

  // Validates and handles address change 
  const onAddressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const targetAddress = e.target.value;
    setAddress(targetAddress);
    if (!!targetAddress && !isAddress(targetAddress)) {
      setAddressError('Please enter a valid address');
    } else {
      setAddressError('');
    }
  }, []);

  // Validates and handles amount change
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

  // Sets the max amount available in address balance of the connected account
  const onMaxClick = useCallback(() => {
    if (addressBalance?.value) {
      const etherVal = formatUnits(addressBalance.value, 18);
      setAmount(etherVal);
    }
  }, [addressBalance?.value]);

  // Sends a transaction
  const onSend = useCallback(() => {
    // Send button should not be enabled when address is invalid
    // We still check to for type integrity (never allow an invalid address in transaction body)
    if (!isAddress(address)) {
      setAddressError('Please enter a valid address');
      return;
    }

    sendTransaction({
      to: address,
      value: parseUnits(amount, 18),
      gasPrice,
    });
  }, [address, amount]);

  // Form that contains all user fields and actions for Send operation
  const senderForm = useMemo(
    () => (
      <>
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
              className='input-common'
              value={address}
              onChange={onAddressChange}
              style={{ marginTop: '10px', width: '100%' }}
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
              className='input-common'
              onChange={onAmountChange}
              style={{ width: '90%', marginRight: '8px' }}
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
      </>
    ),
    [
      address,
      addressBalance,
      addressError,
      amount,
      amountError,
      balance,
      isPending,
      isSendDisabled,
      onAddressChange,
      onAmountChange,
      onMaxClick,
      onSend,
    ]
  );

  return (
    <div id="appContainer">
      {senderForm}
      <div style={{ marginTop: '20px', width: '100%' }}>
        {account.isConnected ? <Account /> : <Connectors />}
      </div>
      <div>{error?.message ?? null}</div>
      <div>{hash ? `Last transaction: ${hash}` : null}</div>
    </div>
  );
}

export default App;
