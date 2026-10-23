import { useState } from 'react';

export function useAuth() {
  const [state, setState] = useState('idle');

  const fetchUser = async () => {
    setState('loading'); // 先切換成 loading 狀態
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setState('authenticated');
    } catch (error) {
      setState('error');
    }
  };

  return { state, fetchUser };
}