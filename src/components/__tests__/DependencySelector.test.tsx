import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DependencySelector, type DependencySelection } from '@/components/orchestration/DependencySelector';

describe('DependencySelector Component', () => {
  const mockOnApprove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Platform Selection', () => {
    it('should render platform selection buttons', () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      expect(screen.getByRole('button', { name: /Web App/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mobile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Custom Tech Stack/i })).toBeInTheDocument();
    });

    it('should have web platform selected by default', () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const webButton = screen.getByRole('button', { name: /Web App/i });
      expect(webButton).toHaveClass('default');
    });
  });

  describe('Web Platform Dependencies', () => {
    it('should display web dependency options', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        expect(screen.getByText(/Next.js Full-Stack/i)).toBeInTheDocument();
        expect(screen.getByText(/Next.js \+ FastAPI/i)).toBeInTheDocument();
      });
    });

    it('should display dependency details for web stacks', async () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        expect(screen.getByText(/Unified TypeScript codebase/i)).toBeInTheDocument();
      });
    });

    it('should allow selection of web dependency option', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Choose this option/i })).toBeInTheDocument();
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Selected/i })).toBeInTheDocument();
      });
    });

    it('should display dependencies as badges', async () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        expect(screen.getByText('next')).toBeInTheDocument();
        expect(screen.getByText('react')).toBeInTheDocument();
      });
    });

    it('should display highlights for selected option', async () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        expect(screen.getByText(/Unified TypeScript codebase/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Platform Dependencies', () => {
    it('should display mobile dependency options when selected', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const mobileButton = screen.getByRole('button', { name: /Mobile/i });
      await user.click(mobileButton);

      await waitFor(() => {
        expect(screen.getByText(/Next.js \+ Expo/i)).toBeInTheDocument();
        expect(screen.getByText(/FastAPI \+ Expo/i)).toBeInTheDocument();
      });
    });

    it('should clear previous selection when switching platforms', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
        return selectButtons.length > 0;
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      const mobileButton = screen.getByRole('button', { name: /Mobile/i });
      await user.click(mobileButton);

      await waitFor(() => {
        const chooseButtons = screen.queryAllByRole('button', { name: /Choose this option/i });
        expect(chooseButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Custom Tech Stack', () => {
    it('should display custom stack option', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      await waitFor(() => {
        expect(screen.getByText(/Custom Tech Stack/i)).toBeInTheDocument();
      });
    });

    it('should display custom stack form fields', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('')).toBeTruthy();
      });

      expect(screen.getByPlaceholderText(/Enter frontend stack here/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter backend stack here/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter database/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter deployment preference/i)).toBeInTheDocument();
    });

    it('should allow custom stack input', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const frontendInput = screen.getByPlaceholderText(/Enter frontend stack here/i);
      await user.type(frontendInput, 'React');

      expect(frontendInput).toHaveValue('React');
    });

    it('should require all custom stack fields to be filled', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const frontendInput = screen.getByPlaceholderText(/Enter frontend stack here/i);
      const backendInput = screen.getByPlaceholderText(/Enter backend stack here/i);
      const databaseInput = screen.getByPlaceholderText(/Enter database/i);
      const deploymentInput = screen.getByPlaceholderText(/Enter deployment preference/i);

      await user.type(frontendInput, 'React');
      await user.type(backendInput, 'Django');
      await user.type(databaseInput, 'PostgreSQL');

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      expect(approveButton).toBeDisabled();

      await user.type(deploymentInput, 'AWS');

      expect(approveButton).not.toBeDisabled();
    });

    it('should allow custom dependencies input', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const depsInput = screen.getByPlaceholderText(/List package names/i);
      await user.type(depsInput, 'react\ndjango\npostgresql');

      expect(depsInput).toHaveValue('react\ndjango\npostgresql');
    });
  });

  describe('Approval Notes', () => {
    it('should display approval notes textarea', () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const notesInput = screen.getByPlaceholderText(/Call out security exceptions/i);
      expect(notesInput).toBeInTheDocument();
    });

    it('should allow approval notes input', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const notesInput = screen.getByPlaceholderText(/Call out security exceptions/i);
      await user.type(notesInput, 'We need HIPAA compliance');

      expect(notesInput).toHaveValue('We need HIPAA compliance');
    });

    it('should include notes in approval callback', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
        return selectButtons.length > 0;
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      const notesInput = screen.getByPlaceholderText(/Call out security exceptions/i);
      await user.type(notesInput, 'Security requirements');

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      await user.click(approveButton);

      expect(mockOnApprove).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: 'Security requirements'
        })
      );
    });
  });

  describe('Approve Button', () => {
    it('should be disabled when no option selected', () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      expect(approveButton).toBeDisabled();
    });

    it('should be enabled when preset option selected', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
        return selectButtons.length > 0;
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      expect(approveButton).not.toBeDisabled();
    });

    it('should be enabled when custom stack fully filled', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const frontendInput = screen.getByPlaceholderText(/Enter frontend stack here/i);
      const backendInput = screen.getByPlaceholderText(/Enter backend stack here/i);
      const databaseInput = screen.getByPlaceholderText(/Enter database/i);
      const deploymentInput = screen.getByPlaceholderText(/Enter deployment preference/i);

      await user.type(frontendInput, 'React');
      await user.type(backendInput, 'Django');
      await user.type(databaseInput, 'PostgreSQL');
      await user.type(deploymentInput, 'AWS');

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      expect(approveButton).not.toBeDisabled();
    });

    it('should be disabled when submitting', async () => {
      render(
        <DependencySelector submitting={true} onApprove={mockOnApprove} />
      );

      const approveButton = screen.getByRole('button', { name: /Submitting/i });
      expect(approveButton).toBeDisabled();
    });

    it('should show loading text when submitting', () => {
      render(
        <DependencySelector submitting={true} onApprove={mockOnApprove} />
      );

      expect(screen.getByText(/Submitting/i)).toBeInTheDocument();
    });
  });

  describe('Approval Callback - Preset', () => {
    it('should call onApprove with correct payload for preset option', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
        return selectButtons.length > 0;
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      await user.click(approveButton);

      expect(mockOnApprove).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'preset',
          platform: 'web'
        })
      );
    });

    it('should include selected option in callback', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
        return selectButtons.length > 0;
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      await user.click(approveButton);

      expect(mockOnApprove).toHaveBeenCalledWith(
        expect.objectContaining({
          option: expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String)
          })
        })
      );
    });
  });

  describe('Approval Callback - Custom', () => {
    it('should call onApprove with correct payload for custom stack', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const frontendInput = screen.getByPlaceholderText(/Enter frontend stack here/i);
      const backendInput = screen.getByPlaceholderText(/Enter backend stack here/i);
      const databaseInput = screen.getByPlaceholderText(/Enter database/i);
      const deploymentInput = screen.getByPlaceholderText(/Enter deployment preference/i);

      await user.type(frontendInput, 'React');
      await user.type(backendInput, 'Django');
      await user.type(databaseInput, 'PostgreSQL');
      await user.type(deploymentInput, 'AWS');

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      await user.click(approveButton);

      expect(mockOnApprove).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'custom',
          platform: 'custom',
          customStack: expect.objectContaining({
            frontend: 'React',
            backend: 'Django',
            database: 'PostgreSQL',
            deployment: 'AWS'
          })
        })
      );
    });

    it('should parse dependencies from textarea', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const frontendInput = screen.getByPlaceholderText(/Enter frontend stack here/i);
      const backendInput = screen.getByPlaceholderText(/Enter backend stack here/i);
      const databaseInput = screen.getByPlaceholderText(/Enter database/i);
      const deploymentInput = screen.getByPlaceholderText(/Enter deployment preference/i);
      const depsInput = screen.getByPlaceholderText(/List package names/i);

      await user.type(frontendInput, 'React');
      await user.type(backendInput, 'Django');
      await user.type(databaseInput, 'PostgreSQL');
      await user.type(deploymentInput, 'AWS');
      await user.type(depsInput, 'react\ndjango\npsycopg2');

      const approveButton = screen.getByRole('button', { name: /Approve Dependencies/i });
      await user.click(approveButton);

      expect(mockOnApprove).toHaveBeenCalledWith(
        expect.objectContaining({
          customStack: expect.objectContaining({
            dependencies: ['react', 'django', 'psycopg2']
          })
        })
      );
    });
  });

  describe('Summary Text', () => {
    it('should display default summary when no selection', () => {
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      expect(screen.getByText(/Select a platform and option to continue/i)).toBeInTheDocument();
    });

    it('should display summary for selected preset', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      await waitFor(() => {
        const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
        return selectButtons.length > 0;
      });

      const selectButtons = screen.getAllByRole('button', { name: /Choose this option/i });
      await user.click(selectButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Next.js Full-Stack selected for web/i)).toBeInTheDocument();
      });
    });

    it('should display custom ready summary when custom stack complete', async () => {
      const user = userEvent.setup();
      render(
        <DependencySelector onApprove={mockOnApprove} />
      );

      const customButton = screen.getByRole('button', { name: /Custom Tech Stack/i });
      await user.click(customButton);

      const frontendInput = screen.getByPlaceholderText(/Enter frontend stack here/i);
      const backendInput = screen.getByPlaceholderText(/Enter backend stack here/i);
      const databaseInput = screen.getByPlaceholderText(/Enter database/i);
      const deploymentInput = screen.getByPlaceholderText(/Enter deployment preference/i);

      await user.type(frontendInput, 'React');
      await user.type(backendInput, 'Django');
      await user.type(databaseInput, 'PostgreSQL');
      await user.type(deploymentInput, 'AWS');

      await waitFor(() => {
        expect(screen.getByText(/Custom tech stack ready for approval/i)).toBeInTheDocument();
      });
    });
  });
});
