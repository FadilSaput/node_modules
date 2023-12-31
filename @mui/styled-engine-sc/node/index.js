/**
 * @mui/styled-engine-sc v5.14.6
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GlobalStyles", {
  enumerable: true,
  get: function () {
    return _GlobalStyles.default;
  }
});
Object.defineProperty(exports, "StyledEngineProvider", {
  enumerable: true,
  get: function () {
    return _StyledEngineProvider.default;
  }
});
Object.defineProperty(exports, "ThemeContext", {
  enumerable: true,
  get: function () {
    return _styledComponents.ThemeContext;
  }
});
Object.defineProperty(exports, "css", {
  enumerable: true,
  get: function () {
    return _styledComponents.css;
  }
});
exports.default = styled;
exports.internal_processStyles = void 0;
Object.defineProperty(exports, "keyframes", {
  enumerable: true,
  get: function () {
    return _styledComponents.keyframes;
  }
});
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _StyledEngineProvider = _interopRequireDefault(require("./StyledEngineProvider"));
var _GlobalStyles = _interopRequireDefault(require("./GlobalStyles"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function styled(tag, options) {
  let stylesFactory;
  if (options) {
    stylesFactory = (0, _styledComponents.default)(tag).withConfig({
      displayName: options.label,
      shouldForwardProp: options.shouldForwardProp
    });
  } else {
    stylesFactory = (0, _styledComponents.default)(tag);
  }
  if (process.env.NODE_ENV !== 'production') {
    const fn = (...styles) => {
      const component = typeof tag === 'string' ? `"${tag}"` : 'component';
      if (styles.length === 0) {
        console.error([`MUI: Seems like you called \`styled(${component})()\` without a \`style\` argument.`, 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join('\n'));
      } else if (styles.some(style => style === undefined)) {
        console.error(`MUI: the styled(${component})(...args) API requires all its args to be defined.`);
      }
      return stylesFactory(...styles);
    };
    fn.withConfig = stylesFactory.withConfig;
    return fn;
  }
  return stylesFactory;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const internal_processStyles = (tag, processor) => {
  // Styled-components attaches an instance to `componentStyle`.
  // https://github.com/styled-components/styled-components/blob/da8151762dcf72735ffba358173d4c097f6d5888/packages/styled-components/src/models/StyledComponent.ts#L257
  //
  // The instance contains `rules` (the styles)
  // https://github.com/styled-components/styled-components/blob/da8151762dcf72735ffba358173d4c097f6d5888/packages/styled-components/src/models/ComponentStyle.ts#L23
  if (tag.componentStyle) {
    tag.componentStyle.rules = processor(tag.componentStyle.rules);
  }
};
exports.internal_processStyles = internal_processStyles;