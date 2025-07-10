import styled from 'styled-components';

// have to set the parents backgroud color for this one to work, also use the prop "isolate = true" if no stacking context below
const Wrapper = styled.div`
  display: block;
  position: relative;
  background: inherit;
  border-radius: inherit;
  isolation: ${({ $isolate }) => ($isolate ? 'isolate' : 'auto')}; 

  &::before, &::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    z-index: -1;

    opacity: 0.5;

    background: ${({ $spinner }) => $spinner
    ? `conic-gradient(from var(--angle) at center, oklch(0.48 0.12 275), oklch(0.48 0.12 250), oklch(0.56 0.22 145), oklch(0.48 0.12 275))`
    : `conic-gradient(rgb(0, 101, 169), rgb(144, 0, 255), rgb(0, 101, 169))`
    };
    animation: spinAngle 5s linear infinite;
  }

  &::after {
    filter: ${({ $blurSize }) => `blur(${$blurSize})`};
    opacity: 0.6;
  }

  @keyframes spinAngle {
    to {
      --angle: 360deg;
    }
  }
`;

export default function GradientBorderWrapper({ children, isolate = false, blurSize = '0rem', spinner = false }) { // need to make colors arr prop
  return (
    <Wrapper $isolate={isolate} $blurSize={blurSize} $spinner={spinner}>
      {children}
    </Wrapper>
  )
}