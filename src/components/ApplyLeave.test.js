import { render, screen } from '@testing-library/react';
import ApplyLeave from './ApplyLeave';

describe('ApplyLeave', () => {
  test('does not show a name selector for other employees', () => {
    const employees = [
      { id: 1, name: 'Rahul', leavesLeft: 4, totalLeaves: 4, leaveStatus: '', rejectionReason: '', leaveHistory: [] },
      { id: 2, name: 'Priya', leavesLeft: 4, totalLeaves: 4, leaveStatus: '', rejectionReason: '', leaveHistory: [] },
    ];

    render(
      <ApplyLeave
        employees={employees}
        setEmployees={jest.fn()}
        activeEmployeeId={2}
        setActiveEmployeeId={jest.fn()}
      />
    );

    expect(screen.getByText(/Priya/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/select your name/i)).not.toBeInTheDocument();
  });
});
