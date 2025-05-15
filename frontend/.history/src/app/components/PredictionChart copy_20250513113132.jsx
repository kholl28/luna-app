import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ErrorBar,
  Scatter,
} from "recharts";
import { format, parseISO, addDays, subDays } from "date-fns";

const PredictionChart = ({ predictionDate, lowerBound, upperBound }) => {
  const center = parseISO(predictionDate);
  const lower = parseISO(lowerBound);
  const upper = parseISO(upperBound);

  const data = [
    {
      name: format(center, "MMM dd"),
      date: center,
      value: 0,
      errorLow: (center - lower) / (1000 * 60 * 60 * 24),
      errorHigh: (upper - center) / (1000 * 60 * 60 * 24),
    },
  ];

  const dateRange = Array.from({ length: 9 }, (_, i) => {
    const d = subDays(lower, 2);
    return format(addDays(d, i), "MMM dd");
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-2">Cycle 3 Prediction</h2>
      <ResponsiveContainer width="100%" height={150}>
        <ComposedChart data={data}>
          <XAxis
            dataKey="name"
            ticks={dateRange}
            interval={0}
            angle={-35}
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis hide domain={[-1, 1]} />
          <Tooltip
            formatter={(value, name) => [
              `${Math.round(value)} days`,
              name === "value" ? "Prediction" : name,
            ]}
            labelFormatter={() => "Predicted Start Date"}
          />
          <Scatter name="Prediction" data={data} fill="#8884d8">
            <ErrorBar
              dataKey="value"
              width={8}
              strokeWidth={2}
              direction="x"
              data={data.map((d) => ({
                x: d.errorLow,
                xError: d.errorHigh,
              }))}
              stroke="lightblue"
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
