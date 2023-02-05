import YouTube, { YouTubeProps } from 'react-youtube';

type Props = {
  videoID: string;
  onGetDurationMS: (duration_ms: number) => void;
};

const YouTubePlayerPreview = ({ videoID, onGetDurationMS }: Props) => {
  const onPlayerReady: YouTubeProps['onReady'] = async (event) => {
    const durationSeconds = await event.target.getDuration();
    onGetDurationMS(durationSeconds * 1000);
  };

  const opts = {
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
    },
  };

  return (
    <YouTube
      id='youtube-player'
      videoId={videoID}
      title='YouTube video player'
      onReady={onPlayerReady}
      opts={opts}
    ></YouTube>
  );
};

export default YouTubePlayerPreview;
