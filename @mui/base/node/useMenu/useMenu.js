"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMenu = useMenu;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _menuReducer = require("./menuReducer");
var _DropdownContext = require("../useDropdown/DropdownContext");
var _useList = require("../useList");
var _useDropdown = require("../useDropdown");
var _useCompound = require("../utils/useCompound");
var _combineHooksSlotProps = require("../utils/combineHooksSlotProps");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
 * - [useMenu API](https://mui.com/base-ui/react-menu/hooks-api/#use-menu)
 */
function useMenu(parameters = {}) {
  var _useId, _React$useContext;
  const {
    listboxRef: listboxRefProp,
    onItemsChange,
    id: idParam
  } = parameters;
  const rootRef = React.useRef(null);
  const handleRef = (0, _utils.unstable_useForkRef)(rootRef, listboxRefProp);
  const listboxId = (_useId = (0, _utils.unstable_useId)(idParam)) != null ? _useId : '';
  const {
    state: {
      open
    },
    dispatch: menuDispatch,
    triggerElement,
    registerPopup
  } = (_React$useContext = React.useContext(_DropdownContext.DropdownContext)) != null ? _React$useContext : FALLBACK_MENU_CONTEXT;

  // store the initial open state to prevent focus stealing
  // (the first menu items gets focued only when the menu is opened by the user)
  const isInitiallyOpen = React.useRef(open);
  const {
    subitems,
    contextValue: compoundComponentContextValue
  } = (0, _useCompound.useCompoundParent)();
  const subitemKeys = React.useMemo(() => Array.from(subitems.keys()), [subitems]);
  const getItemDomElement = React.useCallback(itemId => {
    var _subitems$get$ref$cur, _subitems$get;
    if (itemId == null) {
      return null;
    }
    return (_subitems$get$ref$cur = (_subitems$get = subitems.get(itemId)) == null ? void 0 : _subitems$get.ref.current) != null ? _subitems$get$ref$cur : null;
  }, [subitems]);
  const {
    dispatch: listDispatch,
    getRootProps: getListRootProps,
    contextValue: listContextValue,
    state: {
      highlightedValue
    },
    rootRef: mergedListRef
  } = (0, _useList.useList)({
    disabledItemsFocusable: true,
    focusManagement: 'DOM',
    getItemDomElement,
    getInitialState: () => ({
      selectedValues: [],
      highlightedValue: null
    }),
    isItemDisabled: id => {
      var _subitems$get2;
      return (subitems == null || (_subitems$get2 = subitems.get(id)) == null ? void 0 : _subitems$get2.disabled) || false;
    },
    items: subitemKeys,
    getItemAsString: id => {
      var _subitems$get3, _subitems$get4;
      return ((_subitems$get3 = subitems.get(id)) == null ? void 0 : _subitems$get3.label) || ((_subitems$get4 = subitems.get(id)) == null || (_subitems$get4 = _subitems$get4.ref.current) == null ? void 0 : _subitems$get4.innerText);
    },
    rootRef: handleRef,
    onItemsChange,
    reducerActionContext: {
      listboxRef: rootRef
    },
    selectionMode: 'none',
    stateReducer: _menuReducer.menuReducer
  });
  (0, _utils.unstable_useEnhancedEffect)(() => {
    registerPopup(listboxId);
  }, [listboxId, registerPopup]);
  React.useEffect(() => {
    if (open && highlightedValue === subitemKeys[0] && !isInitiallyOpen.current) {
      var _subitems$get5;
      (_subitems$get5 = subitems.get(subitemKeys[0])) == null || (_subitems$get5 = _subitems$get5.ref) == null || (_subitems$get5 = _subitems$get5.current) == null ? void 0 : _subitems$get5.focus();
    }
  }, [open, highlightedValue, subitems, subitemKeys]);
  React.useEffect(() => {
    var _rootRef$current;
    // set focus to the highlighted item (but prevent stealing focus from other elements on the page)
    if ((_rootRef$current = rootRef.current) != null && _rootRef$current.contains(document.activeElement) && highlightedValue !== null) {
      var _subitems$get6;
      subitems == null || (_subitems$get6 = subitems.get(highlightedValue)) == null || (_subitems$get6 = _subitems$get6.ref.current) == null ? void 0 : _subitems$get6.focus();
    }
  }, [highlightedValue, subitems]);
  const createHandleBlur = otherHandlers => event => {
    var _otherHandlers$onBlur, _rootRef$current2;
    (_otherHandlers$onBlur = otherHandlers.onBlur) == null ? void 0 : _otherHandlers$onBlur.call(otherHandlers, event);
    if (event.defaultMuiPrevented) {
      return;
    }
    if ((_rootRef$current2 = rootRef.current) != null && _rootRef$current2.contains(event.relatedTarget) || event.relatedTarget === triggerElement) {
      return;
    }
    menuDispatch({
      type: _useDropdown.DropdownActionTypes.blur,
      event
    });
  };
  const createHandleKeyDown = otherHandlers => event => {
    var _otherHandlers$onKeyD;
    (_otherHandlers$onKeyD = otherHandlers.onKeyDown) == null ? void 0 : _otherHandlers$onKeyD.call(otherHandlers, event);
    if (event.defaultMuiPrevented) {
      return;
    }
    if (event.key === 'Escape') {
      menuDispatch({
        type: _useDropdown.DropdownActionTypes.escapeKeyDown,
        event
      });
    }
  };
  const getOwnListboxHandlers = (otherHandlers = {}) => ({
    onBlur: createHandleBlur(otherHandlers),
    onKeyDown: createHandleKeyDown(otherHandlers)
  });
  const getListboxProps = (otherHandlers = {}) => {
    const getCombinedRootProps = (0, _combineHooksSlotProps.combineHooksSlotProps)(getOwnListboxHandlers, getListRootProps);
    return (0, _extends2.default)({}, getCombinedRootProps(otherHandlers), {
      id: listboxId,
      role: 'menu'
    });
  };
  React.useDebugValue({
    subitems,
    highlightedValue
  });
  return {
    contextValue: (0, _extends2.default)({}, compoundComponentContextValue, listContextValue),
    dispatch: listDispatch,
    getListboxProps,
    highlightedValue,
    listboxRef: mergedListRef,
    menuItems: subitems,
    open,
    triggerElement
  };
}