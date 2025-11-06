import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Onboarding from '../pages/Onboarding';
import { AuthContext } from '../contexts/AuthContext';
import { SchoolContext } from '../contexts/SchoolContext';
import * as onboardingApi from '../api/onboarding';

// Mock the onboarding API
vi.mock('../api/onboarding', () => ({
  completeOnboarding: vi.fn(),
  checkOnboardingStatus: vi.fn(),
  createSchool: vi.fn(),
  updateUserProfile: vi.fn(),
  uploadSchoolLogo: vi.fn(),
  updateSchoolLogo: vi.fn(),
  sendTeacherInvitations: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
      p: React.forwardRef(({ children, ...props }, ref) => <p ref={ref} {...props}>{children}</p>),
      button: React.forwardRef(({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>),
      label: React.forwardRef(({ children, ...props }, ref) => <label ref={ref} {...props}>{children}</label>),
      svg: React.forwardRef(({ children, ...props }, ref) => <svg ref={ref} {...props}>{children}</svg>),
      path: React.forwardRef(({ ...props }, ref) => <path ref={ref} {...props} />),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const mockAuthContext = {
  user: {
    id: 'test-user-id',
    email: 'principal@test.com',
  },
  isAuthenticated: true,
  loading: false,
  authLoading: false,
};

const mockSchoolContext = {
  school: null,
  setSchool: vi.fn(),
  refetch: vi.fn(),
  loading: false,
};

const renderWithContext = (component) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <SchoolContext.Provider value={mockSchoolContext}>
          {component}
        </SchoolContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Onboarding Wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step (School Name)', () => {
    renderWithContext(<Onboarding />);
    
    expect(screen.getByText(/Welcome to EduSync!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/School Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 8/i)).toBeInTheDocument();
  });

  it('validates school name input', async () => {
    const user = userEvent.setup();
    renderWithContext(<Onboarding />);
    
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueButton);
    
    await waitFor(() => {
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('advances to next step when valid school name is provided', async () => {
    const user = userEvent.setup();
    renderWithContext(<Onboarding />);
    
    const schoolNameInput = screen.getByLabelText(/School Name/i);
    await user.type(schoolNameInput, 'Test School');
    
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Where is your school located?/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 2 of 8/i)).toBeInTheDocument();
    });
  });

  it('allows skipping optional address step', async () => {
    const user = userEvent.setup();
    renderWithContext(<Onboarding />);
    
    // Step 1: Enter school name
    const schoolNameInput = screen.getByLabelText(/School Name/i);
    await user.type(schoolNameInput, 'Test School');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 2: Skip address
    await waitFor(() => {
      expect(screen.getByText(/Where is your school located?/i)).toBeInTheDocument();
    });
    
    const skipButton = screen.getByRole('button', { name: /Skip/i });
    await user.click(skipButton);
    
    // Should advance to step 3
    await waitFor(() => {
      expect(screen.getByText(/UNHCR Recognition Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 3 of 8/i)).toBeInTheDocument();
    });
  });

  it('allows going back to previous step', async () => {
    const user = userEvent.setup();
    renderWithContext(<Onboarding />);
    
    // Step 1: Enter school name
    const schoolNameInput = screen.getByLabelText(/School Name/i);
    await user.type(schoolNameInput, 'Test School');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 2: Go back
    await waitFor(() => {
      expect(screen.getByText(/Where is your school located?/i)).toBeInTheDocument();
    });
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    
    // Should return to step 1
    await waitFor(() => {
      expect(screen.getByText(/Welcome to EduSync!/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 1 of 8/i)).toBeInTheDocument();
    });
  });

  it('displays progress bar with correct percentage', () => {
    renderWithContext(<Onboarding />);
    
    const progressText = screen.getByText(/13% Complete/i); // Step 1/8 = 12.5% ≈ 13%
    expect(progressText).toBeInTheDocument();
  });

  it('completes onboarding successfully', async () => {
    const user = userEvent.setup();
    
    // Mock successful API call
    onboardingApi.completeOnboarding.mockResolvedValue({
      success: true,
      data: {
        school: {
          id: 'test-school-id',
          name: 'Test School',
        },
        profile: {
          id: 'test-user-id',
          school_id: 'test-school-id',
          role: 'principal',
        },
      },
    });
    
    renderWithContext(<Onboarding />);
    
    // Step 1: School Name
    await user.type(screen.getByLabelText(/School Name/i), 'Test School');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 2: Address (skip)
    await waitFor(() => screen.getByText(/Where is your school located?/i));
    await user.click(screen.getByRole('button', { name: /Skip/i }));
    
    // Step 3: UNHCR Status
    await waitFor(() => screen.getByText(/UNHCR Recognition Status/i));
    const noOption = screen.getByText(/No, Not Recognized/i);
    await user.click(noOption);
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 4: Logo (skip)
    await waitFor(() => screen.getByText(/Add Your School Logo/i));
    await user.click(screen.getByRole('button', { name: /Skip/i }));
    
    // Step 5: Principal Info
    await waitFor(() => screen.getByText(/Your Contact Information/i));
    await user.type(screen.getByLabelText(/Full Name/i), 'Dr. Jane Smith');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 6: Invite Teachers (skip)
    await waitFor(() => screen.getByText(/Invite Your Teachers/i));
    await user.click(screen.getByRole('button', { name: /Skip/i }));
    
    // Step 7: Review
    await waitFor(() => screen.getByText(/Review Your Information/i));
    expect(screen.getByText('Test School')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    
    const completeButton = screen.getByRole('button', { name: /Complete Setup/i });
    await user.click(completeButton);
    
    // Should call the API
    await waitFor(() => {
      expect(onboardingApi.completeOnboarding).toHaveBeenCalledWith({
        user: mockAuthContext.user,
        schoolInfo: expect.objectContaining({
          schoolName: 'Test School',
          principalName: 'Dr. Jane Smith',
        }),
        teacherEmails: [],
      });
    });
    
    // Step 8: Success
    await waitFor(() => {
      expect(screen.getByText(/Welcome to EduSync!/i)).toBeInTheDocument();
      expect(screen.getByText('Test School')).toBeInTheDocument();
    });
  });

  it('handles API errors during onboarding completion', async () => {
    const user = userEvent.setup();
    
    // Mock failed API call
    onboardingApi.completeOnboarding.mockResolvedValue({
      success: false,
      error: 'Failed to create school',
    });
    
    renderWithContext(<Onboarding />);
    
    // Navigate through steps quickly
    await user.type(screen.getByLabelText(/School Name/i), 'Test School');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    await waitFor(() => screen.getByText(/Where is your school located?/i));
    await user.click(screen.getByRole('button', { name: /Skip/i }));
    
    await waitFor(() => screen.getByText(/UNHCR Recognition Status/i));
    await user.click(screen.getByText(/No, Not Recognized/i));
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    await waitFor(() => screen.getByText(/Add Your School Logo/i));
    await user.click(screen.getByRole('button', { name: /Skip/i }));
    
    await waitFor(() => screen.getByText(/Your Contact Information/i));
    await user.type(screen.getByLabelText(/Full Name/i), 'Dr. Jane Smith');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    await waitFor(() => screen.getByText(/Invite Your Teachers/i));
    await user.click(screen.getByRole('button', { name: /Skip/i }));
    
    await waitFor(() => screen.getByText(/Review Your Information/i));
    await user.click(screen.getByRole('button', { name: /Complete Setup/i }));
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to create school/i)).toBeInTheDocument();
    });
  });
});
