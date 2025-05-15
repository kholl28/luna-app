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

  // Use a numeric index for the x-axis position
  const data = [
    {
      name: format(center, "MMM dd"),
      date: center,
      x: 4, // Center position (middle of the range)
      y: 0,
      errorY: 0,
      errorX: [
        (center.getTime() - lower.getTime()) / (1000 * 60 * 60 * 24),
        (upper.getTime() - center.getTime()) / (1000 * 60 * 60 * 24)
      ]
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
            type="category"
          />
          <YAxis hide domain={[-1, 1]} type="number" />
          <Tooltip
            formatter={(value, name) => [
              name === "x" ? "Predicted date" : `${Math.round(value)} days`,
              name === "x" ? "Prediction" : name,
            ]}
            labelFormatter={(label) => "Predicted Start Date"}
          />
          <Scatter 
            name="Prediction" 
            dataKey="y"
            xAxisId={0}
            yAxisId={0}
            data={data} 
            fill="#8884d8"
          >
            <ErrorBar
              dataKey="y"
              direction="x"
              width={8}
              strokeWidth={2}
              errorX={data[0].errorX}
              stroke="lightblue"
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
