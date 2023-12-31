"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMenuItem = useMenuItem;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _useButton = require("../useButton");
var _useList = require("../useList");
var _useDropdown = require("../useDropdown");
var _DropdownContext = require("../useDropdown/DropdownContext");
var _combineHooksSlotProps = require("../utils/combineHooksSlotProps");
var _useCompoundItem = require("../utils/useCompoundItem");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function idGenerator(existingKeys) {
  return `menu-item-${existingKeys.size}`;
}
const FALLBACK_MENU_CONTEXT = {
  dispatch: () => {},
  popupId: '',
  registerPopup: () => {},
  registerTrigger: () => {},
  state: {
    open: true
  },
  triggerElement: null
};

/**
 *
 * Demos:
 *
 * - [Menu](https://mui.com/base-ui/react-menu/#hooks)
 *
 * API:
 *
 * - [useMenuItem API](https://mui.com/base-ui/react-menu/hooks-api/#use-menu-item)
 */
function useMenuItem(params) {
  var _React$useContext;
  const {
    disabled = false,
    id: idParam,
    rootRef: externalRef,
    label
  } = params;
  const id = (0, _utils.unstable_useId)(idParam);
  const itemRef = React.useRef(null);
  const itemMetadata = React.useMemo(() => ({
    disabled,
    id: id != null ? id : '',
    label,
    ref: itemRef
  }), [disabled, id, label]);
  const {
    dispatch
  } = (_React$useContext = React.useContext(_DropdownContext.DropdownContext)) != null ? _React$useContext : FALLBACK_MENU_CONTEXT;
  const {
    getRootProps: getListRootProps,
    highlighted,
    rootRef: listItemRefHandler
  } = (0, _useList.useListItem)({
    item: id
  });
  const {
    index,
    totalItemCount
  } = (0, _useCompoundItem.useCompoundItem)(id != null ? id : idGenerator, itemMetadata);
  const {
    getRootProps: getButtonProps,
    focusVisible,
    rootRef: buttonRefHandler
  } = (0, _useButton.useButton)({
    disabled,
    focusableWhenDisabled: true
  });
  const handleRef = (0, _utils.unstable_useForkRef)(listItemRefHandler, buttonRefHandler, externalRef, itemRef);
  React.useDebugValue({
    id,
    highlighted,
    disabled,
    label
  });
  const createHandleClick = otherHandlers => event => {
    var _otherHandlers$onClic;
    (_otherHandlers$onClic = otherHandlers.onClick) == null ? void 0 : _otherHandlers$onClic.call(otherHandlers, event);
    if (event.defaultMuiPrevented) {
      return;
    }
    dispatch({
      type: _useDropdown.DropdownActionTypes.close,
      event
    });
  };
  const getOwnHandlers = (otherHandlers = {}) => (0, _extends2.default)({}, otherHandlers, {
    onClick: createHandleClick(otherHandlers)
  });
  function getRootProps(otherHandlers = {}) {
    const getCombinedRootProps = (0, _combineHooksSlotProps.combineHooksSlotProps)(getOwnHandlers, (0, _combineHooksSlotProps.combineHooksSlotProps)(getButtonProps, getListRootProps));
    return (0, _extends2.default)({}, getCombinedRootProps(otherHandlers), {
      ref: handleRef,
      role: 'menuitem'
    });
  }

  // If `id` is undefined (during SSR in React < 18), we fall back to rendering a simplified menu item
  // which does not have access to infortmation about its position or highlighted state.
  if (id === undefined) {
    return {
      getRootProps,
      disabled: false,
      focusVisible,
      highlighted: false,
      index: -1,
      totalItemCount: 0,
      rootRef: handleRef
    };
  }
  return {
    getRootProps,
    disabled,
    focusVisible,
    highlighted,
    index,
    totalItemCount,
    rootRef: handleRef
  };
}