import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Demos from '../demos';

describe('Demos Component', () => {
  const mockSetCurrentPage = jest.fn();
  const mockSetAge = jest.fn();
  const mockSetFeet = jest.fn();
  const mockSetInches = jest.fn();
  const mockSetWeight = jest.fn();

  const defaultProps = {
    currentPage: 'demos',
    setCurrentPage: mockSetCurrentPage,
    UserName: 'TestUser',
    setAge: mockSetAge,
    Age: '',
    Feet: '',
    setFeet: mockSetFeet,
    Inches: '',
    setInches: mockSetInches,
    Weight: '',
    setWeight: mockSetWeight
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message with username', () => {
    render(<Demos {...defaultProps} />);
    expect(screen.getByText(`Hello ${defaultProps.UserName}!`)).toBeInTheDocument();
  });

  it('validates age input', () => {
    render(<Demos {...defaultProps} Age="13" />);
    const submitButton = screen.getByText('Next');
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter a valid value for age.')).toBeInTheDocument();
  });

  it('validates feet input', () => {
    render(<Demos {...defaultProps} Age="20" Feet="3" />);
    const submitButton = screen.getByText('Next');
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter a valid value for feet.')).toBeInTheDocument();
  });

  it('validates inches input', () => {
    render(<Demos {...defaultProps} Age="20" Feet="5" Inches="12" />);
    const submitButton = screen.getByText('Next');
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter a valid value for inches.')).toBeInTheDocument();
  });

  it('validates weight input', () => {
    render(<Demos {...defaultProps} Age="20" Feet="5" Inches="10" Weight="50" />);
    const submitButton = screen.getByText('Next');
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter a valid value for weight.')).toBeInTheDocument();
  });

  it('handles valid form submission', () => {
    render(<Demos {...defaultProps} Age="25" Feet="5" Inches="10" Weight="150" />);
    const submitButton = screen.getByText('Next');
    fireEvent.click(submitButton);
    expect(mockSetCurrentPage).toHaveBeenCalledWith('input');
  });

  it('updates age value on input change', () => {
    render(<Demos {...defaultProps} />);
    const ageInput = screen.getByLabelText('What is your age?');
    fireEvent.change(ageInput, { target: { value: '25' } });
    expect(mockSetAge).toHaveBeenCalledWith('25');
  });

  it('updates height values on input change', () => {
    render(<Demos {...defaultProps} />);
    const feetInput = screen.getByLabelText('What is your height?');
    const inchesInput = screen.getAllByRole('spinbutton')[2];
    
    fireEvent.change(feetInput, { target: { value: '5' } });
    fireEvent.change(inchesInput, { target: { value: '10' } });
    
    expect(mockSetFeet).toHaveBeenCalledWith('5');
    expect(mockSetInches).toHaveBeenCalledWith('10');
  });

  it('updates weight value on input change', () => {
    render(<Demos {...defaultProps} />);
    const weightInput = screen.getByLabelText('What is your weight?');
    fireEvent.change(weightInput, { target: { value: '150' } });
    expect(mockSetWeight).toHaveBeenCalledWith('150');
  });

  it('shows next button only when all fields are filled', () => {
    const props = {
      ...defaultProps,
      Age: '25',
      Feet: '5',
      Inches: '10',
      Weight: '150'
    };
    render(<Demos {...props} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toHaveClass('hidden-text');
  });
});
