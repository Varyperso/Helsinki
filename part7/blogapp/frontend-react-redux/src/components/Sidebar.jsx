import { useSelector } from 'react-redux';
import Icon from './Icon';
import styled from 'styled-components';

const SidebarStyled = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1;
  min-width: ${({ theme }) => theme.layout.sidebarWidth};
  background-color: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
  opacity: 1;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    ${({ $sidebarMode }) => $sidebarMode !== 'closed' && `min-width: 8rem;`}
    ${({ $sidebarMode }) => $sidebarMode === 'closed' && `min-width: 0rem; translate: -100% 0%; opacity: 0;`}
  }

  & > * {
    padding: var(--space-s);
  }
  & > :first-child {
    margin-top: var(--space-s);
  }
`

const SidebarItem = styled.div`
  display: flex;
  align-items: center;

  transition: all 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.textLight}
  }
  &:hover svg {
    fill: ${({ theme }) => theme.colors.light.brown};
    stroke: ${({ theme }) => theme.colors.brown};
  }
`;

const Label = styled.span`
  margin-inline: ${({ $visible }) => ($visible ? '0.5rem' : '0rem')};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateX(0)' : 'translateX(-1.5rem)')};
  max-width: ${({ $visible }) => ($visible ? '4rem' : '0rem')};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  user-select: none;

  transition: opacity 0.2s ease, transform 0.3s ease, max-width 0.4s ease, margin-inline 0.6s ease;
`;

const Sidebar = () => {
  const sidebarMode = useSelector(state => state.ui.sidebarMode)

  return (
    <SidebarStyled $sidebarMode={sidebarMode}>
      <SidebarItem>
        <Icon name="Users" />
        <Label $visible={sidebarMode !== 'mini' && sidebarMode !== 'closed'}>Home</Label>
      </SidebarItem>
      <SidebarItem>
        <Icon name="Settings" />
        <Label $visible={sidebarMode !== 'mini' && sidebarMode !== 'closed'}>Settings</Label>
      </SidebarItem>
      <SidebarItem>
        <Icon name="List" />
        <Label $visible={sidebarMode !== 'mini' && sidebarMode !== 'closed'}>List</Label>
      </SidebarItem>
      <SidebarItem>
        <Icon name="Cart" />
        <Label $visible={sidebarMode !== 'mini' && sidebarMode !== 'closed'}>Cart</Label>
      </SidebarItem>
    </SidebarStyled>
  )
}

export default Sidebar