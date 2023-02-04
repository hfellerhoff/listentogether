import { useEffect, useState } from 'react';

export default function useHasAllowedAutoplay() {
  const [hasAllowedAutoPlay, setHasAllowedAutoPlay] = useState(false);

  useEffect(() => {
    if (!window) return;

    const onInteract = () => {
      if (!hasAllowedAutoPlay) setHasAllowedAutoPlay(true);
    };

    window.addEventListener('mousedown', onInteract);

    return () => {
      window.removeEventListener('mousedown', onInteract);
    };
  }, [hasAllowedAutoPlay, setHasAllowedAutoPlay]);

  return hasAllowedAutoPlay;
}
