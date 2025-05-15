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

        setCurrentPage("homepage");
        console.log("Returned to homepage");
      };



    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Period Predictor</h1>
            <p>Enter your data below to get a prediction:</p>
            <input
                type="text"
                value={inputData}
                onChange={handleInputChange}
                placeholder="Enter your data"
                style={{
                    padding: '10px',
                    width: '300px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
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