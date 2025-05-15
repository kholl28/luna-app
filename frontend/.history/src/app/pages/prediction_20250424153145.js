import React, { useState } from 'react';

import Button from '@mui/material/Button';

import '../app.css';
import '../globals.css';
import { set } from 'date-fns';

const Prediction = ({ setCurrentPage, currentPage, setResult, result, setName, UserName }) => {
    
    const handleHome = () => {
        // Reset the result state
        setResult('');
        setName('');
        // Navigate back to the homepage
        setCurrentPage("homepage");
        console.log("Returned to homepage");
      };


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
                Your next period is predicted to start on or around 
              </p>
            />
            <br />
            <button
                onClick={handlePredict}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Predict
            </button>
            {prediction && (
                <div style={{ marginTop: '20px', color: '#333' }}>
                    <h3>Prediction Result:</h3>
                    <p>{prediction}</p>
                </div>
            )}
        </div>
    );
};

export default Prediction;