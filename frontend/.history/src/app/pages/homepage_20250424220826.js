// "use client"; // This is a client component 👈🏽

import Image from "next/image";

import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';

// import Typewriter from '../components/Typewriter';

// import '../globals.css';
import '../app.css';

import { useRouter } from 'next/navigation';

function Homepage({ currentPage, setCurrentPage, UserName, setName }) {
  // const [UserName, setName] = useState('');
  const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      // Trigger fade-in when component mounts
      setVisible(true);
    }, []);

  // Log the name whenever it changes
  React.useEffect(() => {
    console.log("Name updated:", UserName);
  }, [UserName]);

  const router = useRouter();

  const handleSubmit = (event) => {
    setCurrentPage("demos");
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
        Welcome
      </p>
      <div className={`verdana-small fade-text2 ${visible ? 'visible' : ''}`}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="UserName">What is your name? &nbsp;  &nbsp;  </label>
            <input
              type="text"
              id="ip3"
              value={UserName}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        </form>
        <div style={{ position: 'fixed', display: 'flex', left: 690, justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
        {/* <div style={{ position: 'fixed', bottom: '2rem', display: 'flex', justifyContent: 'center', width: '100%' }}> */}
        {UserName.trim() !== '' && (
          <Button onClick={handleSubmit}>Next</Button>
        )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default Homepage;