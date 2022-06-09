import { css, styled } from '@stitches/react';
import {
  ArrowLeftIcon,
  PlusIcon,
  Component1Icon,
  SunIcon,
  MoonIcon,
  DoubleArrowRightIcon,
  ChatBubbleIcon,
  CopyIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { Modal, modalAtom } from '../../state/modalAtom';
import { useTheme } from 'next-themes';
import { Tooltip, useClipboard, useColorMode } from '@chakra-ui/react';
import Room from '../../models/Room';
import SongProgress from '../SongProgress';
import Song from '../../models/Song';
import { sidepanelAtom } from '../../state/sidepanelAtom';

type Props = {
  room: Room;
  song: Song;
};

const FloatingContainer = styled('div', {
  position: 'absolute',
  zIndex: 1,
  display: 'flex',
  minHeight: '3rem',
  boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.18)',
  background: '$neutral1',
  borderRadius: 9999,

  alignItems: 'center',
  justifyContent: 'space-between',
  variants: {
    transparent: {
      true: {
        background: 'transparent',
        boxShadow: 'none',
      },
    },
    position: {
      tl: {
        top: '1rem',
        left: '1rem',
      },
      t: {
        top: '1rem',
        left: '50%',
        marginLeft: '-12rem',
        width: '24rem',
        borderRadius: 8,
      },
      tr: {
        top: '1rem',
        right: '1rem',
      },
      bl: {
        bottom: '1rem',
        left: '1rem',
      },
      b: {
        bottom: '1rem',
        left: '50%',
        marginLeft: '-12rem',
        width: '24rem',
        borderRadius: 8,
      },
      br: {
        bottom: '1rem',
        right: '1rem',
      },
    },
  },
});

const styles = css({
  display: 'block',

  cursor: 'pointer',
  padding: '1rem',
  borderRadius: '100%',

  variants: {
    transparent: {
      true: {
        background: 'transparent',
        boxShadow: 'none',
      },
    },
  },
});

const CircularButton = styled('button', styles);
const CircularLinkButton = styled('a', styles);

const RoomTitle = styled('h1', {
  fontSize: '1rem',
  fontWeight: 700,
});

const FixedButtons = ({ room, song }: Props) => {
  const [, setModal] = useAtom(modalAtom);
  const { colorMode, toggleColorMode } = useColorMode();
  const { theme, setTheme } = useTheme();
  const [sidepanelStatus, setSidepanelStatus] = useAtom(sidepanelAtom);

  const { hasCopied, onCopy } = useClipboard(room.slug);

  const handleQueue = () => setModal(Modal.QueueSong);
  const handleDevices = () => setModal(Modal.DeviceSelect);
  const handleColorMode = () => {
    toggleColorMode();

    const updatedTheme = colorMode === 'light' ? 'dark' : 'light';
    setTheme(updatedTheme);
  };
  const toggleChatVisibility = () => {
    setSidepanelStatus({
      ...sidepanelStatus,
      isRightOpen: !sidepanelStatus.isRightOpen,
    });
  };

  return (
    <>
      <Link href='/dashboard'>
        <FloatingContainer position='tl'>
          <Tooltip
            label='Leave room'
            aria-label='Leave room'
            placement='bottom-start'
            zIndex={8}
          >
            <CircularLinkButton aria-label='Leave room'>
              <ArrowLeftIcon />
            </CircularLinkButton>
          </Tooltip>
        </FloatingContainer>
      </Link>
      <FloatingContainer position='t'>
        <Tooltip
          label={hasCopied ? 'Copied!' : 'Copy room code'}
          aria-label={hasCopied ? 'Copied!' : 'Copy room code'}
          placement='bottom-start'
          zIndex={8}
        >
          <CircularButton
            onClick={onCopy}
            aria-label={hasCopied ? 'Copied!' : 'Copy room code'}
          >
            {hasCopied ? <CheckIcon /> : <CopyIcon />}
          </CircularButton>
        </Tooltip>
        <RoomTitle>{room.name}</RoomTitle>
        <Tooltip
          label='Toggle theme'
          aria-label='Toggle theme'
          placement='bottom-end'
          zIndex={8}
        >
          <CircularButton onClick={handleColorMode} aria-label='Toggle theme'>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </CircularButton>
        </Tooltip>
      </FloatingContainer>
      <FloatingContainer position='tr'>
        <Tooltip
          label='Queue song'
          aria-label='Queue song'
          placement='bottom-end'
          zIndex={8}
        >
          <CircularButton onClick={handleQueue} aria-label='Queue song'>
            <PlusIcon />
          </CircularButton>
        </Tooltip>
      </FloatingContainer>
      <FloatingContainer position='bl'>
        <Tooltip
          label='Choose playback device'
          aria-label='Choose playback device'
          placement='top-start'
          zIndex={8}
        >
          <CircularButton
            onClick={handleDevices}
            aria-label='Choose playback device'
          >
            <Component1Icon />
          </CircularButton>
        </Tooltip>
      </FloatingContainer>
      <FloatingContainer position='b'>
        <SongProgress song={song} />
      </FloatingContainer>
      <FloatingContainer position='br'>
        <Tooltip
          label={sidepanelStatus.isRightOpen ? 'Close chat' : 'Open chat'}
          aria-label={sidepanelStatus.isRightOpen ? 'Close chat' : 'Open chat'}
          placement='top-end'
          zIndex={8}
        >
          <CircularButton
            onClick={toggleChatVisibility}
            aria-label={
              sidepanelStatus.isRightOpen ? 'Close chat' : 'Open chat'
            }
          >
            {sidepanelStatus.isRightOpen ? (
              <DoubleArrowRightIcon />
            ) : (
              <ChatBubbleIcon />
            )}
          </CircularButton>
        </Tooltip>
      </FloatingContainer>
    </>
  );
};

export default FixedButtons;
