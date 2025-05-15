import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import PredictionChart from "./components/PredictionChart";

import '../app.css';
import '../globals.css';
import { set } from 'date-fns';

const Prediction = ({ setCurrentPage, currentPage, setResult, result, setName, UserName, PredictionData, setPredictionData }) => {
    const [predictionData, setPredictionData] = useState(null);
    
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
            Your next period is predicted to start on or around {result}. 
                </p>
            </div>
            </div>
    );
};

export default Prediction;