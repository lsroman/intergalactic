import React from 'react';
import createComponent, { Root, sstyled } from '@semcore/core';
import { Skeleton } from '../Skeleton';
import styles from '../style/chart.shadow.css';

const bubbleSvg = preval`
module.exports = btoa(require('fs').readFileSync(__dirname + '/../svg/bubble-chart.svg'))
`;

const BubbleChartSkeleton = () => {
  const SChartSkeleton = Root;
  return sstyled(styles)(
    <SChartSkeleton
      render={Skeleton}
      bgRepeat='repeat-x'
      bgPosition='left center'
      bgSize='auto 50%'
      bgPattern={`url(data:image/svg+xml;base64,${bubbleSvg})`}
    />,
  );
};

export default createComponent(BubbleChartSkeleton);
