import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  test('submits the selected role and entered credentials', () => {
    const onLogin = jest.fn();

    render(<Login onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText(/select role/i), { target: { value: 'employee' } });
    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: 'EMP001' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'rahul123' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({
      role: 'employee',
      userId: 'EMP001',
      password: 'rahul123',
      name: 'Rahul',
    }));
  });
});
