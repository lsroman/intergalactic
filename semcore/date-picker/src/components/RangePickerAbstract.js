import React from 'react';
import dayjs from 'dayjs';
import { Component, Root, CORE_INSTANCE, sstyled } from '@semcore/core';
import Button from '@semcore/button';
import { Box, Flex } from '@semcore/flex-box';
import Divider from '@semcore/divider';
import Dropdown from '@semcore/dropdown';
import i18nEnhance from '@semcore/utils/lib/enhances/i18nEnhance';
import keyboardFocusEnhance from '@semcore/utils/lib/enhances/keyboardFocusEnhance';
import assignProps from '@semcore/utils/lib/assignProps';
import de from '../translations/de.json';
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import it from '../translations/it.json';
import ja from '../translations/ja.json';
import pt from '../translations/pt.json';
import ru from '../translations/ru.json';
import zh from '../translations/zh.json';
import ko from '../translations/ko.json';
import vi from '../translations/vi.json';

import style from '../style/date-picker.shadow.css';

const i18n = { de, en, es, fr, it, ja, ru, zh, pt, ko, vi };

class RangePickerAbstract extends Component {
  static displayName = 'DatePicker';
  static style = style;
  static defaultProps = {
    i18n,
    locale: 'en',
    defaultDisplayedPeriod: new Date(new Date().setHours(0, 0, 0, 0)),
    defaultValue: [],
    defaultHighlighted: [],
    defaultVisible: false,
    disabled: [],
    size: 'm',
  };
  static enhance = [
    i18nEnhance(),
    keyboardFocusEnhance({
      propName: '$keyboardFocusEnhance',
      isDisabled: () => false,
      isCurrent: true,
      focusMethod: 'onFocusCapture',
      blurMethod: 'onBlurCapture',
    }),
  ];

  static add = (date, amount, unit) => {
    return dayjs(date)
      .add(amount, unit)
      .toDate();
  };

  static subtract = (date, amount, unit) => {
    return dayjs(date)
      .subtract(amount, unit)
      .toDate();
  };

  navigateStep;
  keyDiff;
  keyStep;

  state = {
    dirtyValue: [],
  };

  uncontrolledProps() {
    return {
      displayedPeriod: null,
      visible: [
        null,
        (visible) => {
          if (visible) {
            const [startDate, endDate = startDate] = this.asProps.value;
            this.handlers.displayedPeriod(endDate ? dayjs(endDate).toDate() : new Date());
          } else {
            this.handlerChange([]);
          }
        },
      ],
      highlighted: null,
      value: [
        null,
        () => {
          // TODO: работает только из-за new Date() != new Date()
          this.handlers.visible(false);
        },
      ],
    };
  }

  navigateView = (direction) => {
    const { displayedPeriod } = this.asProps;
    const action = direction >= 1 ? 'add' : 'subtract';
    const date = dayjs(displayedPeriod)
      [action](1, this.navigateStep)
      .toDate();
    this.handlers.displayedPeriod(date);
  };

  bindHandlerNavigateClick = (direction) => () => this.navigateView(direction);

  handlerPopperKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    const { displayedPeriod, highlighted } = this.asProps;
    const { dirtyValue } = this.state;
    const day = this.keyDiff[e.keyCode];

    if (e.keyCode === 32 && highlighted.length) {
      this.handlerChange(highlighted[1] || highlighted[0]);
      e.preventDefault();
    }
    if (day) {
      if (highlighted.length) {
        let next_highlighted;
        if (dirtyValue.length === 1) {
          next_highlighted = [
            dirtyValue[0],
            dayjs(highlighted[1] || highlighted[0])
              .add(day, this.keyStep)
              .toDate(),
          ];
        } else {
          next_highlighted = [
            dayjs(highlighted[0])
              .add(day, this.keyStep)
              .toDate(),
          ];
        }
        this.handlers.highlighted(next_highlighted);
        this.handlers.displayedPeriod(next_highlighted[1] || next_highlighted[0]);
      } else {
        this.handlers.highlighted([displayedPeriod]);
      }
      e.preventDefault();
    }
    // this.handlerChange()
  };

  handlerApply = (value) => {
    const [startDate, endDate = startDate] = value;
    this.handlerChange([]);
    this.handlers.value([startDate, endDate]);
  };

  handlerChange = (date) => {
    let { dirtyValue } = this.state;
    let highlighted = [];
    if (Array.isArray(date)) {
      dirtyValue = date;
    } else if (!dirtyValue.length) {
      dirtyValue = [date];
      highlighted = [date];
    } else if (dirtyValue.length >= 2) {
      dirtyValue = [date];
      highlighted = [date];
    } else if (dirtyValue[0] > date) {
      dirtyValue = [date, dirtyValue[0]];
    } else {
      dirtyValue = [dirtyValue[0], date];
    }

    this.setState({ dirtyValue }, () => {
      this.handlers.highlighted(highlighted);
    });
  };

  getDefaultPeriods() {
    return [];
  }

  getTriggerProps() {
    const { value, size } = this.asProps;
    return {
      size,
      empty: !value[0] && !value[1],
    };
  }

  getPopperProps() {
    const Picker = this[CORE_INSTANCE];
    const {
      value,
      periods = this.getDefaultPeriods(),
      unclearable,
      getI18nText,
      $keyboardFocusEnhance,
    } = this.asProps;
    const { dirtyValue } = this.state;

    const buttons = (
      <>
        <Button
          use="primary"
          children={getI18nText('apply')}
          onClick={() => this.handlerApply(dirtyValue.length ? dirtyValue : value)}
        />
        {!unclearable && (
          <Button
            ml={2}
            use="tertiary"
            theme="muted"
            children={getI18nText('reset')}
            onClick={() => this.handlerApply([])}
          />
        )}
      </>
    );

    return assignProps($keyboardFocusEnhance, {
      onKeyDown: this.handlerPopperKeyDown,
      children: (
        <>
          <Flex>
            <Box mr={2}>
              <Picker.Header>
                <Picker.Prev />
                <Picker.Title />
              </Picker.Header>
              <Picker.Calendar />
            </Box>
            <Box ml={2}>
              <Picker.Header>
                <Picker.Title />
                <Picker.Next />
              </Picker.Header>
              <Picker.Calendar />
            </Box>
            {Boolean(periods.length) && (
              <>
                <Divider m="-16px 16px" orientation="vertical" h="auto" />
                <Flex direction="column">
                  <Picker.Period />
                  <Flex mt="auto">{buttons}</Flex>
                </Flex>
              </>
            )}
          </Flex>
          {!Boolean(periods.length) && <Flex mt={4}>{buttons}</Flex>}
        </>
      ),
    });
  }

  getHeaderProps() {
    const Picker = this[CORE_INSTANCE];
    return {
      children: (
        <>
          <Picker.Prev />
          <Picker.Title />
          <Picker.Next />
        </>
      ),
    };
  }

  getTitleProps(props, index) {
    const { locale, displayedPeriod } = this.asProps;
    return {
      children: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        dayjs(displayedPeriod)
          .add(index, this.navigateStep)
          .startOf(this.navigateStep)
          .toDate(),
      ),
    };
  }

  getNextProps() {
    return {
      onClick: this.bindHandlerNavigateClick(1),
    };
  }

  getPrevProps() {
    return {
      onClick: this.bindHandlerNavigateClick(-1),
    };
  }

  getCalendarProps(props, index) {
    const {
      locale,
      displayedPeriod,
      disabled,
      value,
      highlighted,
      onHighlightedChange,
    } = this.asProps;
    const { dirtyValue } = this.state;

    return {
      locale,
      displayedPeriod: dayjs(displayedPeriod)
        .add(index, this.navigateStep)
        .startOf(this.navigateStep)
        .toDate(),
      disabled,
      highlighted,
      onHighlightedChange,
      value: dirtyValue.length ? dirtyValue : value,
      onChange: this.handlerChange,
    };
  }

  getPeriodProps() {
    const {
      periods = this.getDefaultPeriods(),
      value,
      onHighlightedChange,
      onDisplayedPeriodChange,
    } = this.asProps;
    const { dirtyValue } = this.state;
    return {
      periods,
      value: dirtyValue.length ? dirtyValue : value,
      onChange: this.handlerApply,
      onHighlightedChange,
      onDisplayedPeriodChange,
    };
  }

  render() {
    return sstyled(this.asProps.styles)(<Root render={Dropdown} />);
  }
}

export default RangePickerAbstract;
