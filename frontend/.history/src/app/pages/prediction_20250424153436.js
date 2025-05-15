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
                Hello {UserName},
                </p>
            <div className={`verdana-small fade-text2 ${visible ? 'visible' : ''}`}>
                <p>
            Your next period is predicted to start on or around {result}. 
            </p>
            <div>


              </p>
        </div>
    );
};

export default Prediction;