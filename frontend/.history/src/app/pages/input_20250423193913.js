import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import '../app.css';
import '../globals.css';

import Button from '@mui/material/Button';
import LoadingOverlay from 'react-loading-overlay';

function Input({ setCurrentPage }) {
  const [date, setDate] = useState([]);
  const [secondDate, setSecondDate] = useState([]);
  const [thirdDate, setThirdDate] = useState([]);
  const [dateError, setDateError] = useState(''); // error for first and second date
  const [date2Error, setDate2Error] = useState(''); // error for second and third date
  const [showSecondCalendar, setShowSecondCalendar] = useState(false);
  const [showThirdCalendar, setShowThirdCalendar] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    console.log("Date updated:", date);
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
      <LoadingOverlay
        active={active}
        spinner={<img src='/predicting.gif' />}
        styles={{
          overlay: (base) => ({
            ...base,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }),
        }}
      >
        {children}
      </LoadingOverlay>
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

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "dates_1": "03/02 03/09",
        "dates_2": "03/02 03/09",
        "dates_3": "03/02 03/09",
        "age": 4,
        "Feet": 4,
        "Inches": 4,
        "weight": 4
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        console.log("Prediction result:", data);
        setCurrentPage("prediction");
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };

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
                }}>
                  {date.length > 0 && (
                    <p className= {`verdana-small padding-class-around" ${
                      date.length > 0 ? '' : 'hidden-date'
                    }`}>
                      <b>First period (oldest):</b>
                      <br />
                      <span className="bold">Start date:</span>
                      {date.length > 0 ? date[0].toDateString() : ' '}
                      <br />
                      <span className="bold">End date:</span>
                      {date.length > 0 ? date[1].toDateString() : ' '}
                    </p>
                  )}
                  {secondDate.length > 0 && (
                  <p className={`verdana-small padding-class-around" ${secondDate.length > 0 ? '' : 'hidden-date'}`}>
                  <b>Second period:</b>
                  <br />
                  <span className="bold">Start date:</span>
                  {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                  <br />
                  <span className="bold">End date:</span>
                  {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                </p>
                  )}
                {thirdDate.length > 0 && (
                  <p className={`verdana-small padding-class-around" ${thirdDate.length > 2 ? '' : 'hidden-date'}`}>
                    <b>Third period (newest):</b>
                    <br />
                    <span className="bold">Start date:</span>
                    {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                    <br />
                    <span className="bold">End date:</span>
                    {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                </p>
                   )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  {date.length > 1 && <Button onClick={handleSubmit}>Next</Button>}
                </div>
              </div>
            )}

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
                }}>
                  {date.length > 0 && (
                    <p className= {`verdana-small padding-class-around" ${
                      date.length > 0 ? '' : 'hidden-date'
                    }`}>
                      <b>First period (oldest):</b>
                      <br />
                      <span className="bold">Start date:</span>
                      {date.length > 0 ? date[0].toDateString() : ' '}
                      <br />
                      <span className="bold">End date:</span>
                      {date.length > 0 ? date[1].toDateString() : ' '}
                    </p>
                  )}
                  {secondDate.length > 0 && (
                  <p className={`verdana-small padding-class-around" ${secondDate.length > 0 ? '' : 'hidden-date'}`}>
                  <b>Second period:</b>
                  <br />
                  <span className="bold">Start date:</span>
                  {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                  <br />
                  <span className="bold">End date:</span>
                  {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                </p>
                  )}
                {thirdDate.length > 0 && (
                  <p className={`verdana-small padding-class-around" ${thirdDate.length > 2 ? '' : 'hidden-date'}`}>
                    <b>Third period (newest):</b>
                    <br />
                    <span className="bold">Start date:</span>
                    {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                    <br />
                    <span className="bold">End date:</span>
                    {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                </p>
                   )}
                </div>
                  {dateError && <p style={{ color: '#EF5350' }}>{dateError}</p>}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    {secondDate.length > 1 && <Button onClick={handleSubmit2}>Next</Button>}
                  </div>
                </div>
              </>
            )}

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
                }}>
                  {date.length > 0 && (
                    <p className= {`verdana-small padding-class-around  ${
                      date.length > 0 ? '' : 'hidden-date'
                    }`}>
                      <b>First period (oldest):</b>
                      <br />
                      <span className="bold">Start date:</span>
                      {date.length > 0 ? date[0].toDateString() : ' '}
                      <br />
                      <span className="bold">End date:</span>
                      {date.length > 0 ? date[1].toDateString() : ' '}
                    </p>
                  )}
                  {secondDate.length > 0 && (
                  <p className={`verdana-small padding-class-around" ${secondDate.length > 0 ? '' : 'hidden-date'}`}>
                  <b>Second period:</b>
                  <br />
                  <span className="bold">Start date:</span>
                  {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                  <br />
                  <span className="bold">End date:</span>
                  {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                </p>
                  )}
                {thirdDate.length > 0 && (
                <p className={`verdana-small padding-class-around" ${thirdDate.length > 2 ? '' : 'hidden-date'}`}>
                          <b>Third period (newest):</b>
                          <br />
                          <span className="bold">Start date:</span>
                          {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                          <br />
                          <span className="bold">End date:</span>
                          {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                </p>
                   )}
                </div>
                  {date2Error && <p style={{ color: '#EF5350' }}>{date2Error}</p>}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    {thirdDate.length > 1 && <Button onClick={handleClick}>Predict</Button>}
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
