---
title: API
fileSource: d3-chart
---

@## D3 API


@## Chart.Donut

```js
import { Chart } from '@semcore/ui/d3-chart';
```

@typescript DonutChartProps

@## Donut

It have children components `Pie`, `Label`, `EmptyData`.

```js
import { Donut } from '@semcore/ui/d3-chart';

<Donut>
  <Donut.EmptyData />
  <Donut.Pie />
  <Donut.Label />
</Donut>;
```

@typescript DonutProps