import { Fragment, useState } from "react";
import styled from "styled-components";
import GradientBorderWrapper from "../components/GradientBorderWrapper"

const TabsWrapper = styled.div`
  width: 85%;
  max-width: ${({ $wrapperWidth }) => $wrapperWidth};
  margin: 2rem auto;
  border-radius: 1rem;
  isolation: isolate; 
  background-color: ${({ theme }) => theme.colors.bg};
`
//
const Tabs = styled.div`
  position: relative;
  display: flex;
  border-block-end: 1px solid rgb(57, 8, 8);
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0 0 -1px;
    z-index: -1;
    pointer-events: none;
    background-image: linear-gradient(rgb(48, 38, 38), rgb(42, 23, 23));
    border: 1px solid rgb(83, 36, 36);
    border-radius: 1rem 1rem 0 0;
    border-block-end: none;

    width: ${({ $tabsLength }) => `calc(100% / ${$tabsLength})`};
    translate: ${({ $activeTabIndex }) => `calc(${$activeTabIndex} * 100%)`};
    transition: translate 0.25s ease;
  }
`
const Radio = styled.input.attrs({ type: 'radio' })`
  display: none;

  &:checked + label {
    color: ${({ theme }) => theme.colors.textLight};
  }
`
const Label = styled.label`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textDark};
  transition: color 0.2s ease-in-out;
`
//
const TabContentWrapper = styled.div`
  
`
const TabContent = styled.div`
  padding: 1em;
  display: ${({ $index, $activeTabIndex }) => $index === $activeTabIndex ? 'block' : 'none'}
`

export default function SlidingTabs({ wrapperWidth = 600 }) {
  const [tabs, setTabs] = useState([{ header: 'tomtom1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ea perspiciatis sed commodi velit atque.'},{ header: 'tomtom', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ea perspiciatis sed commodi velit atque.'}, { header: 'kuzkuz', content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum delectus voluptatum, suscipit quam non sunt?'}, { header: 'bimdimba', content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum delectus voluptatum, suscipit quam non sunt? dfgdfg 36 gfdgdfgfdg'}])
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <TabsWrapper $wrapperWidth={`${wrapperWidth}px`}>
      <GradientBorderWrapper spinner blurSize='1rem' $isolate={true}>
        <Tabs $tabsLength={tabs.length} $activeTabIndex={selectedIndex}>
          {tabs.map((tab, i)=> 
            <Fragment key={tab.header}>
              <Radio id={tab.header} name='tabs' value={selectedIndex} defaultChecked={selectedIndex === i} onClick={() => setSelectedIndex(i)}/>
              <Label htmlFor={tab.header}> {tab.header} </Label>
            </Fragment>
          )}
        </Tabs>
        <TabContentWrapper>
          {tabs.map((tab, i)=> 
            <TabContent key={tab.header} $index={i} $activeTabIndex={selectedIndex}>
              <h2>{tab.header}</h2>
              <p>{tab.content}</p>
            </TabContent>
          )}
        </TabContentWrapper>
      </GradientBorderWrapper>
    </TabsWrapper>
  )


}
