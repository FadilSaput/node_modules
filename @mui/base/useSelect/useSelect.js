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
const visuallyHiddenStyle = {
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

const noop = () => {};
function defaultFormValueProvider(selectedOption) {
  if (Array.isArray(selectedOption)) {
    if (selectedOption.length === 0) {
      return '';
    }
    return JSON.stringify(selectedOption.map(o => o.value));
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
  const {
    areOptionsEqual,
    buttonRef: buttonRefProp,
    defaultOpen = false,
    defaultValue: defaultValueProp,
    disabled = false,
    listboxId: listboxIdProp,
    listboxRef: listboxRefProp,
    multiple = false,
    name,
    required,
    onChange,
    onHighlightChange,
    onOpenChange,
    open: openProp,
    options: optionsParam,
    getOptionAsString = defaultOptionStringifier,
    getSerializedValue = defaultFormValueProvider,
    value: valueProp
  } = props;
  const buttonRef = React.useRef(null);
  const handleButtonRef = useForkRef(buttonRefProp, buttonRef);
  const listboxRef = React.useRef(null);
  const listboxId = useId(listboxIdProp);
  let defaultValue;
  if (valueProp === undefined && defaultValueProp === undefined) {
    defaultValue = [];
  } else if (defaultValueProp !== undefined) {
    if (multiple) {
      defaultValue = defaultValueProp;
    } else {
      defaultValue = defaultValueProp == null ? [] : [defaultValueProp];
    }
  }
  const value = React.useMemo(() => {
    if (valueProp !== undefined) {
      if (multiple) {
        return valueProp;
      }
      return valueProp == null ? [] : [valueProp];
    }
    return undefined;
  }, [valueProp, multiple]);
  const {
    subitems,
    contextValue: compoundComponentContextValue
  } = useCompoundParent();
  const options = React.useMemo(() => {
    if (optionsParam != null) {
      return new Map(optionsParam.map((option, index) => [option.value, {
        value: option.value,
        label: option.label,
        disabled: option.disabled,
        ref: /*#__PURE__*/React.createRef(),
        id: `${listboxId}_${index}`
      }]));
    }
    return subitems;
  }, [optionsParam, subitems, listboxId]);
  const handleListboxRef = useForkRef(listboxRefProp, listboxRef);
  const {
    getRootProps: getButtonRootProps,
    active: buttonActive,
    focusVisible: buttonFocusVisible,
    rootRef: mergedButtonRef
  } = useButton({
    disabled,
    rootRef: handleButtonRef
  });
  const optionValues = React.useMemo(() => Array.from(options.keys()), [options]);
  const getOptionByValue = React.useCallback(valueToGet => {
    // This can't be simply `options.get(valueToGet)` because of the `areOptionsEqual` prop.
    // If it's provided, we assume that the user wants to compare the options by value.
    if (areOptionsEqual !== undefined) {
      const similarValue = optionValues.find(optionValue => areOptionsEqual(optionValue, valueToGet));
      return options.get(similarValue);
    }
    return options.get(valueToGet);
  }, [options, areOptionsEqual, optionValues]);
  const isItemDisabled = React.useCallback(valueToCheck => {
    var _option$disabled;
    const option = getOptionByValue(valueToCheck);
    return (_option$disabled = option == null ? void 0 : option.disabled) != null ? _option$disabled : false;
  }, [getOptionByValue]);
  const stringifyOption = React.useCallback(valueToCheck => {
    const option = getOptionByValue(valueToCheck);
    if (!option) {
      return '';
    }
    return getOptionAsString(option);
  }, [getOptionByValue, getOptionAsString]);
  const controlledState = React.useMemo(() => ({
    selectedValues: value,
    open: openProp
  }), [value, openProp]);
  const getItemId = React.useCallback(itemValue => {
    var _options$get;
    return (_options$get = options.get(itemValue)) == null ? void 0 : _options$get.id;
  }, [options]);
  const handleSelectionChange = React.useCallback((event, newValues) => {
    if (multiple) {
      onChange == null ? void 0 : onChange(event, newValues);
    } else {
      var _newValues$;
      onChange == null ? void 0 : onChange(event, (_newValues$ = newValues[0]) != null ? _newValues$ : null);
    }
  }, [multiple, onChange]);
  const handleHighlightChange = React.useCallback((event, newValue) => {
    onHighlightChange == null ? void 0 : onHighlightChange(event, newValue != null ? newValue : null);
  }, [onHighlightChange]);
  const handleStateChange = React.useCallback((event, field, fieldValue) => {
    if (field === 'open') {
      onOpenChange == null ? void 0 : onOpenChange(fieldValue);
      if (fieldValue === false && (event == null ? void 0 : event.type) !== 'blur') {
        var _buttonRef$current;
        (_buttonRef$current = buttonRef.current) == null ? void 0 : _buttonRef$current.focus();
      }
    }
  }, [onOpenChange]);
  const useListParameters = {
    getInitialState: () => {
      var _defaultValue;
      return {
        highlightedValue: null,
        selectedValues: (_defaultValue = defaultValue) != null ? _defaultValue : [],
        open: defaultOpen
      };
    },
    getItemId,
    controlledProps: controlledState,
    itemComparer: areOptionsEqual,
    isItemDisabled,
    rootRef: mergedButtonRef,
    onChange: handleSelectionChange,
    onHighlightChange: handleHighlightChange,
    onStateChange: handleStateChange,
    reducerActionContext: React.useMemo(() => ({
      multiple
    }), [multiple]),
    items: optionValues,
    getItemAsString: stringifyOption,
    selectionMode: multiple ? 'multiple' : 'single',
    stateReducer: selectReducer
  };
  const {
    dispatch,
    getRootProps: getListboxRootProps,
    contextValue: listContextValue,
    state: {
      open,
      highlightedValue: highlightedOption,
      selectedValues: selectedOptions
    },
    rootRef: mergedListRootRef
  } = useList(useListParameters);
  const createHandleButtonMouseDown = otherHandlers => event => {
    var _otherHandlers$onMous;
    otherHandlers == null || (_otherHandlers$onMous = otherHandlers.onMouseDown) == null ? void 0 : _otherHandlers$onMous.call(otherHandlers, event);
    if (!event.defaultMuiPrevented) {
      const action = {
        type: SelectActionTypes.buttonClick,
        event
      };
      dispatch(action);
    }
  };
  useEnhancedEffect(() => {
    // Scroll to the currently highlighted option.
    if (highlightedOption != null) {
      var _getOptionByValue;
      const optionRef = (_getOptionByValue = getOptionByValue(highlightedOption)) == null ? void 0 : _getOptionByValue.ref;
      if (!listboxRef.current || !(optionRef != null && optionRef.current)) {
        return;
      }
      const listboxClientRect = listboxRef.current.getBoundingClientRect();
      const optionClientRect = optionRef.current.getBoundingClientRect();
      if (optionClientRect.top < listboxClientRect.top) {
        listboxRef.current.scrollTop -= listboxClientRect.top - optionClientRect.top;
      } else if (optionClientRect.bottom > listboxClientRect.bottom) {
        listboxRef.current.scrollTop += optionClientRect.bottom - listboxClientRect.bottom;
      }
    }
  }, [highlightedOption, getOptionByValue]);
  const getOptionMetadata = React.useCallback(optionValue => getOptionByValue(optionValue), [getOptionByValue]);
  const getSelectTriggerProps = (otherHandlers = {}) => {
    return _extends({}, otherHandlers, {
      onMouseDown: createHandleButtonMouseDown(otherHandlers),
      ref: mergedListRootRef,
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listboxId
    });
  };
  const getButtonProps = (otherHandlers = {}) => {
    const listboxAndButtonProps = combineHooksSlotProps(getButtonRootProps, getListboxRootProps);
    const combinedProps = combineHooksSlotProps(listboxAndButtonProps, getSelectTriggerProps);
    return combinedProps(otherHandlers);
  };
  const getListboxProps = (otherHandlers = {}) => {
    return _extends({}, otherHandlers, {
      id: listboxId,
      role: 'listbox',
      'aria-multiselectable': multiple ? 'true' : undefined,
      ref: handleListboxRef,
      onMouseDown: preventDefault // to prevent the button from losing focus when interacting with the listbox
    });
  };

  React.useDebugValue({
    selectedOptions,
    highlightedOption,
    open
  });
  const contextValue = React.useMemo(() => _extends({}, listContextValue, compoundComponentContextValue), [listContextValue, compoundComponentContextValue]);
  let selectValue;
  if (props.multiple) {
    selectValue = selectedOptions;
  } else {
    selectValue = selectedOptions.length > 0 ? selectedOptions[0] : null;
  }
  let selectedOptionsMetadata;
  if (multiple) {
    selectedOptionsMetadata = selectValue.map(v => getOptionMetadata(v)).filter(o => o !== undefined);
  } else {
    var _getOptionMetadata;
    selectedOptionsMetadata = (_getOptionMetadata = getOptionMetadata(selectValue)) != null ? _getOptionMetadata : null;
  }
  const getHiddenInputProps = (otherHandlers = {}) => _extends({
    name,
    tabIndex: -1,
    'aria-hidden': true,
    required: required ? true : undefined,
    value: getSerializedValue(selectedOptionsMetadata),
    onChange: noop,
    style: visuallyHiddenStyle
  }, otherHandlers);
  return {
    buttonActive,
    buttonFocusVisible,
    buttonRef: mergedButtonRef,
    contextValue,
    disabled,
    dispatch,
    getButtonProps,
    getHiddenInputProps,
    getListboxProps,
    getOptionMetadata,
    listboxRef: mergedListRootRef,
    open,
    options: optionValues,
    value: selectValue,
    highlightedOption
  };
}
export { useSelect };