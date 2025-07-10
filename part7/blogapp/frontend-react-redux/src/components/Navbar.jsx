import styled from "styled-components";
import Button from "./Buttons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { StyledNavLink } from "../styled/NavLink";
import Icon from './Icon'
import { setSidebarMode, toggleDarkMode } from "../features/ui/uiSlice";

const NavbarW = styled.nav`
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.bg};
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.brown}`};
  padding-inline: var(--space-s);
`

const HelloUser = styled.p`
  flex: 1;
  font-weight: 600;
  text-align: right;
  align-content: center;
  margin-right: 1.5rem;

  & u {
    color: ${({ theme }) => theme.colors.textAccent};
  }
`

export default function Navbar() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const sidebarMode = useSelector(state => state.ui.sidebarMode)
  const darkMode = useSelector(state => state.ui.darkMode)
  
  const isMobile = window.innerWidth <= 768

  console.log("sidebarmode", sidebarMode);
  

  const handleToggle = () => {
    if (isMobile) dispatch(setSidebarMode(sidebarMode === 'closed' ? 'openSmall' : 'closed'))
    else dispatch(setSidebarMode(sidebarMode === 'open' ? 'mini' : 'open'))
  }

  return (
    <NavbarW>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div onClick={handleToggle} style={{ marginRight: '0.5rem' }}> 
          <Icon name='Menu' /> 
        </div>
        <StyledNavLink to={'/users'} end> Users </StyledNavLink>&nbsp;
        <StyledNavLink to={'/blogs'} end> Blogs </StyledNavLink>
      </div>

      <HelloUser> {user.status === "succeeded" && <> Hello <u>{user.username}</u>! </>} </HelloUser>

      <div>
        <Button onClick={() => dispatch(logout())} variant='secondary'> Logout </Button>&nbsp;
        <Button onClick={() => dispatch(toggleDarkMode(darkMode ? false : true))}> {darkMode ? 'LightMode' : 'DarkMode'} </Button>
      </div>
    </NavbarW>
  )
}