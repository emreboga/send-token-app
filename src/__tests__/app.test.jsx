import { render, renderHook, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import App from './App';
import { useConnect } from 'wagmi';

test('verifies connectors', async () => {
  render(<App />);
  const { connectors } = renderHook(() => useConnect());

  await screen.findByTestId('connectors');
 
  expect(screen.getByTestId('connectors').getElementsByTagName('button')).toHaveLength(connectors.length);
  expect(screen.getByTestId('sendBtn')).toBeDisabled();
});
