import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer';
import { useConnect } from 'wagmi';
import Connectors from './../components/connectors';
import App from './../App';

/**
 * const {
    data: hash,
    error,
    sendTransaction,
    isPending,
  } = useSendTransaction();
 */
jest.mock(
  'wagmi',
  () => ({
    useAccount: () => ({
      address: '',
      isConnected: false,
    }),
    useBalance: () => ({
      data: null,
    }),
    useConnect: () => ({
      connectors: [{ name: 'core' }],
      connect: () => {},
    }),
    useGasPrice: () => ({
      data: null,
    }),
    useSendTransaction: () => ({
      data: null,
      error: null,
      sendTransaction: () => {},
      isPending: false,
    }),
  }));

it('App: Verify initial state', async () => {
  const app = renderer.create(
    <App />,
  );

  // Component test instance for the app root
  const componentInstance = app.root;

  // Connectors are ready with the Wagmi provided list 
  const connectors = componentInstance.findByProps({ "data-testId": "connectors"});
  expect(connectors.children).toHaveLength(1);

  // Send button is disabled when no wallet is connected
  const sendButtonElement = componentInstance.findByProps({ "data-testId": "sendBtn"});
  expect(sendButtonElement.props.disabled).toBeTruthy();
});
