import React, { useEffect, useState } from 'react';
import '../app.css';
import '../globals.css';

import { UserName } from './homepage'

import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

function Demos({ currentPage, setCurrentPage, UserName, setName, setAge, Age, Feet, setFeet, Inches, setInches, Weight, setWeight }) {
  const [visible, setVisible] = useState(false);
  const [demoError, setDemoError] = useState(''); // error for incorrect demographic inforamtion

  useEffect(() => {
    // Trigger fade-in when component mounts
    setVisible(true);
  }, []);


  const handleSubmit = (event) => {
    if (Age.length < 14 || Age.length > 55) {
      setDemoError('Please enter a valid value for age.');
      return;
    } if (Feet.length < 4 || Feet.length > 7) {
      setDemoError('Please enter a valid value for feet.');
      return;
    } if (Inches.length < 0 || Inches.length > 11) {
      setDemoError('Please enter a valid value for inches.');
      return;
    } if (Weight.length < 60 || Weight.length > 400) {
      setDemoError('Please enter a valid value for weight.');
      return;
    } else {
      setDemoError('');
    }
    setCurrentPage("input");
    console.log("Submitted demographic information")
  };


  return (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <div className={`verdana-xl padding-class fade-text ${visible ? 'visible' : ''}`}>
      Hello {UserName}!
      
    </div>
  <div style={{

  }}
    className={`verdana-small p.small fade-text2 ${visible ? 'visible' : ''}`}>
  
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
    <div>
      <label htmlFor="Age">What is your age? &nbsp;  &nbsp;  </label>
      <input
        type="number"
        id="ip1"
        min = "14"
        max = "76"
        value={Age}
        onChange={(event) => setAge(event.target.value)}
        required
      />
    &nbsp; years &nbsp; 
    </div>
    <div>
      <label htmlFor="Height">What is your height? &nbsp;  &nbsp;  </label>
      <input
        type="number"
        id="ip1"
        min = "1"
        max = "10"
        value={Feet}
        onChange={(event) => setFeet(event.target.value)}
        required
      />
      &nbsp; feet &nbsp; 
      <input
        type="number"
        id="ip1"
        min = "0"
        max = "11"
        value={Inches}
        onChange={(event) => setInches(event.target.value)}
        required
      />
      &nbsp; inches &nbsp; 
      </div>
      <div>
        <label htmlFor="Weight">What is your weight? &nbsp;  &nbsp;  </label>
        <input
          type="number"
          id="ip2"
          value={Weight}
          onChange={(event) => {setWeight(event.target.value); console.log(Weight)}}
          required
        />
        &nbsp; pounds &nbsp; 
      </div>
  </form>

            {demoError && (
                <p className="verdana-xs" style={{
                    color: '#EF5350',
                    marginTop: '0.5rem',
                    }}
                  >
                {demoError}
                </p>
              )}

  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
  {/* {Age.trim() !== '' && Feet.trim() !== '' && Inches.trim() !== '' && Weight.trim() !== '' && ( */}
    <Button onClick={handleSubmit}>Next</Button>
  {/* )} */}
  </div>
  </div>
</div>
  );
}

export default Demos;