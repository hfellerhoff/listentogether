import * as ScrollArea from '@radix-ui/react-scroll-area';
import { styled } from '@stitches/react';
import { useAtom } from 'jotai';

import ChatDisplay from './ChatDisplay';
import ChatInput from './ChatInput';
import useMessages from '../../../hooks/supabase/useMessages';
import { roomAtom } from '../../../state/roomAtom';
import { sidepanelAtom } from '../../../state/sidepanelAtom';

export type ChatComponentType = 'panel' | 'full';

// interface Props {
// type: ChatComponentType;
// }

const StyledScrollArea = styled(ScrollArea.Root, {
  overflow: 'hidden',
  flex: 1,
  height: 'calc(100% - 4rem)',
});

const StyledViewport = styled(ScrollArea.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  padding: '1rem',
  position: 'relative',
});

const SCROLLBAR_SIZE = 15;
const StyledScrollbar = styled(ScrollArea.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  padding: 2,
  background: 'rgba(0, 0, 0, 0.2)',
  transition: 'background 160ms ease-out',
  '&:hover': { background: 'rgba(0, 0, 0, 0.3)' },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

const StyledThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  background: 'rgba(0, 0, 0, 0.4)',
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

const StyledCorner = styled(ScrollArea.Corner, {
  background: 'rgba(0, 0, 0, 0.4)',
});

const ChatContainer = styled('div', {
  width: '28rem',
  height: '100vh',

  transition: 'all 0.3s',

  variants: {
    isOpen: {
      true: {
        transform: 'translateX(0rem)',
        marginLeft: '0rem',
      },
      false: {
        transform: 'translateX(28rem)',
        marginLeft: '-28rem',
      },
    },
  },
});

const ChatComponent = () => {
  const [room] = useAtom(roomAtom);
  const [sidepanelStatus] = useAtom(sidepanelAtom);

  const messages = useMessages(room.id);

  return (
    <ChatContainer isOpen={sidepanelStatus.isRightOpen}>
      <StyledScrollArea>
        <StyledViewport>
          <ChatDisplay messages={messages.array} />
        </StyledViewport>
        <StyledScrollbar orientation='vertical'>
          <StyledThumb />
        </StyledScrollbar>
        <StyledCorner />
      </StyledScrollArea>
      <ChatInput />
    </ChatContainer>
  );
};

export default ChatComponent;
