import React, { forwardRef } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text, useColorScheme, View } from 'react-native';

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
  isLoading?: boolean;
  isDisabled?: boolean;
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

// Convert to forwardRef component
const Button = forwardRef<View, ButtonProps>(
  (
    {
      text,
      variant = ButtonVariant.PRIMARY,
      size = ButtonSize.SMALL,
      width = '100%',
      style,
      isLoading = false,
      isDisabled = false,
      ...rest
    },
    ref
  ) => {
    const colorScheme = useColorScheme() || 'light';

    return (
      <Pressable
        ref={ref}
        style={() => [
          { height: BUTTON_SIZE_STYLES[size].height, width: width },
          styles.btn,
          isDisabled || isLoading ? styles.btnDisabled : {},
          THEME_VARIANT_STYLES[colorScheme][variant].btn,
          style,
        ]}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              { fontSize: BUTTON_SIZE_STYLES[size].fontSize },
              styles.btnText,
              THEME_VARIANT_STYLES[colorScheme][variant].text,
            ]}
          >
            {text}
          </Text>
          {isLoading && <ActivityIndicator style={styles.activityIndicator} size="small" color={DEFAULT_TEXT_COLOR} />}
        </View>
      </Pressable>
    );
  }
);

// Add display name for better debugging
Button.displayName = 'Button';

// Export as default
export default Button;

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  btnDisabled: {
    opacity: 0.75,
  },
  btnText: {
    fontWeight: '600',
  },
  activityIndicator: {
    marginLeft: 8,
  },
});
