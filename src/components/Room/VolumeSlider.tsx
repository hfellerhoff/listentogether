import { useState } from 'react';

import { Flex, IconButton } from '@chakra-ui/react';
import { FiVolume, FiVolume1, FiVolume2, FiVolumeX } from 'react-icons/fi';

import useStore from 'src/state/store';

const VolumeSlider = () => {
  const { spotify } = useStore((store) => ({
    spotify: store.spotify,
  }));

  const [localVolume, setLocalVolume] = useState(100);

  const updateSpotifyVolume = (value: number) => {
    setLocalVolume(value);

    if (spotify) {
      // spotifyApi.setAccessToken(accessToken);
      // spotifyApi.setVolume(value);
    }
  };

  return (
    <Flex>
      <IconButton
        variant='ghost'
        onClick={() => updateSpotifyVolume(localVolume > 0 ? 0 : 100)}
        icon={
          localVolume < 1 ? (
            <FiVolumeX fontSize={20} />
          ) : localVolume < 33 ? (
            <FiVolume fontSize={20} />
          ) : localVolume < 66 ? (
            <FiVolume1 fontSize={20} />
          ) : (
            <FiVolume2 fontSize={20} />
          )
        }
        aria-label={localVolume < 1 ? 'Unmute audio' : 'Mute audio'}
        mr={1}
      />
      {/* <Slider
        value={localVolume}
        onChangeEnd={(value) => {
          updateSpotifyVolume(value);
        }}
        // onBlur={() => updateSpotifyVolume(localVolume)}
        min={0}
        max={100}
        step={1}
        w={20}
        aria-label='slider-volume'
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>

        <SliderThumb />
      </Slider> */}
    </Flex>
  );
};
export default VolumeSlider;
