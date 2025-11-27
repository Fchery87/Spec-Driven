import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StackSelection } from '@/components/orchestration/StackSelection';

describe('StackSelection Component', () => {
  const mockOnStackSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Architecture Pattern Display', () => {
    it('should render all three architecture patterns', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getByText('Web Application')).toBeInTheDocument();
      expect(screen.getByText('Mobile Application')).toBeInTheDocument();
      expect(screen.getByText('API-First Platform')).toBeInTheDocument();
    });

    it('should display pattern descriptions', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getByText(/Single unified codebase with integrated API layer/i)).toBeInTheDocument();
      expect(screen.getByText(/Cross-platform native apps/i)).toBeInTheDocument();
      expect(screen.getByText(/Headless architecture serving multiple clients/i)).toBeInTheDocument();
    });

    it('should display stack examples for each pattern', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getByText('Next.js + Drizzle')).toBeInTheDocument();
      expect(screen.getByText('React Native + Expo')).toBeInTheDocument();
      expect(screen.getByText('Node.js/Go/Rust API')).toBeInTheDocument();
    });

    it('should show pattern type badges', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getByText('Monolithic Full-Stack')).toBeInTheDocument();
      expect(screen.getByText('Mobile-First')).toBeInTheDocument();
      expect(screen.getByText('Headless/Multi-Client')).toBeInTheDocument();
    });
  });

  describe('Stack Selection', () => {
    it('should call onStackSelect when web application is clicked', async () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      const webCard = screen.getByText('Web Application').closest('[class*="cursor-pointer"]');
      if (webCard) {
        fireEvent.click(webCard);
      }

      await waitFor(() => {
        expect(mockOnStackSelect).toHaveBeenCalledWith('web_application', '');
      });
    });

    it('should call onStackSelect when mobile application is clicked', async () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      const mobileCard = screen.getByText('Mobile Application').closest('[class*="cursor-pointer"]');
      if (mobileCard) {
        fireEvent.click(mobileCard);
      }

      await waitFor(() => {
        expect(mockOnStackSelect).toHaveBeenCalledWith('mobile_application', '');
      });
    });

    it('should call onStackSelect when API-first platform is clicked', async () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      const apiCard = screen.getByText('API-First Platform').closest('[class*="cursor-pointer"]');
      if (apiCard) {
        fireEvent.click(apiCard);
      }

      await waitFor(() => {
        expect(mockOnStackSelect).toHaveBeenCalledWith('api_first_platform', '');
      });
    });

    it('should highlight selected stack with ring styling', () => {
      render(
        <StackSelection
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      const selectedCard = screen.getByText('Web Application').closest('[class*="ring-2"]');
      expect(selectedCard).toBeInTheDocument();
    });

    it('should show checkmark on selected stack', () => {
      render(
        <StackSelection
          selectedStack="mobile_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      const mobileCard = screen.getByText('Mobile Application').closest('[class*="cursor-pointer"]');
      const checkmark = mobileCard?.querySelector('svg.text-emerald-500');
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe('Custom Architecture Option', () => {
    it('should display custom architecture section', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getByText('Custom Architecture')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Define Custom Architecture/i })).toBeInTheDocument();
    });

    it('should show input when define custom is clicked', async () => {
      const user = userEvent.setup();
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      await user.click(screen.getByRole('button', { name: /Define Custom Architecture/i }));

      expect(screen.getByPlaceholderText(/Describe your custom architecture/i)).toBeInTheDocument();
    });

    it('should allow custom architecture input', async () => {
      const user = userEvent.setup();
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      await user.click(screen.getByRole('button', { name: /Define Custom Architecture/i }));

      const input = screen.getByPlaceholderText(/Describe your custom architecture/i);
      await user.type(input, 'Serverless with Edge Functions');

      expect(input).toHaveValue('Serverless with Edge Functions');
    });

    it('should call onStackSelect with custom when submitted', async () => {
      const user = userEvent.setup();
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      await user.click(screen.getByRole('button', { name: /Define Custom Architecture/i }));

      const input = screen.getByPlaceholderText(/Describe your custom architecture/i);
      await user.type(input, 'Custom Stack');
      await user.click(screen.getByRole('button', { name: /Use Custom Architecture/i }));

      expect(mockOnStackSelect).toHaveBeenCalledWith('custom', '');
    });

    it('should disable submit button when input is empty', async () => {
      const user = userEvent.setup();
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      await user.click(screen.getByRole('button', { name: /Define Custom Architecture/i }));

      const submitButton = screen.getByRole('button', { name: /Use Custom Architecture/i });
      expect(submitButton).toBeDisabled();
    });

    it('should cancel custom architecture and hide input', async () => {
      const user = userEvent.setup();
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      await user.click(screen.getByRole('button', { name: /Define Custom Architecture/i }));
      await user.click(screen.getByRole('button', { name: /Cancel/i }));

      expect(screen.queryByPlaceholderText(/Describe your custom architecture/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Define Custom Architecture/i })).toBeInTheDocument();
    });
  });

  describe('Reasoning Input', () => {
    it('should show reasoning input after stack selection', async () => {
      render(
        <StackSelection
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      expect(screen.getByText(/Why did you choose this architecture/i)).toBeInTheDocument();
    });

    it('should allow reasoning input', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      const textarea = screen.getByPlaceholderText(/We chose monolithic because/i);
      await user.type(textarea, 'Team has TypeScript expertise');

      expect(textarea).toHaveValue('Team has TypeScript expertise');
    });

    it('should include reasoning when confirming selection', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      const textarea = screen.getByPlaceholderText(/We chose monolithic because/i);
      await user.type(textarea, 'Fast iteration needed');
      await user.click(screen.getByRole('button', { name: /Confirm Architecture Choice/i }));

      expect(mockOnStackSelect).toHaveBeenCalledWith('web_application', 'Fast iteration needed');
    });
  });

  describe('Loading State', () => {
    it('should disable confirm button when isLoading is true', () => {
      render(
        <StackSelection
          selectedStack="web_application"
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
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
          isLoading={true}
        />
      );

      expect(screen.getByText(/Confirming/i)).toBeInTheDocument();
    });
  });

  describe('Selection Summary', () => {
    it('should show selection summary when stack is selected', () => {
      render(
        <StackSelection
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      expect(screen.getByText(/Selected:/i)).toBeInTheDocument();
      expect(screen.getByText(/Web Application architecture/i)).toBeInTheDocument();
    });

    it('should not show summary when no stack is selected', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.queryByText(/Selected:/i)).not.toBeInTheDocument();
    });
  });

  describe('Clear Selection', () => {
    it('should clear selection when clear button clicked', async () => {
      const user = userEvent.setup();
      render(
        <StackSelection
          selectedStack="web_application"
          onStackSelect={mockOnStackSelect}
        />
      );

      await user.click(screen.getByRole('button', { name: /Clear Selection/i }));

      expect(mockOnStackSelect).toHaveBeenCalledWith('');
    });
  });

  describe('Stack Details Display', () => {
    it('should display strengths for each pattern', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getAllByText(/Strengths/i).length).toBeGreaterThan(0);
    });

    it('should display trade-offs for each pattern', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getAllByText(/Trade-offs/i).length).toBeGreaterThan(0);
    });

    it('should display characteristics for each pattern', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getAllByText(/Characteristics/i).length).toBeGreaterThan(0);
    });

    it('should display best for section for each pattern', () => {
      render(<StackSelection onStackSelect={mockOnStackSelect} />);

      expect(screen.getAllByText(/Best For/i).length).toBeGreaterThan(0);
    });
  });
});
