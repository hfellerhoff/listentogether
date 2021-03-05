import React from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';

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
          aria-label='Song progress'
          focusThumbOnChange={false}
          colorScheme='blue'
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProgressSlider;
