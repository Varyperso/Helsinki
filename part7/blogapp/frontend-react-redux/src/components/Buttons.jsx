import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  padding: var(--space-s);
  margin-block: 0.25em;
  border: none;
  border-radius: 0.5em;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.2s ease;
  background: ${({ theme, $variant }) => $variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background: ${({ theme, $variant }) => $variant === 'primary' ? theme.colors.hover.primary : theme.colors.hover.secondary};
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