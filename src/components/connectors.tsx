import { useConnect } from 'wagmi';

const Connectors = () => {
  const { connectors, connect } = useConnect();

  return (
    <div data-testId="connectors">
      {connectors.map((connector) => (
        <button
          data-testId={connector.name}
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
