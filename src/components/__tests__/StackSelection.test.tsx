import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StackSelection } from '@/components/orchestration/StackSelection';

describe('StackSelection Component', () => {
  const mockOnStackSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Platform Selection', () => {
    it('should render platform selection buttons', () => {
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      expect(screen.getByRole('button', { name: /Web App Only/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mobile App/i })).toBeInTheDocument();
    });

    it('should display initial UI without stacks before platform selection', () => {
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      expect(screen.getByText(/Choose Your Project Type/i)).toBeInTheDocument();
      expect(screen.queryByText(/Technology Stack Selection/i)).not.toBeInTheDocument();
    });

    it('should show stacks when web platform is selected', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      const webButton = screen.getByRole('button', { name: /Web App Only/i });
      await user.click(webButton);

      await waitFor(() => {
        expect(screen.getByText(/Choose Your Technology Stack/i)).toBeInTheDocument();
        expect(screen.getByText(/Next.js Full-Stack/i)).toBeInTheDocument();
      });
    });

    it('should show mobile stacks when mobile platform is selected', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      const mobileButton = screen.getByRole('button', { name: /Mobile App/i });
      await user.click(mobileButton);

      await waitFor(() => {
        expect(screen.getByText(/Next.js \+ Expo/i)).toBeInTheDocument();
        expect(screen.getByText(/Hybrid Next.js \+ FastAPI \+ Expo/i)).toBeInTheDocument();
      });
    });
  });

  describe('Stack Selection - Web Stacks', () => {
    it('should display all web stack options when web platform selected', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        expect(screen.getByText(/Next.js Full-Stack/i)).toBeInTheDocument();
        expect(screen.getByText(/Hybrid Next.js \+ FastAPI/i)).toBeInTheDocument();
      });
    });

    it('should show stack composition details', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        expect(screen.getByText(/Technology Composition/i)).toBeInTheDocument();
        expect(screen.getByText(/Next.js 14/i)).toBeInTheDocument();
      });
    });

    it('should highlight selected stack', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection
          selectedStack="nextjs_only_web"
          onStackSelect={mockOnStackSelect}
        />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        const selectedCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="ring"]');
        expect(selectedCard).toHaveClass('ring-2');
      });
    });

    it('should call onStackSelect when stack card is clicked', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
        expect(stackCard).toBeInTheDocument();
      });

      const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
      if (stackCard) {
        fireEvent.click(stackCard);
      }

      await waitFor(() => {
        expect(mockOnStackSelect).toHaveBeenCalled();
      });
    });
  });

  describe('Stack Selection - Mobile Stacks', () => {
    it('should display all mobile stack options when mobile platform selected', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Mobile App/i }));

      await waitFor(() => {
        expect(screen.getByText(/Next.js \+ Expo/i)).toBeInTheDocument();
        expect(screen.getByText(/Hybrid Next.js \+ FastAPI \+ Expo/i)).toBeInTheDocument();
      });
    });

    it('should show mobile-specific composition', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Mobile App/i }));

      await waitFor(() => {
        expect(screen.getByText(/Expo with React Native/i)).toBeInTheDocument();
      });
    });
  });

  describe('Custom Stack Option', () => {
    it('should show custom stack option after platform selection', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        expect(screen.getByText(/Custom Stack/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Define Custom Stack/i })).toBeInTheDocument();
      });
    });

    it('should toggle custom stack input when clicked', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Define Custom Stack/i })).toBeInTheDocument();
      });

      const customButton = screen.getByRole('button', { name: /Define Custom Stack/i });
      await user.click(customButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Describe your custom web stack/i)).toBeInTheDocument();
      });
    });

    it('should allow custom stack input', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const input = screen.getByPlaceholderText(/Describe your custom web stack/i);
      await user.type(input, 'React + Django + PostgreSQL');

      expect(input).toHaveValue('React + Django + PostgreSQL');
    });

    it('should enable custom stack submit button when input filled', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const input = screen.getByPlaceholderText(/Describe your custom web stack/i);
      await user.type(input, 'Custom Stack');

      const submitButton = screen.getByRole('button', { name: /Use Custom Stack/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('should call onStackSelect with custom when custom stack submitted', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const input = screen.getByPlaceholderText(/Describe your custom web stack/i);
      await user.type(input, 'Custom Stack');
      await user.click(screen.getByRole('button', { name: /Use Custom Stack/i }));

      expect(mockOnStackSelect).toHaveBeenCalledWith('custom', '', 'web');
    });

    it('should disable custom submit button when input is empty', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const submitButton = screen.getByRole('button', { name: /Use Custom Stack/i });
      expect(submitButton).toBeDisabled();
    });

    it('should cancel custom stack and clear input', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const input = screen.getByPlaceholderText(/Describe your custom web stack/i);
      await user.type(input, 'Custom Stack');
      await user.click(screen.getByRole('button', { name: /Cancel/i }));

      expect(screen.queryByPlaceholderText(/Describe your custom web stack/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Define Custom Stack/i })).toBeInTheDocument();
    });
  });

  describe('Reasoning Input', () => {
    it('should show reasoning input after stack selection', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
      if (stackCard) {
        fireEvent.click(stackCard);
      }

      await waitFor(() => {
        expect(screen.getByText(/Why did you choose this stack/i)).toBeInTheDocument();
      });
    });

    it('should allow reasoning input', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
      if (stackCard) {
        fireEvent.click(stackCard);
      }

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/I chose this because/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/I chose this because/i);
      await user.type(textarea, 'We have TypeScript experience');

      expect(textarea).toHaveValue('We have TypeScript experience');
    });

    it('should include reasoning in stack selection callback', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
      if (stackCard) {
        fireEvent.click(stackCard);
      }

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/I chose this because/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/I chose this because/i);
      await user.type(textarea, 'Team expertise');

      await user.click(screen.getByRole('button', { name: /Confirm Stack Choice/i }));

      expect(mockOnStackSelect).toHaveBeenCalledWith(
        'nextjs_only_web',
        'Team expertise',
        'web'
      );
    });
  });

  describe('Loading State', () => {
    it('should disable confirm button when isLoading is true', () => {
      render(
        <StackSelection
          selectedStack="nextjs_only_web"
          onStackSelect={mockOnStackSelect}
          isLoading={true}
        />
      );

      const confirmButton = screen.getByRole('button', { name: /Confirming/i });
      expect(confirmButton).toBeDisabled();
    });

    it('should show loading text when isLoading is true', () => {
      render(
        <StackSelection
          selectedStack="nextjs_only_web"
          onStackSelect={mockOnStackSelect}
          isLoading={true}
        />
      );

      expect(screen.getByText(/Confirming/i)).toBeInTheDocument();
    });

    it('should show normal text when isLoading is false', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
      if (stackCard) {
        fireEvent.click(stackCard);
      }

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Confirm Stack Choice/i })).toBeInTheDocument();
      });
    });
  });

  describe('Selection Summary', () => {
    it('should show selection summary when stack is selected', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      const stackCard = screen.getByText(/Next.js Full-Stack/i).closest('[class*="cursor-pointer"]');
      if (stackCard) {
        fireEvent.click(stackCard);
      }

      await waitFor(() => {
        expect(screen.getByText(/Selected:/i)).toBeInTheDocument();
        expect(screen.getByText(/Next.js Full-Stack for web apps/i)).toBeInTheDocument();
      });
    });

    it('should not show summary for custom stacks', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const input = screen.getByPlaceholderText(/Describe your custom web stack/i);
      await user.type(input, 'Custom');

      await waitFor(() => {
        expect(screen.queryByText(/Selected:/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Clear Selection', () => {
    it('should clear selection when clear button clicked', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <StackSelection
          selectedStack="nextjs_only_web"
          onStackSelect={mockOnStackSelect}
        />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      const clearButton = screen.getByRole('button', { name: /Clear Selection/i });
      await user.click(clearButton);

      expect(mockOnStackSelect).toHaveBeenCalledWith('');
    });
  });

  describe('Platform Switch', () => {
    it('should clear custom stack when switching platforms', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));
      await user.click(screen.getByRole('button', { name: /Define Custom Stack/i }));

      const input = screen.getByPlaceholderText(/Describe your custom web stack/i);
      await user.type(input, 'Custom Stack');

      await user.click(screen.getByRole('button', { name: /Mobile App/i }));

      await waitFor(() => {
        expect(screen.queryByDisplayValue('Custom Stack')).not.toBeInTheDocument();
      });
    });
  });

  describe('Stack Details', () => {
    it('should display strengths and trade-offs', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        expect(screen.getByText(/Strengths/i)).toBeInTheDocument();
        expect(screen.getByText(/Trade-offs/i)).toBeInTheDocument();
      });
    });

    it('should display scaling information', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection onStackSelect={mockOnStackSelect} />
      );

      await user.click(screen.getByRole('button', { name: /Web App Only/i }));

      await waitFor(() => {
        expect(screen.getByText(/Scaling/i)).toBeInTheDocument();
      });
    });
  });
});
