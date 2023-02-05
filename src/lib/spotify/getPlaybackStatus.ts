import { PLAYBACK_STATE } from 'constants/playback';

import { PlaybackProps } from '../playback';

export const getPlaybackStatus = async ({ spotify }: PlaybackProps) => {
  const playback = await spotify.getMyCurrentPlaybackState();

  if (playback?.progress_ms === null || !playback?.item) {
    return PLAYBACK_STATE.NONE;
  }

  if (playback.repeat_state !== 'off') {
    spotify.setRepeat('off');
  }

  if (playback.progress_ms >= playback.item.duration_ms)
    return PLAYBACK_STATE.FINISHED;
  // if (!playback.item.is_playable) return PLAYBACK_STATE.LOADING;
  if (playback.is_playing) return PLAYBACK_STATE.PLAYING;
  else return PLAYBACK_STATE.PAUSED;
};
