// Buttons.jsx
import styled from 'styled-components';

// Styled version (pure CSS-in-JS)
const StyledButton = styled.button`
  min-height: 32px;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: ${({ theme, primary }) => primary ? theme.colors.primary : theme.colors.secondary};
  color: ${({ primary }) => primary ? 'white' : 'black'};
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background-color 0.2s ease;

  &:hover {
    background: linear-gradient(180deg, #457b9d 5%, #1d3557 95%);
  }
`;

// Smart component with logic
function Button({ children, isLoading, variant = 'primary', ...rest }) {
  return (
    <StyledButton variant={variant} disabled={isLoading || rest.disabled} {...rest}>
      {isLoading ? 'Loading…' : children}
    </StyledButton>
  );
}

export { StyledButton };
export default Button;

// examples:
// <Button onClick={() => alert('Clicked!')}>Primary</Button>
// <Button variant="secondary">Secondary</Button>
// <Button variant="danger" isLoading>Delete</Button>