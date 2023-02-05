import React, { useEffect, useRef } from 'react';

import { useAtom } from 'jotai';

import { sidepanelAtom } from '../../../state/sidepanelAtom';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [sidepanelStatus] = useAtom(sidepanelAtom);

  useEffect(() => {
    if (elementRef.current && sidepanelStatus.isRightOpen) {
      setTimeout(() => elementRef.current?.scrollIntoView(), 350);
    }
  }, [sidepanelStatus]);

  return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;
