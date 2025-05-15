import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  Line,
} from "recharts";
import { format, parseISO, eachDayOfInterval, addDays, subDays } from "date-fns";

const PredictionChart = ({ predictionDate, lowerBound, upperBound }) => {
  // Parse the dates
  const centerDate = parseISO(predictionDate);
  const lowerDate = parseISO(lowerBound);
  const upperDate = parseISO(upperBound);

  // Create an array of dates for the x-axis
  // Include 2 days before lower bound and 2 days after upper bound for better visualization
  const startDate = subDays(lowerDate, 2);
  const endDate = addDays(upperDate, 2);
  
  // Generate all dates in the interval for display
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  // Create the data for the chart
  const data = dateRange.map(date => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const displayDate = format(date, "MMM dd");
    
    // Default values
    const dataPoint = {
      date: formattedDate,
      displayDate,
      // No confidence interval by default
      confidenceValue: null
    };
    
    // Add confidence interval data for dates within the confidence interval
    if (date >= lowerDate && date <= upperDate) {
      dataPoint.confidenceValue = 1; // Value to show in the confidence interval
    }
    
    // Mark the prediction date
    if (format(date, "yyyy-MM-dd") === format(centerDate, "yyyy-MM-dd")) {
      dataPoint.prediction = 1;
    }
    
    return dataPoint;
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-2">Predicted Period Start Date</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <XAxis 
            dataKey="displayDate" 
            type="category"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            height={60}
            tickMargin={15}
          />
          <YAxis hide domain={[0, 1.5]} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === "confidenceValue") return ["Confidence Interval"];
              if (name === "prediction") return ["Predicted Start Date"];
              return [value, name];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          
          {/* Confidence interval as a shaded area */}
          <Area 
            type="monotone"
            dataKey="confidenceValue"
            fill="#e3f2fd"
            stroke="#90caf9"
            name="95% Confidence Interval"
            dot={false}
            isAnimationActive={false}
          />
          
          {/* Reference line for the predicted date */}
          <ReferenceLine 
            x={format(centerDate, "MMM dd")}
            stroke="#f44336"
            strokeDasharray="3 3"
            label={{ 
              value: "Predicted Start Date", 
              position: "top",
              fill: "#f44336",
              fontSize: 12
            }}
          />
          
          {/* Line to highlight the prediction date */}
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#f44336"
            strokeWidth={2}
            dot={{ fill: "#f44336", r: 6 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-center mt-2 text-sm text-gray-600">
        Predicted date: {format(centerDate, "MMMM dd, yyyy")}
        <br />
        Range of uncertainty: {format(lowerDate, "MMM dd")} - {format(upperDate, "MMM dd")}
      </div>
    </div>
  );
};

export default PredictionChart;