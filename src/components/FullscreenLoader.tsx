import { Spinner } from '@chakra-ui/react';

export default function FullscreenLoader() {
  // const { colorMode } = useColorMode();

  return (
    <div className='bg-transparent h-screen w-screen flex flex-col items-center justify-center gap-4'>
      {/* <Box>
        <Image
          src={colorMode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
          height={100}
          width={150}
          alt='Listen Together logo'
        />
      </Box> */}
      <Spinner size='xl' />
    </div>
  );
}
