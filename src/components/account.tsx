import { useAccount, useDisconnect } from 'wagmi';

const Account = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      <button style={{ width: '100%' }} onClick={() => disconnect()}>
        Disconnect
      </button>
      <div style={{ width: '100%' }}>{`Connected to: ${address}`}</div>
    </div>
  );
};

export default Account;
