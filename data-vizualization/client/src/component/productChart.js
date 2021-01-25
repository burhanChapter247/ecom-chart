import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { withStyles } from "@material-ui/core/styles";
import {
  ArgumentScale,
  Stack,
  Animation,
  EventTracker,
  HoverState,
  SelectionState,
} from "@devexpress/dx-react-chart";
import axios from "axios";
import { useQuery } from "react-query";

const tooltipContentTitleStyle = {
  fontWeight: "bold",
  paddingBottom: 0,
};
const tooltipContentBodyStyle = {
  paddingTop: 0,
};

//const formatTooltip = d3Format.format(",.2r");
const TooltipContent = (props) => {
  const { targetItem, text, ...restProps } = props;
  return (
    <div>
      <Tooltip.Content
        {...restProps}
        style={tooltipContentTitleStyle}
        text={targetItem.title}
      />
    </div>
  );
};

const Root = withStyles({
  root: {
    display: "flex",
    margin: "auto",
    flexDirection: "row",
  },
})(({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
));
const Label = withStyles({
  label: {
    whiteSpace: "nowrap",
  },
})(({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
));

export default () => {
  const [tooltipKeys, settooltipKeys] = useState({
    hover: null,
    tooltipTarget: null,
    tooltipEnabled: true,
  });

  const changeTooltip = (targetItem) => {
    settooltipKeys({ ...tooltipKeys, tooltipTarget: targetItem });
  };

  const { isLoading, error, data } = useQuery("pchart", async () => {
    const { data } = await axios("/v1/product/chart-data");
    return data;
  });

  return (
    <Paper>
      {error && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Retrieving Product Chart ...</div>
      ) : (
        <Chart data={data.data}>
          <ArgumentAxis />
          <ValueAxis max={20} />

          <BarSeries valueField="count" argumentField="sku" />
          <EventTracker />
          <Tooltip
            targetItem={tooltipKeys.tooltipEnabled && tooltipKeys.tooltipTarget}
            onTargetItemChange={changeTooltip}
            contentComponent={TooltipContent}
          />
          <Title text="Product chart" />
          <Animation />
        </Chart>
      )}
    </Paper>
  );
};
