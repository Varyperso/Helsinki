import { NavLink } from 'react-router'
import styled from 'styled-components'

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.navlink};
  padding: 0.5rem 1rem;
  border-radius: 0.5em;

  &.active {
    background-color: ${({ theme }) => theme.colors.navlinkActive};
  }
  &:not(.active):hover {
    background-color: ${({ theme }) => theme.colors.hover.navlink};
  }
`