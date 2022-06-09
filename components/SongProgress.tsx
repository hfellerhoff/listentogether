import { styled } from '@stitches/react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import useSpotifyTrack from '../hooks/spotify/useSpotifyTrack';
import useSongProgress from '../hooks/rooms/useSongProgress';
import Song from '../models/Song';

const StyledProgress = styled(ProgressPrimitive.Root, {
  position: 'relative',
  overflow: 'hidden',
  background: '$primary3',
  borderRadius: '99999px',
  height: '0.5rem',
  margin: '0 1.5rem',
  flex: 1,
});

const StyledIndicator = styled(ProgressPrimitive.Indicator, {
  backgroundColor: '$primary9',
  borderRadius: '99999px',
  width: '100%',
  height: '100%',
  transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
});

interface Props {
  song: Song;
}

// Your app...
const SongProgress = ({ song }: Props) => {
  const track = useSpotifyTrack(song);
  const progress = useSongProgress(song);

  const length = track ? track.duration_ms : 1;
  let progressPercent = ((length - progress) / length) * 100;
  if (progressPercent < 0) progressPercent = 0;
  if (progressPercent > 100) progressPercent = 100;

  return (
    <StyledProgress value={progressPercent}>
      <StyledIndicator
        style={{ transform: `translateX(-${progressPercent}%)` }}
      />
    </StyledProgress>
  );
};

export default SongProgress;
