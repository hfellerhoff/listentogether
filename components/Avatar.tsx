import { styled } from '@stitches/react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

const StyledAvatar = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '100%',
  backgroundColor: '$neutral6',
});

const StyledImage = styled(AvatarPrimitive.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const StyledFallback = styled(AvatarPrimitive.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$neutral5',
  color: '$primary11',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
});

type Props = {
  src: string;
  name: string;
};

const Avatar = ({ src, name }: Props) => {
  const initials = name
    .split(' ')
    .map((word) => word.substring(0, 1))
    .join('')
    .toUpperCase();

  return (
    <StyledAvatar>
      <StyledImage src={src} alt={name} />
      <StyledFallback delayMs={600}>{initials}</StyledFallback>
    </StyledAvatar>
  );
};

export default Avatar;
