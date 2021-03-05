import React, { useState } from 'react';
import {
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { FiVolumeX, FiVolume, FiVolume1, FiVolume2 } from 'react-icons/fi';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSpotifyAuthentication from '../../hooks/useSpotifyAuthentication';

interface Props {}

const VolumeSlider = (props: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const { accessToken } = useSpotifyAuthentication();

  const [localVolume, setLocalVolume] = useState(100);

  const updateSpotifyVolume = (value: number) => {
    setLocalVolume(value);

    if (spotifyApi) {
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
      <Slider
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
      </Slider>
    </Flex>
  );
};
export default VolumeSlider;
