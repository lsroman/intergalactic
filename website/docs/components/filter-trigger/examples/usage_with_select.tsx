import React from 'react';
import { FilterTrigger } from 'intergalactic/base-trigger';
import Select from 'intergalactic/select';
import { Text } from 'intergalactic/typography';
import { Box } from 'intergalactic/flex-box';

const options = Array(6)
  .fill(0)
  .map((i, idx) => ({
    title: `Option ${idx}`,
  }));

const Demo = () => {
  return (
    <>
      <Text tag='label' htmlFor='filter-trigger' size={200}>
        Filter trigger with options
      </Text>
      <Box mt={2}>
        <Select>
          <Select.Trigger tag={FilterTrigger} id='filter-trigger' />
          <Select.Menu>
            {options.map((option, idx) => {
              const { title } = option;
              return (
                <Select.Option value={title} key={idx}>
                  {title}
                </Select.Option>
              );
            })}
          </Select.Menu>
        </Select>
      </Box>
    </>
  );
};

export default Demo;
