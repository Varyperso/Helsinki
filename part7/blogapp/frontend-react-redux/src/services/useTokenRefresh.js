import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshToken } from '../features/user/userSlice'

let lastRefresh = 0;

const useTokenAutoRefresh = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (!token) return;
    const handleClick = () => {
      const now = Date.now();
      if (now - lastRefresh > 10000) { // 10 sec cooldown to avoid spamming
        dispatch(refreshToken());
        lastRefresh = now;
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [token, dispatch]);
};

export default useTokenAutoRefresh;