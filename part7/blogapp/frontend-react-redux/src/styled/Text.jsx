import styled from 'styled-components'

const fontSizes = {
  xs: 0.75,   // 12px
  sm: 0.875,  // 14px 
  md: 1,      // 16px = 1rem
  lg: 1.125,  // 18px
  xl: 1.375,  // 22px
  xxl: 1.875, // 30px
  xxxl: 2.75, // 44px
}

const fontColors = {
  dark: 'textDark',
  light: 'textLight',
  accent: 'textAccent',
}

const createTextElement = (tag) => {
  return styled(tag)`
    font-size: ${({ $size }) => `${fontSizes[$size]}rem`};
    font-weight: ${({ $weight }) => $weight || 400};
    line-height: ${({ $lh, $size }) => $lh / fontSizes[$size]};
    margin-bottom: ${({ $mb }) => $mb ? `${$mb}rem` : 0};
    margin-top: ${({ $mt }) => $mt ? `${$mt}rem` : 0};
    color: ${({ theme, $color }) => theme.colors[fontColors[$color]] || theme.colors.text};
  `;
}

// can use as='li' prop to render different html elements as P or as Span(block/inline)
const H1Styled = createTextElement('h1')
const H2Styled = createTextElement('h2')
const H3Styled = createTextElement('h3')
const PStyled = createTextElement('p')
const SpanStyled = createTextElement('span')

const wrap = (Component, fixedSize) => ({ children, size = fixedSize || 'md', weight, lh = '1.5', mb, mt, color, ...rest }) => {
    return (
      <Component $size={size} $weight={weight} $lh={lh} $mb={mb} $mt={mt} $color={color} {...rest}>
        {children}
      </Component>
    )
}

export const H1 = wrap(H1Styled, 'xxxl')
export const H2 = wrap(H2Styled, 'xxl')
export const H3 = wrap(H3Styled, 'xl')
export const P = wrap(PStyled)
export const Span = wrap(SpanStyled)