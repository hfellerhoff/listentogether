import React from 'react';
import { Flex, Tooltip, Button } from '@chakra-ui/react';
import VolumeSlider from './VolumeSlider';
import { FiSpeaker } from 'react-icons/fi';

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
