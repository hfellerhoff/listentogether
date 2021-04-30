import React, { useEffect, useRef } from 'react';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView();
    }
  });

  return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;
