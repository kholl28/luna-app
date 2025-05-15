import React, { useEffect, useState } from 'react';
import '../app.css';
import '../globals.css';

import Button from '@mui/material/Button';

function Demos({ currentPage, setCurrentPage, UserName, setAge, setFeet, setInches, setWeight }) {
  const [localAge, setLocalAge] = useState('');
  const [localFeet, setLocalFeet] = useState('');
  const [localInches, setLocalInches] = useState('');
  const [localWeight, setLocalWeight] = useState('');
  
  // fade-in text
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in when component mounts
    setVisible(true);
  }, []);

  // demographics error
  const [demoError, setDemoError] = useState('');

  const handleSubmit = (event) => {
    // Convert strings to numbers
    const ageNum = Number(localAge);
    const feetNum = Number(localFeet);
    const inchesNum = Number(localInches);
    const weightNum = Number(localWeight);

    if (ageNum < 14 || ageNum > 60) {
      setDemoError('Please enter a valid value for age. Age should be between 14 and 60 years old.');
      return;
    } if (feetNum < 4 || feetNum > 7) {
      setDemoError('Please enter a valid value for feet. Feet should be between 4 and 7 feet.');
      return;
    } if (inchesNum < 0 || inchesNum > 11) {
      setDemoError('Please enter a valid value for inches. Inches should be between 0 and 11 inches.');
      return;
    } if (weightNum < 60 || weightNum > 500) {
      setDemoError('Please enter a valid value for weight. Weight should be between 60 and 500 pounds.');
      return;
    } else {
      setDemoError('');
    }

    // Pass the converted numeric values to parent component
    setAge(ageNum);
    setFeet(feetNum);
    setInches(inchesNum);
    setWeight(weightNum);
    
    // Navigate to next page
    setCurrentPage("input");
    console.log("Submitted demographic information:", { ageNum, feetNum, inchesNum, weightNum });
  };

  // Check if all fields are filled and there's no error
  const allFieldsFilled = localAge.length > 0 && localFeet.length > 0 &&
    localInches.length > 0 && localWeight.length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div className={`verdana-xl padding-class-arounder fade-text ${visible ? 'visible' : ''}`}>
        Hello {UserName || "there"}!
      </div>
      <div className={`verdana-xs padding-class-aroundest fade-text2 ${visible ? 'visible' : ''}`}>
          Now, can you tell me more about your  This will be used to make a more accurate prediction.
      </div>
      <div className={`verdana-small p.small fade-text2 ${visible ? 'visible' : ''}`}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label htmlFor="Age">What is your age? &nbsp;  &nbsp;  </label>
            <input
              type="number"
              id="ip1"
              min="14"
              max="76"
              value={localAge}
              onChange={(event) => setLocalAge(event.target.value)}
              required
            />
            &nbsp; years &nbsp; 
          </div>
          <div>
            <label htmlFor="Height">What is your height? &nbsp;  &nbsp;  </label>
            <input
              type="number"
              id="ip0"
              min="1"
              max="10"
              value={localFeet}
              onChange={(event) => setLocalFeet(event.target.value)}
              required
            />
            &nbsp; feet &nbsp; 
            <input
              type="number"
              id="ip1"
              min="0"
              max="11"
              value={localInches}
              onChange={(event) => setLocalInches(event.target.value)}
              required
            />
            &nbsp; inches &nbsp; 
          </div>
          <div>
            <label htmlFor="Weight">What is your weight? &nbsp;  &nbsp;  </label>
            <input
              type="number"
              id="ip2"
              value={localWeight}
              onChange={(event) => setLocalWeight(event.target.value)}
              required
            />
            &nbsp; pounds &nbsp; 
          </div>
        </form>

        {/* Always render the error container with fixed height */}
        <div style={{ 
          height: '1px', /* Set a fixed height that accommodates your error text */
          margin: '1.5rem 0',
          position: 'relative'
        }}>
          {demoError && (
            <p className="verdana-xs" style={{
              color: '#EF5350',
              textAlign: 'center',
              position: 'absolute',
              width: '100%',
              animation: 'fadeIn 0.5s ease-in',
              margin: 0
            }}>
              {demoError}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem' }}>
          {/* Only show button if all fields are filled AND there's no error */}
          {allFieldsFilled && !demoError && (
            <Button 
              onClick={handleSubmit} 
              className="verdana-small"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Demos;