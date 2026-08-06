export type FieldSize = 'sm' | 'md' | 'lg';

type FieldSizeStyles = {
  actionInset: string;
  actionSize: string;
  chevronOffset: string;
  containerHeight: string;
  externalLabelText: string;
  filledDisplayPadding: string;
  filledDisplayFloatingLabel: string;
  filledFloatingLabel: string;
  filledInputPadding: string;
  filledTextareaPadding: string;
  helperMarginTop: string;
  helperPaddingX: string;
  horizontalPadding: string;
  iconSize: string;
  labelLeft: string;
  leadingPadding: string;
  multilineIconOffset: string;
  multilineLabelTop: string;
  multilinePaddingY: string;
  optionHeight: string;
  optionHeightPx: number;
  optionPaddingX: string;
  optionText: string;
  passiveTrailingInset: string;
  passiveTrailingSize: string;
  searchInputPaddingLeft: string;
  searchInputPaddingRightWithTrailing: string;
  searchInputPaddingRightWithoutTrailing: string;
  searchText: string;
  searchTriggerPadding: string;
  segmentText: string;
  segmentWidth: string;
  segmentYearWidth: string;
  selectRestingLabelText: string;
  textareaMinHeight: string;
  textareaPaddingY: string;
  trailingPadding: string;
  valueText: string;
};

const FIELD_SIZE_STYLES: Record<FieldSize, FieldSizeStyles> = {
  sm: {
    actionInset: 'right-1',
    actionSize: 'h-6 w-6',
    chevronOffset: 'right-2.5',
    containerHeight: 'h-8',
    externalLabelText: 'text-label-medium',
    filledDisplayPadding: 'pt-3 pb-0.5',
    filledDisplayFloatingLabel: 'top-0.5 translate-y-0',
    filledFloatingLabel: 'top-0.5 translate-y-0',
    filledInputPadding: 'pt-3.5 pb-0',
    filledTextareaPadding: 'pt-5 pb-1.5',
    helperMarginTop: 'mt-1',
    helperPaddingX: 'px-3',
    horizontalPadding: 'px-3',
    iconSize: 'size-icon-sm',
    labelLeft: 'left-3',
    leadingPadding: 'pl-3',
    multilineIconOffset: 'mt-3',
    multilineLabelTop: 'top-3',
    multilinePaddingY: 'py-3',
    optionHeight: 'h-8',
    optionHeightPx: 32,
    optionPaddingX: 'px-3',
    optionText: 'text-label-medium',
    passiveTrailingInset: 'right-2',
    passiveTrailingSize: 'h-5 w-5',
    searchInputPaddingLeft: 'pl-9',
    searchInputPaddingRightWithTrailing: 'pr-9',
    searchInputPaddingRightWithoutTrailing: 'pr-3',
    searchText: 'text-body-small',
    searchTriggerPadding: 'pl-3',
    segmentText: 'text-label-medium',
    segmentWidth: 'w-6',
    segmentYearWidth: 'w-10',
    selectRestingLabelText: 'text-label-medium',
    textareaMinHeight: 'min-h-16',
    textareaPaddingY: 'py-2.5',
    trailingPadding: 'pr-3',
    valueText: 'text-label-medium',
  },
  md: {
    actionInset: 'right-1',
    actionSize: 'h-7 w-7',
    chevronOffset: 'right-3',
    containerHeight: 'h-10',
    externalLabelText: 'text-label-medium',
    filledDisplayPadding: 'pt-4 pb-1',
    filledDisplayFloatingLabel: 'top-0.5 translate-y-0',
    filledFloatingLabel: 'top-1 translate-y-0',
    filledInputPadding: 'pt-5 pb-0.5',
    filledTextareaPadding: 'pt-6 pb-2',
    helperMarginTop: 'mt-1.5',
    helperPaddingX: 'px-4',
    horizontalPadding: 'px-4',
    iconSize: 'size-icon-sm',
    labelLeft: 'left-4',
    leadingPadding: 'pl-4',
    multilineIconOffset: 'mt-4',
    multilineLabelTop: 'top-4',
    multilinePaddingY: 'py-4',
    optionHeight: 'h-10',
    optionHeightPx: 40,
    optionPaddingX: 'px-4',
    optionText: 'text-body-large',
    passiveTrailingInset: 'right-2',
    passiveTrailingSize: 'h-6 w-6',
    searchInputPaddingLeft: 'pl-10',
    searchInputPaddingRightWithTrailing: 'pr-11',
    searchInputPaddingRightWithoutTrailing: 'pr-3',
    searchText: 'text-body-medium',
    searchTriggerPadding: 'pl-3',
    segmentText: 'text-body-large',
    segmentWidth: 'w-7',
    segmentYearWidth: 'w-12',
    selectRestingLabelText: 'text-body-medium',
    textareaMinHeight: 'min-h-20',
    textareaPaddingY: 'py-3',
    trailingPadding: 'pr-4',
    valueText: 'text-body-large',
  },
  lg: {
    actionInset: 'right-2',
    actionSize: 'h-8 w-8',
    chevronOffset: 'right-4',
    containerHeight: 'h-12',
    externalLabelText: 'text-label-large',
    filledDisplayPadding: 'pt-5 pb-1',
    filledDisplayFloatingLabel: 'top-1 translate-y-0',
    filledFloatingLabel: 'top-1.5 translate-y-0',
    filledInputPadding: 'pt-6 pb-1',
    filledTextareaPadding: 'pt-7 pb-3',
    helperMarginTop: 'mt-2',
    helperPaddingX: 'px-5',
    horizontalPadding: 'px-5',
    iconSize: 'size-icon-md',
    labelLeft: 'left-5',
    leadingPadding: 'pl-5',
    multilineIconOffset: 'mt-5',
    multilineLabelTop: 'top-5',
    multilinePaddingY: 'py-5',
    optionHeight: 'h-12',
    optionHeightPx: 48,
    optionPaddingX: 'px-5',
    optionText: 'text-body-large',
    passiveTrailingInset: 'right-3',
    passiveTrailingSize: 'h-6 w-6',
    searchInputPaddingLeft: 'pl-12',
    searchInputPaddingRightWithTrailing: 'pr-12',
    searchInputPaddingRightWithoutTrailing: 'pr-4',
    searchText: 'text-body-large',
    searchTriggerPadding: 'pl-4',
    segmentText: 'text-body-large',
    segmentWidth: 'w-8',
    segmentYearWidth: 'w-14',
    selectRestingLabelText: 'text-body-large',
    textareaMinHeight: 'min-h-24',
    textareaPaddingY: 'py-4',
    trailingPadding: 'pr-5',
    valueText: 'text-body-large',
  },
};

export function getFieldSizeStyles(size: FieldSize = 'md'): FieldSizeStyles {
  return FIELD_SIZE_STYLES[size];
}
