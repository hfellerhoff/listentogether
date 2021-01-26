import React from 'react';
import { Flex, Box, Heading, Text, Image } from '@chakra-ui/core';
import ResponsiveEllipsis from '../ResponsiveEllipsis';

interface Props {
  title: string;
  artist: string;
  album: string;
  playback?: {
    progress: number;
    length: number;
  };
  src?: string;
  standalone?: boolean;
  imageRef?: React.MutableRefObject<HTMLImageElement | undefined>;
}

const DashboardSongDisplay = ({
  title,
  artist,
  album,
  playback,
  src,
  standalone,
  imageRef,
}: Props) => {
  if (standalone && src)
    return (
      <Box>
        <Flex
          direction={['row', 'row', 'column', 'column']}
          align='center'
          justify='space-between'
        >
          <Image
            src={src}
            height={[12, 16, 32, 32]}
            width={[12, 16, 32, 32]}
            ref={imageRef}
          />
          <Box
            textAlign={['left', 'left', 'center', 'center']}
            flex={[1, 1, '', '']}
            mt={[0, 0, 4, 4]}
            ml={[4, 4, 0, 0]}
          >
            <Heading size='sm'>{title}</Heading>
            <Text>{artist}</Text>
          </Box>
        </Flex>
      </Box>
    );
  return (
    <Box>
      <Flex>
        {src ? (
          <Image
            src={src}
            height={playback ? 16 : 12}
            width={playback ? 16 : 12}
          />
        ) : (
          <Box
            background='#dddddd'
            height={playback ? 16 : 12}
            width={playback ? 16 : 12}
          ></Box>
        )}
        <Flex ml={3} justify='center' direction='column'>
          <Heading size='md' fontSize={18}>
            <ResponsiveEllipsis text={title} maxLine={1} />
          </Heading>
          <Text fontSize={14}>
            <ResponsiveEllipsis text={`${artist} • ${album}`} maxLine={1} />
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardSongDisplay;
