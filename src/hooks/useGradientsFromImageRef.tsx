import { useState, useEffect } from 'react';

import Vibrant from 'node-vibrant';

const useGradientsFromImageRef = (src: string | undefined) => {
  const [firstColor, setFirstColor] = useState([0, 0, 0]);
  const [secondColor, setSecondColor] = useState([0, 0, 0]);

  useEffect(() => {
    const getGradient = async () => {
      if (!src) return;

      const palatte = await Vibrant.from(src)
        .getPalette()
        .catch((err) => console.error(err));

      if (!palatte?.DarkMuted || !palatte?.DarkVibrant) return;

      setFirstColor(palatte.DarkMuted.rgb);
      setSecondColor(palatte.DarkVibrant.rgb);
    };

    if (src) getGradient();
  }, [src]);

  const r1 = firstColor[0];
  const g1 = firstColor[1];
  const b1 = firstColor[2];

  const r2 = secondColor[0];
  const g2 = secondColor[1];
  const b2 = secondColor[2];

  const normalGradient = `linear-gradient(to bottom right, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
  const hoverGradient = `linear-gradient(to bottom right, rgb(${r1 + 20}, ${
    g1 + 20
  }, ${b1 + 20}), rgb(${r2 + 20}, ${g2 + 20}, ${b2 + 20}))`;

  return { normalGradient, hoverGradient };
};

export default useGradientsFromImageRef;
