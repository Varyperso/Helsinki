import styled from "styled-components";
import Button from "./Buttons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { StyledNavLink } from "../styled/NavLink";

const NavbarW = styled.nav`
  display: flex;
  border-bottom: 1px solid brown;
  padding-inline: ${({ theme }) => theme.layout.wrapperPadding}
`

const HelloUser = styled.p`
  flex-grow: 1;
  text-align: right;
  align-content: center;
  margin-right: 1rem;
`

export default function Navbar({ darkMode, setDarkMode }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  return (
    <NavbarW>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledNavLink to={'/users'} end> users </StyledNavLink>&nbsp;&nbsp;
        <StyledNavLink to={'/blogs'} end> blogs </StyledNavLink>
      </div>

      <HelloUser> {user.status === "succeeded" && <>Hello <u style={{ color: 'rgb(129, 180, 238)'}}>{user.username}</u>!</>}</HelloUser>

      <div>
        <Button onClick={() => dispatch(logout())} variant='secondary'> Logout </Button> {' '}
        <Button onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'LightMode' : 'DarkMode'}</Button>
      </div>
    </NavbarW>
  )
}