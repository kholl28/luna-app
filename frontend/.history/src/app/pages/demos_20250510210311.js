import React, { useEffect, useState } from 'react';
import '../app.css';
import '../globals.css';

import { UserName } from './homepage'

import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

function Demos({ currentPage, setCurrentPage, UserName}) {
  const [Age, setAge] = useState(''); // Initialize with empty string instead of null
  const [Feet, setFeet] = useState(''); // Initialize with empty string instead of null
  const [Inches, setInches] = useState(''); // Initialize with empty string instead of null
  const [Weight, setWeight] = useState(''); // Initialize with empty string instead of null                
  
  // fade-in text
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in when component mounts
    setVisible(true);
  }, []);

  // demographics error
  const [demoError, setDemoError] = useState('');

  // Validate all required fields before proceeding
  if (!Age || parseInt(Age) <= 0) {
    setApiError('Age must be a positive number');
    return;
  }
  
  if (!Feet || parseInt(Feet) <= 0) {
    setApiError('Height (feet) must be a positive number');
    return;
  }
  
  if (Inches === '' || parseInt(Inches) < 0 || parseInt(Inches) > 11) {
    setApiError('Height (inches) must be between 0 and 11');
    return;
  }
  
  if (!Weight || parseFloat(Weight) <= 0) {
    setApiError('Weight must be a positive number');
    return;
  }

  const handleSubmit = (event) => {
    if (Age < 14 || Age > 60) {
      setDemoError('Please enter a valid value for age.');
      return;
    }
    } if (Feet < 4 || Feet > 7) {
      setDemoError('Please enter a valid value for feet.');
      return;
    }
    } if (Inches < 0 || Inches > 11) {
      setDemoError('Please enter a valid value for inches.');
      return;
    }
    } if (Weight < 60 || Weight > 400) {
      setDemoError('Please enter a valid value for weight.');
      return;
    }
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
        id="ip0"
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
                    textAlign: 'center',
                    }}
                  >
                {demoError}
                </p>
              )}

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem' }}>
    <Button onClick={handleSubmit} className={`verdana-small ${Age.length > 0 && Feet.length > 0 &&
      Inches.length > 0 && Weight.length >0 ? '' : 'hidden-text'}`}>
        Next
        </Button>
        </div>

  </div>
</div>
  );
}

export default Demos;