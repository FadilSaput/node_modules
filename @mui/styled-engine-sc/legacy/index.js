/**
 * @mui/styled-engine-sc v5.14.6
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import scStyled from 'styled-components';
export default function styled(tag, options) {
  var stylesFactory;
  if (options) {
    stylesFactory = scStyled(tag).withConfig({
      displayName: options.label,
      shouldForwardProp: options.shouldForwardProp
    });
  } else {
    stylesFactory = scStyled(tag);
  }
  if (process.env.NODE_ENV !== 'production') {
    var fn = function fn() {
      var component = typeof tag === 'string' ? "\"".concat(tag, "\"") : 'component';
      for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
        styles[_key] = arguments[_key];
      }
      if (styles.length === 0) {
        console.error(["MUI: Seems like you called `styled(".concat(component, ")()` without a `style` argument."), 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join('\n'));
      } else if (styles.some(function (style) {
        return style === undefined;
      })) {
        console.error("MUI: the styled(".concat(component, ")(...args) API requires all its args to be defined."));
      }
      return stylesFactory.apply(void 0, styles);
    };
    fn.withConfig = stylesFactory.withConfig;
    return fn;
  }
  return stylesFactory;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export var internal_processStyles = function internal_processStyles(tag, processor) {
  // Styled-components attaches an instance to `componentStyle`.
  // https://github.com/styled-components/styled-components/blob/da8151762dcf72735ffba358173d4c097f6d5888/packages/styled-components/src/models/StyledComponent.ts#L257
  //
  // The instance contains `rules` (the styles)
  // https://github.com/styled-components/styled-components/blob/da8151762dcf72735ffba358173d4c097f6d5888/packages/styled-components/src/models/ComponentStyle.ts#L23
  if (tag.componentStyle) {
    tag.componentStyle.rules = processor(tag.componentStyle.rules);
  }
};
export { ThemeContext, keyframes, css } from 'styled-components';
export { default as StyledEngineProvider } from './StyledEngineProvider';
export { default as GlobalStyles } from './GlobalStyles';