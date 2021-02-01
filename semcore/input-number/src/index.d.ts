import React from 'react';
import { IInputAddonProps, IInputProps, IInputValueProps } from '@semcore/input';

/* utils type */
type CProps<Props, Ctx = {}, UCProps = {}> = Props & {
  children?: ((props: Props & Ctx, handlers: UCProps) => React.ReactNode) | React.ReactNode;
};
type ReturnEl = React.ReactElement | null;
/* utils type */

export type InputNumberValue = string | number | null;

export interface IInputNumberProps extends IInputProps {
  /** Input size
   * @default m
   * */
  size?: 'm' | 'l' | 'xl';
}

export interface IInputNumberValueProps extends IInputValueProps {
  /** Minimum value
   * @default Number.MIN_SAFE_INTEGER
   */
  min?: number;
  /** Maximum value
   * @default Number.MAX_SAFE_INTEGER
   */
  max?: number;
  /** Value change step
   * @default 1
   */
  step?: number;
  /** Numeric value */
  value?: InputNumberValue;
  /** Called when the input value changes, it returns its current value in numeric format */
  onChange?: (value: InputNumberValue, event: React.SyntheticEvent<HTMLInputElement>) => void;
}

export interface IInputNumberControlsProps extends IInputAddonProps {
  /** Always displays controls (steppers)
   * @default false
   */
  showControls?: boolean;
}

export interface IInputNumberCtx {
  getValueProps: PropGetterFn;
  getControlsProps: PropGetterFn;
  getAddonProps: PropGetterFn;
}

declare const Input: (<T>(props: CProps<IInputNumberProps & T, IInputNumberCtx>) => ReturnEl) & {
  Value: <T>(props: IInputNumberValueProps & T) => ReturnEl;
  Controls: <T>(props: CProps<IInputNumberControlsProps & T, IInputNumberProps>) => ReturnEl;
  Addon: <T>(props: CProps<IInputAddonProps & T, IInputNumberProps>) => ReturnEl;
};
export default Input;
