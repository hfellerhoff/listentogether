import { Dispatch } from 'react';

import {
  Box,
  IconButton,
  Tooltip,
  useClipboard,
  useColorMode,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  ChatBubbleIcon,
  CheckIcon,
  Component1Icon,
  EyeClosedIcon,
  EyeOpenIcon,
  CopyIcon,
  DoubleArrowRightIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { css, styled } from '@stitches/react';
import clsx from 'clsx';
import { SetStateAction, useAtom } from 'jotai';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import SongControl from 'src/components/SongControl';
import { ConnectedRoomUser } from 'src/hooks/rooms/useConnectedRoomUsers';
import { useAuthContext } from 'src/lib/AuthProvider';
import useStore, { Modal } from 'src/state/store';

import Room from '../../models/Room';
import Song from '../../models/Song';
import { sidepanelAtom } from '../../state/sidepanelAtom';
import Avatar from '../Avatar';
import SongProgress from '../SongProgress';

const FloatingContainer = styled(Box, {
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
      tr2: {
        top: '1rem',
        right: '4.5rem',
        background: 'transparent',
        boxShadow: 'none',
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
// const CircularLinkButton = styled('a', styles);

const RoomTitle = styled('h1', {
  fontSize: '1rem',
  fontWeight: 700,
});

type Props = {
  room: Room;
  song?: Song;
  show: boolean;
  users: ConnectedRoomUser[];
  shouldAlwaysShowUI: boolean;
  setShouldAlwaysShowUI: Dispatch<SetStateAction<boolean>>;
};

const FixedButtons = ({
  room,
  song,
  show,
  users,
  shouldAlwaysShowUI,
  setShouldAlwaysShowUI,
}: Props) => {
  const { handleSetModal } = useStore((store) => ({
    handleSetModal: store.handleSetModal,
  }));
  const { colorMode, toggleColorMode } = useColorMode();
  const { theme, setTheme } = useTheme();
  const [sidepanelStatus, setSidepanelStatus] = useAtom(sidepanelAtom);
  const { isAuthenticated } = useAuthContext();

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

  const displayedUsers = users.slice(0, 5);
  const hiddenUsers = users.slice(5);

  return (
    <>
      <Tooltip
        label='Leave room'
        aria-label='Leave room'
        placement='bottom-start'
        zIndex={8}
      >
        <FloatingContainer
          position='tl'
          show={show}
          css={{
            padding: '0.5rem',
          }}
        >
          {/* TODO: Better routing */}
          <IconButton
            aria-label='Leave room'
            variant='ghost'
            icon={<ArrowLeftIcon />}
            rounded='full'
            role='link'
            as={Link}
            href='/'
          />
        </FloatingContainer>
      </Tooltip>
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
      <FloatingContainer position='tr2' show={show}>
        <div className='flex flex-row-reverse items-center justify-center w-full'>
          {hiddenUsers.length > 0 && (
            <Tooltip
              key='Overflow users'
              label={hiddenUsers.map((user) => user.name).join(', ')}
              aria-label='Other users in the room'
              placement='bottom-end'
              zIndex={8}
            >
              <div
                className={clsx('p-0.5 rounded-full shadow -ml-[1rem]', {
                  'bg-[#f8faf9]': colorMode === 'light',
                  'bg-[#191d1b]': colorMode !== 'light',
                })}
              >
                <Avatar src='' name={`${hiddenUsers.length.toString()}`} />
              </div>
            </Tooltip>
          )}
          {displayedUsers.map((user) => (
            <Tooltip
              key={user.connection_id}
              label={user.name}
              aria-label={user.name}
              placement='bottom-end'
              zIndex={8}
            >
              <div
                className={clsx('p-0.5 rounded-full shadow -ml-[1rem]', {
                  'bg-[#f8faf9]': colorMode === 'light',
                  'bg-[#191d1b]': colorMode !== 'light',
                })}
              >
                <Avatar src={user.profile_photo} name={user.name} />
              </div>
            </Tooltip>
          ))}
        </div>
      </FloatingContainer>
      {isAuthenticated && (
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
            <Tooltip
              label={
                shouldAlwaysShowUI ? 'Hide UI when inactive' : 'Always show UI'
              }
              aria-label={
                shouldAlwaysShowUI ? 'Hide UI when inactive' : 'Always show UI'
              }
              placement='top-start'
            >
              <IconButton
                onClick={() => setShouldAlwaysShowUI((previous) => !previous)}
                aria-label={
                  shouldAlwaysShowUI
                    ? 'Hide UI when inactive'
                    : 'Always show UI'
                }
                variant='ghost'
                icon={shouldAlwaysShowUI ? <EyeOpenIcon /> : <EyeClosedIcon />}
                rounded='full'
                mx={-0.5}
              />
            </Tooltip>
            <SongControl song={song} />
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
