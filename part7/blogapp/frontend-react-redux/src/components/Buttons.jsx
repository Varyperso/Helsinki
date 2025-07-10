import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  min-height: 2rem;
  padding: var(--space-xs) var(--space-s);
  margin-block: 0.25rem;
  border: none;
  border-radius: 0.5em;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.2s ease;
  background: ${({ theme, $variant }) => $variant === 'primary' ? theme.colors.button.primary : theme.colors.button.secondary};
  color: ${({ theme }) => theme.colors.text};
  border: 0.125rem solid transparent;
  
  &:hover {
    background: ${({ theme, $variant }) => $variant === 'primary' ? theme.colors.button.primaryHover : theme.colors.button.secondaryHover};
    border: ${({ theme, $variant }) => `0.125rem solid ${$variant === 'primary' ? theme.colors.button.primary : theme.colors.button.secondary}`};
  }
`;

function Button({ children, isLoading, variant = 'primary', ...rest }) {
  return (
    <StyledButton $variant={variant} disabled={isLoading || rest.disabled} {...rest}>
      {isLoading ? 'Loading…' : children}
    </StyledButton>
  );
}

export { StyledButton };
export default Button;