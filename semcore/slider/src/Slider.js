import React from 'react';
import createComponent, { Component, styled, use } from '@semcore/core';
import { Box } from '@semcore/flex-box';

import style from './style/slider.shadow.css';
import resolveColor, { shade } from '@semcore/utils/lib/color';

class SliderRoot extends Component {
  static displayName = 'Slider';
  static style = style;
  $slider;
  $knob;
  $bar;

  static defaultProps = () => ({
    defaultValue: null,
    min: 0,
    max: 100,
    step: 1,
    children: (
      <>
        <Slider.Bar />
        <Slider.Knob />
      </>
    ),
    color: '#2B94E1',
    background: '#00000010',
    interactive: true,
  });

  refKnob = (node) => (this.$knob = node);
  refSlider = (node) => (this.$slider = node);
  refBar = (node) => (this.$bar = node);

  getKnobProps() {
    const { value, color, min, max, disabled, interactive } = this.asProps;
    return {
      value,
      color,
      min,
      max,
      disabled,
      interactive,
      ref: this.refKnob,
    };
  }

  getBarProps() {
    const { value, color, min, max, disabled, interactive } = this.asProps;
    return {
      value,
      color,
      min,
      max,
      disabled,
      interactive,
      ref: this.refBar,
    };
  }

  uncontrolledProps() {
    return {
      value: (value) => value,
    };
  }

  updateValue = (value, e) => {
    this.handlers.value(value, e);
  };

  handleMove = (e) => {
    const { min, max, step } = this.asProps;
    e.preventDefault();
    const slider = this.$slider;
    const knob = this.$knob;
    const bar = this.$bar;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(e) {
      const knobSize = knob.offsetWidth;
      const sliderSize = slider.offsetWidth;
      let newLeft = e.clientX - slider.getBoundingClientRect().left - knob.offsetWidth / 2;

      if (newLeft < 0) {
        newLeft = 0;
      }
      const rightEdge = sliderSize - knob.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      const relativeValue = newLeft / (sliderSize - knobSize);
      const relativeStep = step / (max - min);
      const countSteps = Math.round(relativeValue / relativeStep);
      const currentValue = countSteps * step + min;
      const valueInPercent = ((currentValue - min) / (max - min)) * 100;

      knob.style.left = `calc(${valueInPercent}% - ${knobSize / 2}px)`;
      bar.style.width = `calc(${valueInPercent}% - ${knobSize / 2}px)`;

      return currentValue;
    }

    this.updateValue(onMouseMove(e), e);

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('click', onMouseMove);
      document.removeEventListener('mousemove', onMouseMove);
    }
  };

  onKeyPressed = (e) => {
    const { value, min, max, step } = this.asProps;
    const slider = this.$slider;

    e.preventDefault();
    function inc(v, step) {
      if (v === max) {
        return v;
      }
      return v + step;
    }
    function dec(v, step) {
      if (v === min) {
        return v;
      }
      return v - step;
    }

    switch (e.keyCode) {
      case 39:
        this.updateValue(inc(value, step), e);
        break;
      case 37:
        this.updateValue(dec(value, step), e);
        break;
      case 27:
        slider.blur();
        break;
    }
  };

  render() {
    const { Root: SSlider } = this;
    const { Children, styles, disabled, background } = this.asProps;
    const SInput = Box;

    return styled(styles)`
      SSlider {
        background-color: ${background};
      }
    `(
      <>
        <SSlider
          render={Box}
          disabled={disabled}
          ref={this.refSlider}
          onMouseDown={this.handleMove}
          onMouseUp={this.handleMove}
          onDragStart={() => false}
          onKeyDown={this.onKeyPressed}
          tabIndex="0"
        >
          <Children />
          <SInput tag="input" type="hidden" />
        </SSlider>
      </>,
    );
  }
}

function convertValueToPercent(value, min, max) {
  if (value > max) return 100;
  if (value < min) return min;
  else return ((value - min) / (max - min)) * 100;
}

function Bar(props) {
  const {
    Root: SBar,
    styles,
    value,
    refBar,
    min,
    max,
    color: colorProps,
    disabled,
    interactive,
  } = props;
  const width = `${convertValueToPercent(value, min, max)}%`;
  const color = resolveColor(colorProps);

  return styled(styles)`
    SBar[use|color] {
      background-color: ${color};
    }
    SBar[use|interactive] {
      &:hover {
        background-color: ${shade(color, -0.12)};
      }
    }
  `(
    <SBar
      render={Box}
      w={width}
      disabled={disabled}
      ref={refBar}
      {...use({ color, interactive })}
    />,
  );
}

function Knob(props) {
  const {
    Root: SKnob,
    styles,
    value,
    refKnob,
    min,
    max,
    color: colorProps,
    disabled,
    interactive,
  } = props;
  const knobWidth = '10px';
  const left = `calc(${convertValueToPercent(value, min, max, knobWidth)}% - ${knobWidth})`;
  const color = resolveColor(colorProps);

  return styled(styles)`
    SKnob[use|color] {
      border-color: ${color};
    }
    SKnob[use|interactive] {
      &:hover {
        border-color: ${shade(color, -0.12)};
      }
    }
  `(
    <SKnob
      render={Box}
      disabled={disabled}
      ref={refKnob}
      left={left}
      w={knobWidth}
      {...use({ color, interactive })}
    />,
  );
}

const Slider = createComponent(SliderRoot, { Bar, Knob });
export default Slider;
