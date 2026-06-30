import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login screen', () => {
  render(<App />);
  expect(screen.getByText(/leave management system/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/select role/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^login$/i }).length).toBeGreaterThanOrEqual(2);
});
