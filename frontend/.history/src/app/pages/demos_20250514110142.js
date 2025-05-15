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
      setDemoError('Please enter a valid value for age.');
      return;
    } if (feetNum < 4 || feetNum > 7) {
      setDemoError('Please enter a valid value for feet.');
      return;
    } if (inchesNum < 0 || inchesNum > 11) {
      setDemoError('Please enter a valid value for inches.');
      return;
    } if (weightNum < 60 || weightNum > 400) {
      setDemoError('Please enter a valid value for weight.');
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div className={`verdana-xl padding-class-around fade-text ${visible ? 'visible' : ''}`}>
        Hello {UserName || "there"}!
      </div>
      <div className={`verdana-xs padding-class-aroundest fade-text ${visible ? 'visible' : ''}`}>
          First, let's start with some information about you. This will be used to make a more accurate prediction.
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

        {demoError && (
          <p className="verdana-xs" style={{
            color: '#EF5350',
            marginTop: '0.5rem',
            textAlign: 'center',
          }}>
            {demoError}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem' }}>
          <Button 
            onClick={handleSubmit} 
            className={`verdana-small ${localAge.length > 0 && localFeet.length > 0 &&
              localInches.length > 0 && localWeight.length > 0 ? '' : 'hidden-text'}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Demos;