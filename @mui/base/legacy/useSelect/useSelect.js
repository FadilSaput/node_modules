'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_useForkRef as useForkRef, unstable_useId as useId, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { useButton } from '../useButton';
import { SelectActionTypes } from './useSelect.types';
import { useList } from '../useList';
import { defaultOptionStringifier } from './defaultOptionStringifier';
import { useCompoundParent } from '../utils/useCompound';
import { selectReducer } from './selectReducer';
import { combineHooksSlotProps } from '../utils/combineHooksSlotProps';
// visually hidden style based on https://webaim.org/techniques/css/invisiblecontent/
var visuallyHiddenStyle = {
  clip: 'rect(1px, 1px, 1px, 1px)',
  clipPath: 'inset(50%)',
  height: '1px',
  width: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  left: '50%',
  bottom: 0 // to display the native browser validation error at the bottom of the Select.
};

var noop = function noop() {};
function defaultFormValueProvider(selectedOption) {
  if (Array.isArray(selectedOption)) {
    if (selectedOption.length === 0) {
      return '';
    }
    return JSON.stringify(selectedOption.map(function (o) {
      return o.value;
    }));
  }
  if ((selectedOption == null ? void 0 : selectedOption.value) == null) {
    return '';
  }
  if (typeof selectedOption.value === 'string' || typeof selectedOption.value === 'number') {
    return selectedOption.value;
  }
  return JSON.stringify(selectedOption.value);
}
function preventDefault(event) {
  event.preventDefault();
}

/**
 *
 * Demos:
 *
 * - [Select](https://mui.com/base-ui/react-select/#hooks)
 *
 * API:
 *
 * - [useSelect API](https://mui.com/base-ui/react-select/hooks-api/#use-select)
 */
function useSelect(props) {
  var areOptionsEqual = props.areOptionsEqual,
    buttonRefProp = props.buttonRef,
    _props$defaultOpen = props.defaultOpen,
    defaultOpen = _props$defaultOpen === void 0 ? false : _props$defaultOpen,
    defaultValueProp = props.defaultValue,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    listboxIdProp = props.listboxId,
    listboxRefProp = props.listboxRef,
    _props$multiple = props.multiple,
    multiple = _props$multiple === void 0 ? false : _props$multiple,
    name = props.name,
    required = props.required,
    onChange = props.onChange,
    onHighlightChange = props.onHighlightChange,
    onOpenChange = props.onOpenChange,
    openProp = props.open,
    optionsParam = props.options,
    _props$getOptionAsStr = props.getOptionAsString,
    getOptionAsString = _props$getOptionAsStr === void 0 ? defaultOptionStringifier : _props$getOptionAsStr,
    _props$getSerializedV = props.getSerializedValue,
    getSerializedValue = _props$getSerializedV === void 0 ? defaultFormValueProvider : _props$getSerializedV,
    valueProp = props.value;
  var buttonRef = React.useRef(null);
  var handleButtonRef = useForkRef(buttonRefProp, buttonRef);
  var listboxRef = React.useRef(null);
  var listboxId = useId(listboxIdProp);
  var defaultValue;
  if (valueProp === undefined && defaultValueProp === undefined) {
    defaultValue = [];
  } else if (defaultValueProp !== undefined) {
    if (multiple) {
      defaultValue = defaultValueProp;
    } else {
      defaultValue = defaultValueProp == null ? [] : [defaultValueProp];
    }
  }
  var value = React.useMemo(function () {
    if (valueProp !== undefined) {
      if (multiple) {
        return valueProp;
      }
      return valueProp == null ? [] : [valueProp];
    }
    return undefined;
  }, [valueProp, multiple]);
  var _useCompoundParent = useCompoundParent(),
    subitems = _useCompoundParent.subitems,
    compoundComponentContextValue = _useCompoundParent.contextValue;
  var options = React.useMemo(function () {
    if (optionsParam != null) {
      return new Map(optionsParam.map(function (option, index) {
        return [option.value, {
          value: option.value,
          label: option.label,
          disabled: option.disabled,
          ref: /*#__PURE__*/React.createRef(),
          id: "".concat(listboxId, "_").concat(index)
        }];
      }));
    }
    return subitems;
  }, [optionsParam, subitems, listboxId]);
  var handleListboxRef = useForkRef(listboxRefProp, listboxRef);
  var _useButton = useButton({
      disabled: disabled,
      rootRef: handleButtonRef
    }),
    getButtonRootProps = _useButton.getRootProps,
    buttonActive = _useButton.active,
    buttonFocusVisible = _useButton.focusVisible,
    mergedButtonRef = _useButton.rootRef;
  var optionValues = React.useMemo(function () {
    return Array.from(options.keys());
  }, [options]);
  var getOptionByValue = React.useCallback(function (valueToGet) {
    // This can't be simply `options.get(valueToGet)` because of the `areOptionsEqual` prop.
    // If it's provided, we assume that the user wants to compare the options by value.
    if (areOptionsEqual !== undefined) {
      var similarValue = optionValues.find(function (optionValue) {
        return areOptionsEqual(optionValue, valueToGet);
      });
      return options.get(similarValue);
    }
    return options.get(valueToGet);
  }, [options, areOptionsEqual, optionValues]);
  var isItemDisabled = React.useCallback(function (valueToCheck) {
    var _option$disabled;
    var option = getOptionByValue(valueToCheck);
    return (_option$disabled = option == null ? void 0 : option.disabled) != null ? _option$disabled : false;
  }, [getOptionByValue]);
  var stringifyOption = React.useCallback(function (valueToCheck) {
    var option = getOptionByValue(valueToCheck);
    if (!option) {
      return '';
    }
    return getOptionAsString(option);
  }, [getOptionByValue, getOptionAsString]);
  var controlledState = React.useMemo(function () {
    return {
      selectedValues: value,
      open: openProp
    };
  }, [value, openProp]);
  var getItemId = React.useCallback(function (itemValue) {
    var _options$get;
    return (_options$get = options.get(itemValue)) == null ? void 0 : _options$get.id;
  }, [options]);
  var handleSelectionChange = React.useCallback(function (event, newValues) {
    if (multiple) {
      onChange == null ? void 0 : onChange(event, newValues);
    } else {
      var _newValues$;
      onChange == null ? void 0 : onChange(event, (_newValues$ = newValues[0]) != null ? _newValues$ : null);
    }
  }, [multiple, onChange]);
  var handleHighlightChange = React.useCallback(function (event, newValue) {
    onHighlightChange == null ? void 0 : onHighlightChange(event, newValue != null ? newValue : null);
  }, [onHighlightChange]);
  var handleStateChange = React.useCallback(function (event, field, fieldValue) {
    if (field === 'open') {
      onOpenChange == null ? void 0 : onOpenChange(fieldValue);
      if (fieldValue === false && (event == null ? void 0 : event.type) !== 'blur') {
        var _buttonRef$current;
        (_buttonRef$current = buttonRef.current) == null ? void 0 : _buttonRef$current.focus();
      }
    }
  }, [onOpenChange]);
  var useListParameters = {
    getInitialState: function getInitialState() {
      var _defaultValue;
      return {
        highlightedValue: null,
        selectedValues: (_defaultValue = defaultValue) != null ? _defaultValue : [],
        open: defaultOpen
      };
    },
    getItemId: getItemId,
    controlledProps: controlledState,
    itemComparer: areOptionsEqual,
    isItemDisabled: isItemDisabled,
    rootRef: mergedButtonRef,
    onChange: handleSelectionChange,
    onHighlightChange: handleHighlightChange,
    onStateChange: handleStateChange,
    reducerActionContext: React.useMemo(function () {
      return {
        multiple: multiple
      };
    }, [multiple]),
    items: optionValues,
    getItemAsString: stringifyOption,
    selectionMode: multiple ? 'multiple' : 'single',
    stateReducer: selectReducer
  };
  var _useList = useList(useListParameters),
    dispatch = _useList.dispatch,
    getListboxRootProps = _useList.getRootProps,
    listContextValue = _useList.contextValue,
    _useList$state = _useList.state,
    open = _useList$state.open,
    highlightedOption = _useList$state.highlightedValue,
    selectedOptions = _useList$state.selectedValues,
    mergedListRootRef = _useList.rootRef;
  var createHandleButtonMouseDown = function createHandleButtonMouseDown(otherHandlers) {
    return function (event) {
      var _otherHandlers$onMous;
      otherHandlers == null || (_otherHandlers$onMous = otherHandlers.onMouseDown) == null ? void 0 : _otherHandlers$onMous.call(otherHandlers, event);
      if (!event.defaultMuiPrevented) {
        var action = {
          type: SelectActionTypes.buttonClick,
          event: event
        };
        dispatch(action);
      }
    };
  };
  useEnhancedEffect(function () {
    // Scroll to the currently highlighted option.
    if (highlightedOption != null) {
      var _getOptionByValue;
      var optionRef = (_getOptionByValue = getOptionByValue(highlightedOption)) == null ? void 0 : _getOptionByValue.ref;
      if (!listboxRef.current || !(optionRef != null && optionRef.current)) {
        return;
      }
      var listboxClientRect = listboxRef.current.getBoundingClientRect();
      var optionClientRect = optionRef.current.getBoundingClientRect();
      if (optionClientRect.top < listboxClientRect.top) {
        listboxRef.current.scrollTop -= listboxClientRect.top - optionClientRect.top;
      } else if (optionClientRect.bottom > listboxClientRect.bottom) {
        listboxRef.current.scrollTop += optionClientRect.bottom - listboxClientRect.bottom;
      }
    }
  }, [highlightedOption, getOptionByValue]);
  var getOptionMetadata = React.useCallback(function (optionValue) {
    return getOptionByValue(optionValue);
  }, [getOptionByValue]);
  var getSelectTriggerProps = function getSelectTriggerProps() {
    var otherHandlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _extends({}, otherHandlers, {
      onMouseDown: createHandleButtonMouseDown(otherHandlers),
      ref: mergedListRootRef,
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listboxId
    });
  };
  var getButtonProps = function getButtonProps() {
    var otherHandlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var listboxAndButtonProps = combineHooksSlotProps(getButtonRootProps, getListboxRootProps);
    var combinedProps = combineHooksSlotProps(listboxAndButtonProps, getSelectTriggerProps);
    return combinedProps(otherHandlers);
  };
  var getListboxProps = function getListboxProps() {
    var otherHandlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _extends({}, otherHandlers, {
      id: listboxId,
      role: 'listbox',
      'aria-multiselectable': multiple ? 'true' : undefined,
      ref: handleListboxRef,
      onMouseDown: preventDefault // to prevent the button from losing focus when interacting with the listbox
    });
  };

  React.useDebugValue({
    selectedOptions: selectedOptions,
    highlightedOption: highlightedOption,
    open: open
  });
  var contextValue = React.useMemo(function () {
    return _extends({}, listContextValue, compoundComponentContextValue);
  }, [listContextValue, compoundComponentContextValue]);
  var selectValue;
  if (props.multiple) {
    selectValue = selectedOptions;
  } else {
    selectValue = selectedOptions.length > 0 ? selectedOptions[0] : null;
  }
  var selectedOptionsMetadata;
  if (multiple) {
    selectedOptionsMetadata = selectValue.map(function (v) {
      return getOptionMetadata(v);
    }).filter(function (o) {
      return o !== undefined;
    });
  } else {
    var _getOptionMetadata;
    selectedOptionsMetadata = (_getOptionMetadata = getOptionMetadata(selectValue)) != null ? _getOptionMetadata : null;
  }
  var getHiddenInputProps = function getHiddenInputProps() {
    var otherHandlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _extends({
      name: name,
      tabIndex: -1,
      'aria-hidden': true,
      required: required ? true : undefined,
      value: getSerializedValue(selectedOptionsMetadata),
      onChange: noop,
      style: visuallyHiddenStyle
    }, otherHandlers);
  };
  return {
    buttonActive: buttonActive,
    buttonFocusVisible: buttonFocusVisible,
    buttonRef: mergedButtonRef,
    contextValue: contextValue,
    disabled: disabled,
    dispatch: dispatch,
    getButtonProps: getButtonProps,
    getHiddenInputProps: getHiddenInputProps,
    getListboxProps: getListboxProps,
    getOptionMetadata: getOptionMetadata,
    listboxRef: mergedListRootRef,
    open: open,
    options: optionValues,
    value: selectValue,
    highlightedOption: highlightedOption
  };
}
export { useSelect };