import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarMode } from "../features/ui/uiSlice";

export default function useScreenResize() {
  const dispatch = useDispatch()
  const sidebarMode = useSelector(state => state.ui.sidebarMode)

  const sidebarModeRef = useRef(sidebarMode);

  useEffect(() => {
    if (sidebarMode === 'open' || sidebarMode === 'mini') sidebarModeRef.current = sidebarMode; // save previous open state
  }, [sidebarMode]);

  useEffect(() => {
    let debounceTimer

    const handleResize = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        const width = window.innerWidth
        // open & hit closed brekapoint
        if (width <= 768 && (sidebarMode === 'open' || sidebarMode === 'mini')) dispatch(setSidebarMode('closed'))
        // closed & hit open breakpoint
        else if (width > 768 && (sidebarMode === 'closed' || sidebarMode === 'openSmall')) dispatch(setSidebarMode(sidebarModeRef.current))
      }, 50)
    };

    window.addEventListener('resize', handleResize)
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(debounceTimer)
    }
  }, [dispatch, sidebarMode])
}