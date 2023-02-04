import React from 'react';

import { Flex, Tooltip, Button } from '@chakra-ui/react';
import { FiSpeaker } from 'react-icons/fi';

import VolumeSlider from './VolumeSlider';

interface Props {
  onSpeakerClick: () => void;
}

const VolumeAndDeviceControl = ({ onSpeakerClick }: Props) => {
  return (
    <Flex align='center' justify='center'>
      <Tooltip
        label='Change playback device'
        aria-label='Change playback device'
        placement='bottom'
        zIndex={8}
      >
        <Button variant='ghost' onClick={onSpeakerClick}>
          <FiSpeaker fontSize={20} />
        </Button>
      </Tooltip>
      <VolumeSlider />
    </Flex>
  );
};

export default VolumeAndDeviceControl;
