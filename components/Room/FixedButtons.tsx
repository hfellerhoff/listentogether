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
import { useTheme } from 'next-themes';
import {
  IconButton,
  Tooltip,
  useClipboard,
  useColorMode,
} from '@chakra-ui/react';
import Room from '../../models/Room';
import SongProgress from '../SongProgress';
import Song from '../../models/Song';
import { sidepanelAtom } from '../../state/sidepanelAtom';
import { isLoggedInAtom } from '../../state/userAtom';
import SongControl from 'components/SongControl';
import useStore, { Modal } from 'state/store';

type Props = {
  room: Room;
  song: Song;
  show: boolean;
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
  transition: 'opacity 0.5s',
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
    show: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
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

const FixedButtons = ({ room, song, show }: Props) => {
  const { handleSetModal } = useStore((store) => ({
    handleSetModal: store.handleSetModal,
  }));
  const { colorMode, toggleColorMode } = useColorMode();
  const { theme, setTheme } = useTheme();
  const [sidepanelStatus, setSidepanelStatus] = useAtom(sidepanelAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  const { hasCopied, onCopy } = useClipboard(room.slug);

  const handleQueue = handleSetModal(Modal.QueueSong);
  const handleDevices = handleSetModal(Modal.DeviceSelect);

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
        <FloatingContainer position='tl' show={show}>
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
      <FloatingContainer position='t' show={show}>
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
      {isLoggedIn && (
        <>
          <FloatingContainer position='tr' show={show}>
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
          <FloatingContainer
            position='bl'
            show={show}
            css={{
              padding: '0.5rem 0.75rem',
            }}
          >
            <Tooltip
              label='Choose Spotify playback device'
              aria-label='Choose Spotify playback device'
              placement='top-start'
            >
              <IconButton
                onClick={handleDevices}
                aria-label='Choose Spotify playback device'
                variant='ghost'
                icon={<Component1Icon />}
                rounded='full'
                mx={-0.5}
              />
            </Tooltip>
            <SongControl song={song} progress={1} />
          </FloatingContainer>
          <FloatingContainer position='b' show={show}>
            <SongProgress song={song} />
          </FloatingContainer>
          <FloatingContainer position='br' show={show}>
            <Tooltip
              label={sidepanelStatus.isRightOpen ? 'Close chat' : 'Open chat'}
              aria-label={
                sidepanelStatus.isRightOpen ? 'Close chat' : 'Open chat'
              }
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
      )}
    </>
  );
};

export default FixedButtons;
