import { NavLink } from 'react-router'
import styled from 'styled-components'

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  padding: var(--space-xs) var(--space-s);
  border: ${({ theme }) => `1px solid ${theme.colors.brown}`};
  border-radius: 0.25em;

  &.active {
    background-color: ${({ theme }) => theme.colors.bgAccent};
    color: ${({ theme }) => theme.colors.light.beige};
    border: ${({ theme }) => `1px solid ${theme.colors.light.brown}`};
  }
  &:not(.active):hover {
    color: ${({ theme }) => theme.colors.textLight};
    border: ${({ theme }) => `1px solid ${theme.colors.light.brown}`};
  }
`