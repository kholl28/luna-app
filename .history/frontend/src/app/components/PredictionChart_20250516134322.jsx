/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';

// Simple date utilities to replace date-fns
const parseISO = (dateString) => new Date(dateString);
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Format date for display (YYYY-MM-DD)
const formatDisplayDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate array of dates between start and end
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  // Add dates to array
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Add days to date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const PredictionChart = ({ predictionDate, lowerBound, upperBound }) => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    console.log("PredictionChart received props:", { predictionDate, lowerBound, upperBound });
  }, [predictionDate, lowerBound, upperBound]);
  
  useEffect(() => {
    if (!predictionDate || !lowerBound || !upperBound) {
      console.log("Missing required date props:", { predictionDate, lowerBound, upperBound });
      return;
    }
    
    // Parse dates
    const predictedDate = parseISO(predictionDate);
    const lowerDate = parseISO(lowerBound);
    const upperDate = parseISO(upperBound);
    
    // Add extra days on both sides for visualization
    const startDate = addDays(lowerDate, -1);
    const endDate = addDays(upperDate, 1);
    
    // Get all dates in the interval
    const allDates = generateDateRange(startDate, endDate);
    setDates(allDates);
  }, [predictionDate, lowerBound, upperBound]);

  // Check if we have data yet
  if (!dates.length) {
    return <div className="p-4 text-center">Loading chart data...</div>;
  }

  const predictedDateObj = parseISO(predictionDate);
  const lowerBoundObj = parseISO(lowerBound);
  const upperBoundObj = parseISO(upperBound);
  
  // Find index positions for the dates
  const findDateIndex = (targetDate) => {
    return dates.findIndex(d => 
      d.getFullYear() === targetDate.getFullYear() && 
      d.getMonth() === targetDate.getMonth() && 
      d.getDate() === targetDate.getDate()
    );
  };
  
  const lowerIndex = findDateIndex(lowerBoundObj);
  const upperIndex = findDateIndex(upperBoundObj);
  const predictedIndex = findDateIndex(predictedDateObj);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Predicted Period Start Date with Range of Uncertainty
      </h2>
      
      <div className="relative h-64 mt-8 mb-6 border border-gray-300 rounded-lg bg-gray-50 p-4">
        {/* Confidence interval box */}
        <div 
          className="absolute h-32 bg-blue-100 top-4"
          style={{
            left: `${(lowerIndex / dates.length) * 100}%`,
            width: `${((upperIndex - lowerIndex + 1) / dates.length) * 100}%`
          }}
        ></div>
        
        {/* Predicted date line */}
        <div 
          className="absolute h-40 border-l-4 border-red-500 border-dashed top-0 z-10"
          style={{
            left: `${(predictedIndex / dates.length) * 100}%`
          }}
        ></div>
        
        {/* X-axis */}
        <div className="absolute w-full bottom-0 h-10 flex">
          {dates.map((date, index) => {
            // Only show every other date label if there are many dates
            const showLabel = dates.length <= 8 || index % (dates.length > 14 ? 2 : 1) === 0;
            
            return (
              <div 
                key={index} 
                className="flex-grow flex flex-col items-center"
              >
                <div className={`h-4 border-l ${
                  index === predictedIndex ? 'border-red-500 border-l-2' : 'border-gray-300'
                }`}></div>
                {showLabel && (
                  <div className="text-xs mt-1 transform -rotate-45 origin-top-left ml-2 text-gray-700">
                    {formatDisplayDate(date)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center items-center space-x-10 mt-12 mb-6">
        <div className="flex items-center">
          <div className="w-8 border-t-4 border-red-500 border-dashed mr-3"></div>
          <span className="text-base font-medium">Predicted Start Date</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-6 bg-blue-100 mr-3"></div>
          <span className="text-base font-medium">95% Confidence Interval</span>
        </div>
      </div>
      
      {/* Dates display */}
      <div className="mt-6 text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="font-semibold text-lg mb-2">
          Predicted date: <span className="text-red-600">{predictionDate}</span>
        </p>
        <p className="text-gray-700">
          Possible range: <span className="font-medium">{lowerBound}</span> to <span className="font-medium">{upperBound}</span>
        </p>
      </div>
    </div>
  );
};

// // Example component to demonstrate the chart with fixed dates
// const PredictionChartDemo = () => {
//   return (
//     <PredictionChart
//       predictionDate="2025-04-28"
//       lowerBound="2025-04-25"
//       upperBound="2025-05-01"
//     />
//   );
// };

export default PredictionChart;