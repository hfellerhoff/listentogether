import {
  Box,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';
import React from 'react';
import {
  FiSpeaker,
  FiGlobe,
  FiMonitor,
  FiSmartphone,
  FiCheck,
} from 'react-icons/fi';

interface RadioCardProps extends UseRadioProps {
  title: string;
  description: string;
  leftIcon?: JSX.Element;
  isLoading: boolean;
}

function RadioCard(props: RadioCardProps) {
  const { leftIcon, title, description, isChecked, isLoading } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { colorMode } = useColorMode();

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        display='flex'
        flexDirection='column'
        alignItems='flex-start'
        textAlign='left'
        bg={colorMode === 'dark' ? '#3B4757' : '#EDF2F7'}
        borderRadius={4}
        _hover={{
          bg:
            colorMode === 'dark'
              ? isChecked
                ? 'teal.600'
                : 'gray.600'
              : isChecked
              ? '#38A068'
              : '#DEE3E8',
        }}
        _checked={{
          bg: colorMode === 'dark' ? 'teal.600' : '#38A068',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        <Flex
          align='center'
          justify='space-between'
          w='100%'
          color={isChecked || colorMode === 'dark' ? '#FFFFFF' : ''}
        >
          <Flex align='center' justify='center'>
            {leftIcon}
            <Box ml={leftIcon ? 3 : 0}>
              <Heading size='sm'>{title}</Heading>
              <Text fontWeight={400}>{description}</Text>
            </Box>
          </Flex>
          {isLoading ? <Spinner size='sm' /> : isChecked ? <FiCheck /> : <></>}
        </Flex>
      </Box>
    </Box>
  );
}

interface RadioOption {
  label: string;
  value: string;
  type?: string;
  isChecked?: boolean;
}

interface Props {
  options: RadioOption[];
  name: string;
  onChange: (option: string) => void;
  isLoading?: boolean;
}

const RadioCardGroup = ({ name, options, onChange, isLoading }: Props) => {
  const checkedOptions = options.filter((option) => !!option.isChecked);
  const defaultValue = checkedOptions.length > 0 ? checkedOptions[0].value : '';

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <Stack {...group} mb={6}>
      {options.map((option) => {
        let leftIcon = <FiSpeaker fontSize={20} />;
        if (option.label === 'Listen Together Web Application') {
          leftIcon = <FiGlobe fontSize={20} />;
        } else if (option.type === 'Computer') {
          leftIcon = <FiMonitor fontSize={20} />;
        } else if (option.type === 'Smartphone') {
          leftIcon = <FiSmartphone fontSize={20} />;
        }
        const radio = getRadioProps({ value: option.value });
        return (
          <RadioCard
            title={option.label}
            key={option.value}
            description={option.type}
            leftIcon={leftIcon}
            isLoading={isLoading}
            {...radio}
          />
        );
      })}
    </Stack>
  );
};

export default RadioCardGroup;
