import { useConnect } from 'wagmi';

const Connectors = () => {
  const { connectors, connect } = useConnect();

  return (
    <div data-testid="connectors">
      {connectors.map((connector) => (
        <button
          data-testid={connector.name}
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

export default Connectors;
