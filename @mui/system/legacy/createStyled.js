import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable no-underscore-dangle */
import styledEngineStyled, { internal_processStyles as processStyles } from '@mui/styled-engine';
import { getDisplayName, unstable_capitalize as capitalize } from '@mui/utils';
import createTheme from './createTheme';
import propsToClassKey from './propsToClassKey';
import styleFunctionSx from './styleFunctionSx';
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// https://github.com/emotion-js/emotion/blob/26ded6109fcd8ca9875cc2ce4564fee678a3f3c5/packages/styled/src/utils.js#L40
function isStringTag(tag) {
  return typeof tag === 'string' &&
  // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96;
}
var getStyleOverrides = function getStyleOverrides(name, theme) {
  if (theme.components && theme.components[name] && theme.components[name].styleOverrides) {
    return theme.components[name].styleOverrides;
  }
  return null;
};
var getVariantStyles = function getVariantStyles(name, theme) {
  var variants = [];
  if (theme && theme.components && theme.components[name] && theme.components[name].variants) {
    variants = theme.components[name].variants;
  }
  var variantsStyles = {};
  variants.forEach(function (definition) {
    var key = propsToClassKey(definition.props);
    variantsStyles[key] = definition.style;
  });
  return variantsStyles;
};
var variantsResolver = function variantsResolver(props, styles, theme, name) {
  var _theme$components;
  var _props$ownerState = props.ownerState,
    ownerState = _props$ownerState === void 0 ? {} : _props$ownerState;
  var variantsStyles = [];
  var themeVariants = theme == null || (_theme$components = theme.components) == null || (_theme$components = _theme$components[name]) == null ? void 0 : _theme$components.variants;
  if (themeVariants) {
    themeVariants.forEach(function (themeVariant) {
      var isMatch = true;
      Object.keys(themeVariant.props).forEach(function (key) {
        if (ownerState[key] !== themeVariant.props[key] && props[key] !== themeVariant.props[key]) {
          isMatch = false;
        }
      });
      if (isMatch) {
        variantsStyles.push(styles[propsToClassKey(themeVariant.props)]);
      }
    });
  }
  return variantsStyles;
};

// Update /system/styled/#api in case if this changes
export function shouldForwardProp(prop) {
  return prop !== 'ownerState' && prop !== 'theme' && prop !== 'sx' && prop !== 'as';
}
export var systemDefaultTheme = createTheme();
var lowercaseFirstLetter = function lowercaseFirstLetter(string) {
  if (!string) {
    return string;
  }
  return string.charAt(0).toLowerCase() + string.slice(1);
};
function resolveTheme(_ref) {
  var defaultTheme = _ref.defaultTheme,
    theme = _ref.theme,
    themeId = _ref.themeId;
  return isEmpty(theme) ? defaultTheme : theme[themeId] || theme;
}
function defaultOverridesResolver(slot) {
  if (!slot) {
    return null;
  }
  return function (props, styles) {
    return styles[slot];
  };
}
export default function createStyled() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var themeId = input.themeId,
    _input$defaultTheme = input.defaultTheme,
    defaultTheme = _input$defaultTheme === void 0 ? systemDefaultTheme : _input$defaultTheme,
    _input$rootShouldForw = input.rootShouldForwardProp,
    rootShouldForwardProp = _input$rootShouldForw === void 0 ? shouldForwardProp : _input$rootShouldForw,
    _input$slotShouldForw = input.slotShouldForwardProp,
    slotShouldForwardProp = _input$slotShouldForw === void 0 ? shouldForwardProp : _input$slotShouldForw;
  var systemSx = function systemSx(props) {
    return styleFunctionSx(_extends({}, props, {
      theme: resolveTheme(_extends({}, props, {
        defaultTheme: defaultTheme,
        themeId: themeId
      }))
    }));
  };
  systemSx.__mui_systemSx = true;
  return function (tag) {
    var inputOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // Filter out the `sx` style function from the previous styled component to prevent unnecessary styles generated by the composite components.
    processStyles(tag, function (styles) {
      return styles.filter(function (style) {
        return !(style != null && style.__mui_systemSx);
      });
    });
    var componentName = inputOptions.name,
      componentSlot = inputOptions.slot,
      inputSkipVariantsResolver = inputOptions.skipVariantsResolver,
      inputSkipSx = inputOptions.skipSx,
      _inputOptions$overrid = inputOptions.overridesResolver,
      overridesResolver = _inputOptions$overrid === void 0 ? defaultOverridesResolver(lowercaseFirstLetter(componentSlot)) : _inputOptions$overrid,
      options = _objectWithoutProperties(inputOptions, ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"]); // if skipVariantsResolver option is defined, take the value, otherwise, true for root and false for other slots.
    var skipVariantsResolver = inputSkipVariantsResolver !== undefined ? inputSkipVariantsResolver :
    // TODO v6: remove `Root` in the next major release
    // For more details: https://github.com/mui/material-ui/pull/37908
    componentSlot && componentSlot !== 'Root' && componentSlot !== 'root' || false;
    var skipSx = inputSkipSx || false;
    var label;
    if (process.env.NODE_ENV !== 'production') {
      if (componentName) {
        // TODO v6: remove `lowercaseFirstLetter()` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        label = "".concat(componentName, "-").concat(lowercaseFirstLetter(componentSlot || 'Root'));
      }
    }
    var shouldForwardPropOption = shouldForwardProp;

    // TODO v6: remove `Root` in the next major release
    // For more details: https://github.com/mui/material-ui/pull/37908
    if (componentSlot === 'Root' || componentSlot === 'root') {
      shouldForwardPropOption = rootShouldForwardProp;
    } else if (componentSlot) {
      // any other slot specified
      shouldForwardPropOption = slotShouldForwardProp;
    } else if (isStringTag(tag)) {
      // for string (html) tag, preserve the behavior in emotion & styled-components.
      shouldForwardPropOption = undefined;
    }
    var defaultStyledResolver = styledEngineStyled(tag, _extends({
      shouldForwardProp: shouldForwardPropOption,
      label: label
    }, options));
    var muiStyledResolver = function muiStyledResolver(styleArg) {
      for (var _len = arguments.length, expressions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        expressions[_key - 1] = arguments[_key];
      }
      var expressionsWithDefaultTheme = expressions ? expressions.map(function (stylesArg) {
        // On the server Emotion doesn't use React.forwardRef for creating components, so the created
        // component stays as a function. This condition makes sure that we do not interpolate functions
        // which are basically components used as a selectors.
        return typeof stylesArg === 'function' && stylesArg.__emotion_real !== stylesArg ? function (props) {
          return stylesArg(_extends({}, props, {
            theme: resolveTheme(_extends({}, props, {
              defaultTheme: defaultTheme,
              themeId: themeId
            }))
          }));
        } : stylesArg;
      }) : [];
      var transformedStyleArg = styleArg;
      if (componentName && overridesResolver) {
        expressionsWithDefaultTheme.push(function (props) {
          var theme = resolveTheme(_extends({}, props, {
            defaultTheme: defaultTheme,
            themeId: themeId
          }));
          var styleOverrides = getStyleOverrides(componentName, theme);
          if (styleOverrides) {
            var resolvedStyleOverrides = {};
            Object.entries(styleOverrides).forEach(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2),
                slotKey = _ref3[0],
                slotStyle = _ref3[1];
              resolvedStyleOverrides[slotKey] = typeof slotStyle === 'function' ? slotStyle(_extends({}, props, {
                theme: theme
              })) : slotStyle;
            });
            return overridesResolver(props, resolvedStyleOverrides);
          }
          return null;
        });
      }
      if (componentName && !skipVariantsResolver) {
        expressionsWithDefaultTheme.push(function (props) {
          var theme = resolveTheme(_extends({}, props, {
            defaultTheme: defaultTheme,
            themeId: themeId
          }));
          return variantsResolver(props, getVariantStyles(componentName, theme), theme, componentName);
        });
      }
      if (!skipSx) {
        expressionsWithDefaultTheme.push(systemSx);
      }
      var numOfCustomFnsApplied = expressionsWithDefaultTheme.length - expressions.length;
      if (Array.isArray(styleArg) && numOfCustomFnsApplied > 0) {
        var placeholders = new Array(numOfCustomFnsApplied).fill('');
        // If the type is array, than we need to add placeholders in the template for the overrides, variants and the sx styles.
        transformedStyleArg = [].concat(_toConsumableArray(styleArg), _toConsumableArray(placeholders));
        transformedStyleArg.raw = [].concat(_toConsumableArray(styleArg.raw), _toConsumableArray(placeholders));
      } else if (typeof styleArg === 'function' &&
      // On the server Emotion doesn't use React.forwardRef for creating components, so the created
      // component stays as a function. This condition makes sure that we do not interpolate functions
      // which are basically components used as a selectors.
      styleArg.__emotion_real !== styleArg) {
        // If the type is function, we need to define the default theme.
        transformedStyleArg = function transformedStyleArg(props) {
          return styleArg(_extends({}, props, {
            theme: resolveTheme(_extends({}, props, {
              defaultTheme: defaultTheme,
              themeId: themeId
            }))
          }));
        };
      }
      var Component = defaultStyledResolver.apply(void 0, [transformedStyleArg].concat(_toConsumableArray(expressionsWithDefaultTheme)));
      if (process.env.NODE_ENV !== 'production') {
        var displayName;
        if (componentName) {
          displayName = "".concat(componentName).concat(capitalize(componentSlot || ''));
        }
        if (displayName === undefined) {
          displayName = "Styled(".concat(getDisplayName(tag), ")");
        }
        Component.displayName = displayName;
      }
      if (tag.muiName) {
        Component.muiName = tag.muiName;
      }
      return Component;
    };
    if (defaultStyledResolver.withConfig) {
      muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
    }
    return muiStyledResolver;
  };
}