'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { ListActionTypes } from './listActions.types';
import { listReducer as defaultReducer } from './listReducer';
import { useListChangeNotifiers } from './useListChangeNotifiers';
import { useControllableReducer } from '../utils/useControllableReducer';
import { areArraysEqual } from '../utils/areArraysEqual';
import { useLatest } from '../utils/useLatest';
import { useTextNavigation } from '../utils/useTextNavigation';
const EMPTY_OBJECT = {};
const NOOP = () => {};
const defaultItemComparer = (optionA, optionB) => optionA === optionB;
const defaultIsItemDisabled = () => false;
const defaultItemStringifier = item => typeof item === 'string' ? item : String(item);
const defaultGetInitialState = () => ({
  highlightedValue: null,
  selectedValues: []
});

/**
 * The useList is a lower-level utility that is used to build list-like components.
 * It's used to manage the state of the list and its items.
 *
 * Supports highlighting a single item and selecting an arbitrary number of items.
 *
 * The state of the list is managed by a controllable reducer - that is a reducer that can have its state
 * controlled from outside.
 *
 * By default, the state consists of `selectedValues` and `highlightedValue` but can be extended by the caller of the hook.
 * Also the actions that can be dispatched and the reducer function can be defined externally.
 *
 * @template ItemValue The type of the item values.
 * @template State The type of the list state. This should be a subtype of `ListState<ItemValue>`.
 * @template CustomAction The type of the actions that can be dispatched (besides the standard ListAction).
 * @template CustomActionContext The shape of additional properties that will be added to actions when dispatched.
 *
 * @ignore - internal hook.
 */
function useList(params) {
  const {
    controlledProps = EMPTY_OBJECT,
    disabledItemsFocusable = false,
    disableListWrap = false,
    focusManagement = 'activeDescendant',
    getInitialState = defaultGetInitialState,
    getItemDomElement,
    getItemId,
    isItemDisabled = defaultIsItemDisabled,
    rootRef: externalListRef,
    onStateChange = NOOP,
    items,
    itemComparer = defaultItemComparer,
    getItemAsString = defaultItemStringifier,
    onChange,
    onHighlightChange,
    onItemsChange,
    orientation = 'vertical',
    pageSize = 5,
    reducerActionContext = EMPTY_OBJECT,
    selectionMode = 'single',
    stateReducer: externalReducer
  } = params;
  if (process.env.NODE_ENV !== 'production') {
    if (focusManagement === 'DOM' && getItemDomElement == null) {
      throw new Error('useList: The `getItemDomElement` prop is required when using the `DOM` focus management.');
    }
    if (focusManagement === 'activeDescendant' && getItemId == null) {
      throw new Error('useList: The `getItemId` prop is required when using the `activeDescendant` focus management.');
    }
  }
  const listRef = React.useRef(null);
  const handleRef = useForkRef(externalListRef, listRef);
  const handleHighlightChange = React.useCallback((event, value, reason) => {
    onHighlightChange?.(event, value, reason);
    if (focusManagement === 'DOM' && value != null && (reason === ListActionTypes.itemClick || reason === ListActionTypes.keyDown || reason === ListActionTypes.textNavigation)) {
      getItemDomElement?.(value)?.focus();
    }
  }, [getItemDomElement, onHighlightChange, focusManagement]);
  const stateComparers = React.useMemo(() => ({
    highlightedValue: itemComparer,
    selectedValues: (valuesArray1, valuesArray2) => areArraysEqual(valuesArray1, valuesArray2, itemComparer)
  }), [itemComparer]);

  // This gets called whenever a reducer changes the state.
  const handleStateChange = React.useCallback((event, field, value, reason, state) => {
    onStateChange?.(event, field, value, reason, state);
    switch (field) {
      case 'highlightedValue':
        handleHighlightChange(event, value, reason);
        break;
      case 'selectedValues':
        onChange?.(event, value, reason);
        break;
      default:
        break;
    }
  }, [handleHighlightChange, onChange, onStateChange]);

  // The following object is added to each action when it's dispatched.
  // It's accessible in the reducer via the `action.context` field.
  const listActionContext = React.useMemo(() => {
    return {
      disabledItemsFocusable,
      disableListWrap,
      focusManagement,
      isItemDisabled,
      itemComparer,
      items,
      getItemAsString,
      onHighlightChange: handleHighlightChange,
      orientation,
      pageSize,
      selectionMode,
      stateComparers
    };
  }, [disabledItemsFocusable, disableListWrap, focusManagement, isItemDisabled, itemComparer, items, getItemAsString, handleHighlightChange, orientation, pageSize, selectionMode, stateComparers]);
  const initialState = getInitialState();
  const reducer = externalReducer ?? defaultReducer;
  const actionContext = React.useMemo(() => _extends({}, reducerActionContext, listActionContext), [reducerActionContext, listActionContext]);
  const [state, dispatch] = useControllableReducer({
    reducer,
    actionContext,
    initialState: initialState,
    controlledProps,
    stateComparers,
    onStateChange: handleStateChange
  });
  const {
    highlightedValue,
    selectedValues
  } = state;
  const handleTextNavigation = useTextNavigation((searchString, event) => dispatch({
    type: ListActionTypes.textNavigation,
    event,
    searchString
  }));

  // introducing refs to avoid recreating the getItemState function on each change.
  const latestSelectedValues = useLatest(selectedValues);
  const latestHighlightedValue = useLatest(highlightedValue);
  const previousItems = React.useRef([]);
  React.useEffect(() => {
    // Whenever the `items` object changes, we need to determine if the actual items changed.
    // If they did, we need to dispatch an `itemsChange` action, so the selected/highlighted state is updated.
    if (areArraysEqual(previousItems.current, items, itemComparer)) {
      return;
    }
    dispatch({
      type: ListActionTypes.itemsChange,
      event: null,
      items,
      previousItems: previousItems.current
    });
    previousItems.current = items;
    onItemsChange?.(items);
  }, [items, itemComparer, dispatch, onItemsChange]);

  // Subitems are notified of changes to the highlighted and selected values.
  // This is not done via context because we don't want to trigger a re-render of all the subitems each time any of them changes state.
  // Instead, we use a custom message bus to publish messages about changes.
  // On the child component, we use a custom hook to subscribe to these messages and re-render only when the value they care about changes.
  const {
    notifySelectionChanged,
    notifyHighlightChanged,
    registerHighlightChangeHandler,
    registerSelectionChangeHandler
  } = useListChangeNotifiers();
  React.useEffect(() => {
    notifySelectionChanged(selectedValues);
  }, [selectedValues, notifySelectionChanged]);
  React.useEffect(() => {
    notifyHighlightChanged(highlightedValue);
  }, [highlightedValue, notifyHighlightChanged]);
  const createHandleKeyDown = other => event => {
    other.onKeyDown?.(event);
    if (event.defaultMuiPrevented) {
      return;
    }
    const keysToPreventDefault = ['Home', 'End', 'PageUp', 'PageDown'];
    if (orientation === 'vertical') {
      keysToPreventDefault.push('ArrowUp', 'ArrowDown');
    } else {
      keysToPreventDefault.push('ArrowLeft', 'ArrowRight');
    }
    if (focusManagement === 'activeDescendant') {
      // When the child element is focused using the activeDescendant attribute,
      // the list handles keyboard events on its behalf.
      // We have to `preventDefault()` is this case to prevent the browser from
      // scrolling the view when space is pressed or submitting forms when enter is pressed.
      keysToPreventDefault.push(' ', 'Enter');
    }
    if (keysToPreventDefault.includes(event.key)) {
      event.preventDefault();
    }
    dispatch({
      type: ListActionTypes.keyDown,
      key: event.key,
      event
    });
    handleTextNavigation(event);
  };
  const createHandleBlur = other => event => {
    other.onBlur?.(event);
    if (event.defaultMuiPrevented) {
      return;
    }
    if (listRef.current?.contains(event.relatedTarget)) {
      // focus remains within the list
      return;
    }
    dispatch({
      type: ListActionTypes.blur,
      event
    });
  };
  const getRootProps = (otherHandlers = {}) => {
    return _extends({}, otherHandlers, {
      'aria-activedescendant': focusManagement === 'activeDescendant' && highlightedValue != null ? getItemId(highlightedValue) : undefined,
      onBlur: createHandleBlur(otherHandlers),
      onKeyDown: createHandleKeyDown(otherHandlers),
      tabIndex: focusManagement === 'DOM' ? -1 : 0,
      ref: handleRef
    });
  };
  const getItemState = React.useCallback(item => {
    const index = items.findIndex(i => itemComparer(i, item));
    const selected = (latestSelectedValues.current ?? []).some(value => value != null && itemComparer(item, value));
    const disabled = isItemDisabled(item, index);
    const highlighted = latestHighlightedValue.current != null && itemComparer(item, latestHighlightedValue.current);
    const focusable = focusManagement === 'DOM';
    return {
      disabled,
      focusable,
      highlighted,
      index,
      selected
    };
  }, [items, isItemDisabled, itemComparer, latestSelectedValues, latestHighlightedValue, focusManagement]);
  const contextValue = React.useMemo(() => ({
    dispatch,
    getItemState,
    registerHighlightChangeHandler,
    registerSelectionChangeHandler
  }), [dispatch, getItemState, registerHighlightChangeHandler, registerSelectionChangeHandler]);
  React.useDebugValue({
    state
  });
  return {
    contextValue,
    dispatch,
    getRootProps,
    rootRef: handleRef,
    state
  };
}
export { useList };