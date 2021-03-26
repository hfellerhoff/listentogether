import { useState, useEffect } from 'react';
import { getBestContrast } from '../util/helpers/getBestContrast';
import ColorThief from 'colorthief';

const useGradientsFromImageRef = (
  image: React.MutableRefObject<HTMLImageElement | undefined>
) => {
  const [firstColor, setFirstColor] = useState([0, 0, 0]);
  const [secondColor, setSecondColor] = useState([0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (image.current) {
      image.current.setAttribute('crossOrigin', '');
      image.current.onload = () => {
        const colorThief = new ColorThief();
        const img = image.current as HTMLImageElement;
        if (!img) return;

        if (img.complete) {
          const colors = colorThief.getPalette(img);

          let colorOneSet = false;
          if (!colors) return;
          for (let i = 0; i < colors.length; i += 1) {
            const color = getBestContrast(colors[i]);

            if (color === '#ffffff') {
              if (!colorOneSet) {
                setFirstColor(colors[i]);
                colorOneSet = true;
              } else {
                setSecondColor(colors[i]);
                setIsLoading(false);
                return;
              }
            }
          }
        }
      };
    }
  }, [image]);

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

  return { normalGradient, hoverGradient, isLoading };
};

export default useGradientsFromImageRef;
