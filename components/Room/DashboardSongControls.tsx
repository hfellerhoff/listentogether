import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import ProgressSlider from './ProgressSlider';

interface Props {}

const DashboardSongControls = (props: Props) => {
  const [progress, setProgress] = useState(0);

  // const currentSong = roomInformation ? roomInformation.currentSong : null;

  // const addedAt = currentSong
  //   ? currentSong.timestampUpdated
  //     ? (currentSong.timestampUpdated as firebase.firestore.Timestamp)
  //         .toDate()
  //         .getTime()
  //     : null
  //   : null;

  // useEffect(() => {
  //   const calculateProgress = () => {
  //     setProgress(
  //       currentSong && addedAt ? Date.now() - addedAt + currentSong.progress : 0
  //     );
  //   };

  //   if (!addedAt) return;
  //   const interval = setInterval(calculateProgress, 250);

  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [addedAt, currentSong]);

  // const playback = {
  //   progress,
  //   length: currentSong ? currentSong.duration : 1,
  // };

  return (
    <Flex direction='column' align='center' justify='center'>
      {/* <SongControl
        isPlaying={currentSong?.isPlaying || false}
        isOwner={true}
        isDisabled={!roomInformation?.currentSong}
      />
      <ProgressSlider playback={playback} /> */}
    </Flex>
  );
};

export default DashboardSongControls;
