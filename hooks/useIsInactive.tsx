import { useEffect, useState } from 'react';

export default function useIsInactive() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [inactivityTimeout, setInactivityTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
    } else {
      // false for not mobile device
      setIsDesktop(true);
    }
  }, []);

  useEffect(() => {
    if (!window) return;

    const onInteract = () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);

      setInactivityTimeout(
        setTimeout(() => {
          if (!isInactive) setIsInactive(true);
        }, 5000)
      );

      if (!isInactive) return;
      setIsInactive(false);
    };

    window.addEventListener('mousemove', onInteract);
    window.addEventListener('keydown', onInteract);

    return () => {
      window.removeEventListener('mousemove', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, [
    window,
    isInactive,
    setIsInactive,
    inactivityTimeout,
    setInactivityTimeout,
  ]);

  // Safari had weird flickering issues, but I couldn't bear removing the fun UI fade out
  // for all browsers
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return isInactive && isDesktop && !isSafari;
}
