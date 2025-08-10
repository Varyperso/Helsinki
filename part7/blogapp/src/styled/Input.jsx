import styled from 'styled-components';

export const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.bgAccent};
  padding: 0.25em .5em;
  border-radius: 0.25em;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  caret-color: green;

  &:focus {
    border-color: ${({ theme }) => theme.colors.dark.brown};
    outline: none;
  }
  &:-webkit-autofill {
    transition: background-color 9999s ease-in-out 0s;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text} !important;
  }
`