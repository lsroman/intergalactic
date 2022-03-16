import React from 'react';
import { testing } from '@semcore/cli/tools/jest-preset-ui';
const { cleanup, fireEvent, render, axe } = testing;

import { snapshot } from '@semcore/cli/tools/jest-preset-ui';
import Radio, { RadioGroup, inputProps } from '../src';
import { shared as testsShared } from '@semcore/cli/tools/jest-preset-ui';
const { shouldSupportClassName, shouldSupportRef } = testsShared;

describe('Radio', () => {
  afterEach(cleanup);

  shouldSupportClassName(Radio);
  shouldSupportRef(Radio);
  shouldSupportClassName(Radio.Value, Radio);
  shouldSupportRef(Radio.Value, Radio);
  shouldSupportClassName(Radio.Text, Radio);
  shouldSupportRef(Radio.Text, Radio);

  test('should support custom attributes on the input', () => {
    const { getByTestId } = render(
      <Radio>
        <Radio.Value
          includeInputProps={['data-testid', ...inputProps]}
          data-testid="input"
          name="radio"
        />
      </Radio>,
    );

    expect(getByTestId('input').attributes['name'].value).toBe('radio');
  });

  test('should support sizes', async () => {
    const component = (
      <snapshot.ProxyProps m="5px">
        <Radio size="xl">
          <Radio.Value />
        </Radio>
        <Radio size="l">
          <Radio.Value />
        </Radio>
        <Radio size="m">
          <Radio.Value />
        </Radio>
      </snapshot.ProxyProps>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });

  test('should support focus, defaultChecked, checked, invalid, disabled', async () => {
    const component = (
      <snapshot.ProxyProps m="5px">
        <Radio>
          <Radio.Value />
        </Radio>
        <Radio>
          <Radio.Value checked onChange={() => {}} />
        </Radio>
        <Radio state="invalid">
          <Radio.Value />
        </Radio>
        <Radio>
          <Radio.Value defaultChecked disabled />
        </Radio>
      </snapshot.ProxyProps>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });

  test('should support change of state "checked" on click in label', async () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <Radio data-testid="label">
        <Radio.Value onChange={spy} />
      </Radio>,
    );

    fireEvent.click(getByTestId('label'));
    expect(spy).toHaveBeenCalled();
  });
});

describe('RadioGroup', () => {
  afterEach(cleanup);

  test('transfer name to Radio', () => {
    const { getByTestId } = render(
      <RadioGroup name="test">
        <Radio>
          <Radio.Value includeInputProps={['data-testid', ...inputProps]} data-testid="radio" />
        </Radio>
      </RadioGroup>,
    );

    expect(getByTestId('radio').name).toContain('test');
  });

  test('should support onChange', () => {
    const onChange = jest.fn();
    const onChangeRadio = jest.fn();
    const value = 'test';
    const { getByTestId } = render(
      <RadioGroup onChange={onChange}>
        <Radio>
          <Radio.Value
            includeInputProps={['data-testid', ...inputProps]}
            data-testid="radio"
            value={value}
            onChange={onChangeRadio}
          />
        </Radio>
      </RadioGroup>,
    );

    fireEvent.click(getByTestId('radio'));
    expect(onChange).toHaveBeenCalledWith(value, expect.anything());
    expect(onChangeRadio).toHaveBeenCalled();
  });

  test('should support initial value', () => {
    const { getByTestId } = render(
      <RadioGroup name="test" value="1">
        <Radio>
          <Radio.Value
            value="1"
            includeInputProps={['data-testid', ...inputProps]}
            data-testid="radio"
          />
          <Radio.Value
            value="2"
            includeInputProps={['data-testid', ...inputProps]}
            data-testid="radioSecond"
          />
        </Radio>
      </RadioGroup>,
    );

    expect(getByTestId('radio').checked).toBeTruthy();
    expect(getByTestId('radioSecond').checked).toBeFalsy();
  });

  test('should support sizes', async () => {
    const component = (
      <snapshot.ProxyProps m="5px">
        <RadioGroup size="xl">
          <Radio>
            <Radio.Value />
          </Radio>
          <Radio>
            <Radio.Value />
          </Radio>
        </RadioGroup>
        <RadioGroup size="l">
          <Radio>
            <Radio.Value />
          </Radio>
          <Radio>
            <Radio.Value />
          </Radio>
        </RadioGroup>
        <RadioGroup size="m">
          <Radio>
            <Radio.Value />
          </Radio>
          <Radio>
            <Radio.Value />
          </Radio>
        </RadioGroup>
      </snapshot.ProxyProps>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });

  test('should support change size when set property in Radio.Value', async () => {
    const component = (
      <snapshot.ProxyProps m="5px">
        <RadioGroup>
          <Radio>
            <Radio.Value />
          </Radio>
          <Radio size="xl">
            <Radio.Value />
          </Radio>
        </RadioGroup>
      </snapshot.ProxyProps>
    );
    expect(await snapshot(component)).toMatchImageSnapshot();
  });

  test('a11y', async () => {
    const { container } = render(
      <RadioGroup name="radio" value="1">
        <Radio>
          <Radio.Value value="1" />
          <Radio.Text>1</Radio.Text>
        </Radio>
        <Radio>
          <Radio.Value value="2" />
          <Radio.Text>2</Radio.Text>
        </Radio>
      </RadioGroup>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
