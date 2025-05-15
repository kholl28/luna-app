import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import PredictionChart from "../components/PredictionChart";

import '../app.css';
import '../globals.css';
import { set } from 'date-fns';

const Prediction = ({ setCurrentPage, currentPage, setResult, result, setName, UserName }) => {
    const [predictionData, setPredictionData] = useState(null);

    useEffect(() => {
      const fetchPrediction = async () => {
        try {
          const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              thirdDate: "2025-04-20", // Format: YYYY-MM-DD
              cycle_1: "25 days",
              cycle_2: "28 days",
              Age: 27,
              Feet: 5,
              Inches: 10,
              weight: 133,
            }),
          });
  
          const data = await response.json();
          if (data && 'predictionDate' in data && 'lowerBound' in data && 'upperBound' in data) {
            setPredictionData(data);
          } else {
            console.error("Response missing expected fields:", data);
          }
        } catch (error) {
          console.error("Error fetching prediction:", error);
        }
      };
  
      fetchPrediction();
    }, []);
    
    const handleHome = () => {
        // Reset the result state
        setResult('');
        setName('');
        // Navigate back to the homepage
        setCurrentPage("homepage");
        console.log("Returned to homepage");
      };

      const [visible, setVisible] = useState(false);

      useEffect(() => {
          setVisible(true);
        }, []);

    return (
        <div>
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              textAlign: 'center',
            }}>
              <div className={`fade-text ${visible ? 'visible' : ''}`}>
                <p className={`verdana-xl padding-class`}> 
                  Hello {UserName},
                  </p>
              </div>
              <div className={`verdana-small fade-text2 ${visible ? 'visible' : ''}`}>
                  <p>
                  Your next period is predicted to start on or around {predictionData ? predictionData.predictionDate : "loading..."}. 
                  </p>
              </div>
            </div>
          <div className="max-w-xl mx-auto mt-10">
          {predictionData ? (
            <PredictionChart {...predictionData} />
          ) : (
            <p>Loading prediction...</p>
          )}
          <div className={`fade-text ${visible ? 'visible' : ''}`}>
            <p className={`verdana-large padding-class`}> 
            This period predictor app was trained using data from a 2013 study by <a href="https://epublications.marquette.edu/cgi/viewcontent.cgi?article=1002&context=data_nfp">Fehring et al.</a>
            that collected data on the menstrual cycles from a sample of 159 anonymous American women to compare the efficacy of two internet-supported natural family planning methods.
             </p>
          </div>
        </div>
      </div>
    );
};

export default Prediction;