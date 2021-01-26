import React from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/core';

interface Props {
  playback?: {
    progress: number;
    length: number;
  };
}

const ProgressSlider = ({ playback }: Props) => {
  return (
    <>
      {playback ? (
        <Slider
          min={0}
          max={playback.length}
          value={playback.progress}
          step={1}
          w={40}
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb />
        </Slider>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProgressSlider;
