import { useAtom } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { sidepanelAtom } from '../../../state/sidepanelAtom';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>();
  const [sidepanelStatus] = useAtom(sidepanelAtom);

  useEffect(() => {
    if (elementRef && elementRef.current && sidepanelStatus.isRightOpen) {
      setTimeout(() => elementRef.current.scrollIntoView(), 350);
    }
  }, [sidepanelStatus, elementRef]);

  return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;
