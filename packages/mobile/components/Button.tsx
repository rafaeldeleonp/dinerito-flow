import { Pressable, PressableProps, StyleSheet, Text, useColorScheme } from 'react-native';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type ButtonProps = PressableProps & {
  text: string;
  variant?: ButtonVariant.PRIMARY | ButtonVariant.SECONDARY;
  size?: ButtonSize.SMALL | ButtonSize.MEDIUM | ButtonSize.LARGE;
  width?: number | string;
};

const DEFAULT_COLOR = '#588166';
const DEFAULT_BORDER_WIDTH = 2;
const DEFAULT_TEXT_COLOR = '#fff';

const THEME_VARIANT_STYLES = {
  light: {
    [ButtonVariant.PRIMARY]: {
      btn: {
        backgroundColor: DEFAULT_COLOR,
      },
      text: {
        color: DEFAULT_TEXT_COLOR,
      },
    },
    [ButtonVariant.SECONDARY]: {
      btn: {
        borderColor: DEFAULT_COLOR,
        borderWidth: DEFAULT_BORDER_WIDTH,
      },
      text: {
        color: DEFAULT_COLOR,
      },
    },
  },
  dark: {
    [ButtonVariant.PRIMARY]: {
      btn: {
        backgroundColor: DEFAULT_COLOR,
      },
      text: {
        color: DEFAULT_TEXT_COLOR,
      },
    },
    [ButtonVariant.SECONDARY]: {
      btn: {
        borderColor: DEFAULT_COLOR,
        borderWidth: DEFAULT_BORDER_WIDTH,
      },
      text: {
        color: DEFAULT_COLOR,
      },
    },
  },
};

const BUTTON_SIZE_STYLES = {
  [ButtonSize.SMALL]: {
    height: 48,
    fontSize: 18,
  },
  [ButtonSize.MEDIUM]: {
    height: 56,
    fontSize: 20,
  },
  [ButtonSize.LARGE]: {
    height: 64,
    fontSize: 22,
  },
};

export default function Button({
  text,
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.SMALL,
  width = '100%',
  style,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme() || 'light';

  return (
    <Pressable
      style={() => [
        { height: BUTTON_SIZE_STYLES[size].height, width: width },
        styles.btn,
        THEME_VARIANT_STYLES[colorScheme][variant].btn,
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          { fontSize: BUTTON_SIZE_STYLES[size].fontSize },
          styles.btnText,
          THEME_VARIANT_STYLES[colorScheme][variant].text,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  btnText: {
    fontWeight: '600',
  },
});
