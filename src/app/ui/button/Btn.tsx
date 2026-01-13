'use client';

import Button, { ButtonProps } from '@mui/material/Button';

type BtnVariant = 'accent' | 'outline' | 'ghost';

interface BtnProps extends Omit<ButtonProps, 'variant'> {
  title: string;
  uiVariant?: BtnVariant;
  radius?: number | string;
}

const Btn = ({
  title,
  uiVariant = 'accent',
  radius = 6,
  sx,
  ...rest
}: BtnProps) => {
  const stylesByVariant = {
    accent: {
      backgroundColor: 'var(--accentcolor)',
      color: '#fff',
      '&:hover': {
        backgroundColor: 'color-mix(in srgb, var(--accentcolor) 85%, black)',
      },
    },

    outline: {
      backgroundColor: 'transparent',
      color: 'var(--accentcolor)',
      border: '2px solid var(--accentcolor)',
      '&:hover': {
        backgroundColor:
          'color-mix(in srgb, var(--accentcolor) 10%, transparent)',
      },
    },

    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--accentcolor)',
      '&:hover': {
        backgroundColor:
          'color-mix(in srgb, var(--accentcolor) 8%, transparent)',
      },
    },
  } satisfies Record<BtnVariant, object>;

  return (
    <Button
      disableElevation
      sx={{
        borderRadius: radius,
        textTransform: 'none',
        fontWeight: 600,
        paddingX: 3,
        paddingY: 1.25,
        transition: 'all 0.25s ease',
        ...stylesByVariant[uiVariant],
        ...sx,
      }}
      {...rest}
    >
      {title}
    </Button>
  );
};

export default Btn;
