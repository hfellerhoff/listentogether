import { PLAYBACK_STATE } from 'constants/playback';

import { PlaybackProps } from '../playback';

export const getPlaybackStatus = async ({ youtube }: PlaybackProps) => {
  if (!youtube) return PLAYBACK_STATE.NONE;

  const stateCode = await youtube.getPlayerState();

  switch (stateCode) {
    case -1: // 'unstarted'
    case 2: // 'paused'
      return PLAYBACK_STATE.PAUSED;
    case 0: // 'ended'
      return PLAYBACK_STATE.FINISHED;
    case 1: // 'playing'
      return PLAYBACK_STATE.PLAYING;
    case 3: // 'buffering'
    case 5: // 'video-cued'
      return PLAYBACK_STATE.LOADING;
    default:
      return PLAYBACK_STATE.NONE;
  }
};
