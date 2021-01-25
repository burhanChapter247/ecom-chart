import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { withStyles } from "@material-ui/core/styles";
import { ArgumentScale, Animation } from "@devexpress/dx-react-chart";
import { curveCatmullRom, area } from "d3-shape";
import { scalePoint } from "d3-scale";
import axios from "axios";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";

const legendStyles = () => ({
  root: {
    display: "flex",
    margin: "auto",
    flexDirection: "row",
  },
});

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const Root = withStyles(legendStyles, { name: "LegendRoot" })(legendRootBase);
const legendLabelStyles = () => ({
  label: {
    whiteSpace: "nowrap",
  },
});
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const Label = withStyles(legendLabelStyles, { name: "LegendLabel" })(
  legendLabelBase
);
const useStyles = makeStyles({
  chart: {
    paddingRight: "20px",
  },
  totalAmount: {
    float: "right",
    paddingRight: "50px",
  },
});

const Area = (props) => (
  <AreaSeries.Path
    {...props}
    path={area()
      .x(({ arg }) => arg)
      .y1(({ val }) => val)
      .y0(({ startVal }) => startVal)
      .curve(curveCatmullRom)}
  />
);

export default () => {
  const classes = useStyles();
  const { isLoading, error, data: salesPerDay } = useQuery(
    "salesVariation",
    async () => {
      const { data } = await axios("/v1/order/sales-amount");
      return data;
    }
  );

  const {
    isLoading: percentloading,
    error: percentError,
    data: salesPercent,
  } = useQuery("salesPercentage", async () => {
    const { data } = await axios("/v1/order/sales-percentage");
    return data;
  });

  return (
    <Paper>
      {error && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Retrieving Sales Amount Variation Chart ...</div>
      ) : (
        <>
          <span>Increase & decrease sales amount per day</span>
          <br></br>
          {percentloading ? (
            <div>Retrieving Sales Percentage</div>
          ) : (
            <p>{parseFloat(salesPercent.data.percentage).toFixed(2)} </p>
          )}
          <br></br>
          <h3>
            {salesPerDay.data.reduce(
              (a, b) => a.totalSaleAmount + b.totalSaleAmount
            )}
          </h3>

          <Chart data={salesPerDay.data} className={classes.chart}>
            <ArgumentScale factory={scalePoint} />
            <ArgumentAxis />
            <ValueAxis />

            <AreaSeries
              name="Sales Amount"
              valueField="totalSaleAmount"
              argumentField="_id"
              seriesComponent={Area}
            />

            <Animation />
            <Legend
              position="bottom"
              rootComponent={Root}
              labelComponent={Label}
            />
            <Title text="Sales Amount Variation Chart" />
          </Chart>
        </>
      )}
    </Paper>
  );
};
