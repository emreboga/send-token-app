import { useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div style={{ width: '100%' }}>
      {connectors.map((connector) => (
        <button
          style={{ marginTop: '20px', width: '100%' }}
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          {`Connect Wallet (${connector.name})`}
        </button>
      ))}
    </div>
  );
}
