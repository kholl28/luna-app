import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import '../app.css';
import '../globals.css';

import Button from '@mui/material/Button';

// predicting gif
// import LoadingOverlay from 'react-loading-overlay';
// import Predicting from '/predicting.gif';
import { Backdrop } from '@mui/material';

function Input({ currentPage, setCurrentPage, setAge, Age, Feet, setFeet, Inches, setInches, Weight, setWeight, 
  setDate, date, setSecondDate, secondDate, setThirdDate, thirdDate, setDateError, dateError, 
  setDate2Error, date2Error
}) {
  const [showSecondCalendar, setShowSecondCalendar] = useState(false);
  const [showThirdCalendar, setShowThirdCalendar] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    console.log("Date updated:", date.toString());
  }, [date]);

  useEffect(() => {
    console.log("Second date updated:", secondDate.toString());
  }, [secondDate]);

  const handleSubmit = () => {
    setShowSecondCalendar(true);
    console.log("Submitted first cycle");
  };

  const handleSubmit2 = () => {
    if (secondDate.length > 0 && date.length > 0) {
      if (new Date(secondDate[0]) <= new Date(date[0])) {
        setDateError('The second period must occur after the first period.');
        return;
      } else {
        setDateError('');
      }
    }
    setShowSecondCalendar(false);
    setShowThirdCalendar(true);
    console.log("Submitted second cycle");
  };

  function MyLoader({ active, children }) {
    return (
      <>
      <Backdrop
        open={active}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img
          src="/predicting.gif"
          style={{ width: '150px', height: '150px' }}
        />
        {/* <p className="verdana-small" style={{ marginTop: '1rem' }}>Predicting...</p> */}
      </Backdrop>
      {children}
    </>
  );
}


  const handleClick = () => {
    if (thirdDate.length > 0 && secondDate.length > 0) {
      if (
        new Date(thirdDate[0]) <= new Date(secondDate[0]) &&
        new Date(thirdDate[0]) <= new Date(date[0])
      ) {
        setDate2Error('The third period must occur after the first and second periods.');
        return;
      } else {
        setDate2Error('');
      }
    }

    console.log("Predict button clicked");
    setLoading(true);
    const cycle_1 = formatDistance(date[0], secondDate[0], { addSuffix: false });
    const cycle_2 = formatDistance(secondDate[0], thirdDate[0], { addSuffix: false });

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "date": date,
        "secondDate": secondDate,
        "thirdDate": thirdDate,
        "Age": Age,
        "Feet": Feet,
        "Inches": Inches,
        "Weight": Weight,
        "cycle_1": cycle_1,
        "cycle_2": cycle_2
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log("Prediction result:", data);
        setResult(data);
        setLoading(false);
        setCurrentPage("prediction");
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });

    // Simulate a delay (e.g., API call)
    setTimeout(() => {
      setLoading(false); // Hide loader after delay
      console.log("Prediction complete!");
      setCurrentPage("prediction"); // Navigate after delay
    }, 5000); // Adjust delay as needed
  };

// FIRST CALENDAR

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      position: 'relative',
    }}>
      <MyLoader active={loading}>
        <>
          <div className="app">
            {!showSecondCalendar && !showThirdCalendar && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '2rem',
                gap: '1.5rem',
              }}>
                <p className={`verdana-large text-center padding-class-less fade-text ${visible ? 'visible' : ''}`}>
                  Please select the dates of your last three periods, beginning with the oldest.
                </p>
                <Calendar
                  onChange={setDate}
                  value={date}
                  selectRange={true}
                  maxDate={new Date()}
                  
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 'calc(50% + 240px)',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                  height: '300px',
                }}>
                  <div style={{ height: '100px', width: '100%' }}>
                    {date.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <b>First period (oldest):</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {date.length > 0 ? date[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {date.length > 0 ? date[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                  <div style={{ height: '100px', width: '100%' }}>
                    {secondDate.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <br />
                        <b>Second period:</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                  <div style={{ height: '100px', width: '100%' }}>
                    {thirdDate.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <br />
                        <b>Third period (newest):</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Button onClick={handleSubmit} className={`verdana-small ${date.length > 1 ? '' : 'hidden-text'}`}>
                  Next
                </Button>
                </div>
              </div>
            )}

{/* SECOND CALENDAR */}

            {showSecondCalendar && !showThirdCalendar && (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '2rem',
                  gap: '1.5rem',
                }}>
                  <p className={`verdana-large text-center padding-class-less fade-text ${visible ? 'visible' : ''}`}>
                  Please select the dates of your last three periods, beginning with the oldest.
                  </p>
                  <Calendar
                    onChange={setSecondDate}
                    value={secondDate}
                    selectRange={true}
                    maxDate={new Date()}
                  />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 'calc(50% + 240px)',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                  height: '300px',
                }}>
                  <div style={{ height: '100px', width: '100%' }}>
                    {date.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <b>First period (oldest):</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {date.length > 0 ? date[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {date.length > 0 ? date[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                  <div style={{ height: '100px', width: '100%' }}>
                    {secondDate.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <br />
                        <b>Second period:</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                  <div style={{ height: '100px', width: '100%' }}>
                    {thirdDate.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <br />
                        <b>Third period (newest):</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                </div>

                {dateError && (
                      <p className="verdana-xs" style={{
                        color: '#EF5350',
                        marginTop: '0.5rem',
                      }}
                      >
                      {dateError}
                      </p>
                    )}

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Button onClick={handleSubmit2} className={`verdana-small ${secondDate.length > 1 ? '' : 'hidden-text'}`}>
                  Next
                </Button>
                </div>
                </div>
              </>
            )}

{/* THIRD CALENDAR */}

            {showThirdCalendar && (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '2rem',
                  gap: '1.5rem',
                }}>
                  <p className={`verdana-large text-center padding-class-less fade-text ${visible ? 'visible' : ''}`}>
                  Please select the dates of your last three periods, beginning with the oldest.
                  </p>
                  <Calendar
                    onChange={setThirdDate}
                    value={thirdDate}
                    selectRange={true}
                    maxDate={new Date()}
                  />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 'calc(50% + 240px)',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0rem',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                  height: '300px',
                }}>
                  <div style={{ height: '100px', width: '100%' }}>
                    {date.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <b>First period (oldest):</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {date.length > 0 ? date[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {date.length > 0 ? date[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                  <div style={{ height: '100px', width: '100%' }}>
                    {secondDate.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <br />
                        <b>Second period:</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                  <div style={{ height: '100px', width: '100%' }}>
                    {thirdDate.length > 0 && (
                      <p className="verdana-small padding-class-around">
                        <br />
                        <b>Third period (newest):</b>
                        <br />
                        <span className="bold">Start date: </span>
                        {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                        <br />
                        <span className="bold">End date: </span>
                        {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                      </p>
                    )}
                  </div>
                </div>

                 {date2Error && (
                      <p className="verdana-xs" style={{
                        color: '#EF5350',
                        marginTop: '0.5rem',
                      }}
                      >
                      {date2Error}
                      </p>
                    )}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                  <Button onClick={handleClick} className={`verdana-small ${thirdDate.length > 1 ? '' : 'hidden-text'}`}>
                    Predict
                  </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      </MyLoader>
    </div>
  );
}

export default Input;
