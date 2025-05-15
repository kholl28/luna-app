import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

import '../app.css';
import '../globals.css';

import Button from '@mui/material/Button';
import { Backdrop } from '@mui/material';

function Input({ 
  currentPage, 
  setCurrentPage, 
  setAge, 
  Age, 
  Feet, 
  setFeet, 
  Inches, 
  setInches, 
  Weight, 
  setWeight, 
  setDate, 
  date, 
  setSecondDate, 
  secondDate, 
  setThirdDate, 
  thirdDate, 
  setDateError, 
  dateError, 
  setDate2Error, 
  date2Error,
  setResult 
}) {
  const [showSecondCalendar, setShowSecondCalendar] = useState(false);
  const [showThirdCalendar, setShowThirdCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    console.log("Date updated:", date && date.length > 0 ? date[0].toDateString() : "No date");
  }, [date]);

  useEffect(() => {
    console.log("Second date updated:", secondDate && secondDate.length > 0 ? secondDate[0].toDateString() : "No date");
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

  // Custom Loader Component
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
        </Backdrop>
        {children}
      </>
    );
  }

  // Format date to YYYY-MM-DD
  const formatDateForAPI = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleClick = async () => {
    // Validate third date
    if (thirdDate.length > 0 && secondDate.length > 0) {
      if (
        new Date(thirdDate[0]) <= new Date(secondDate[0]) ||
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
    setApiError(null);
    
    // Calculate cycle lengths accurately
    const cycle_1 = formatDistance(new Date(date[0]), new Date(secondDate[0]), { addSuffix: false });
    const cycle_2 = formatDistance(new Date(secondDate[0]), new Date(thirdDate[0]), { addSuffix: false });
    
    console.log("Cycle 1:", cycle_1);
    console.log("Cycle 2:", cycle_2);
    
    // Format third date for API
    const formattedThirdDate = formatDateForAPI(thirdDate[0]);
    console.log("Formatted third date:", formattedThirdDate);
    
    try {
      // Ensure all values are properly converted to their respective types
      const requestBody = {
        thirdDate: formattedThirdDate,
        cycle_1: cycle1Days,
        cycle_2: cycle2Days,
        Age: parseInt(Age) || 0,
        Feet: parseInt(Feet) || 0,
        Inches: parseInt(Inches) || 0,
        weight: parseFloat(Weight) || 0,
      };
      
      // Log the exact request being sent
      console.log("Sending request with body:", JSON.stringify(requestBody));
      const response = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thirdDate: formattedThirdDate,
          cycle_1: cycle_1,
          cycle_2: cycle_2,
          Age: Age,
          Feet: Feet,
          Inches: Inches,
          weight: Weight, // Make sure it's lowercase to match the backend
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Prediction result:", data);
      
      if (data && data.predictionDate) {
        setResult(data);
        setLoading(false);
        setCurrentPage("prediction");
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setApiError(error.message);
      setLoading(false);
    }
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
                  padding: '0rem',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                  height: '300px',
                }}>
                  <div style={{ height: '100px', width: '100%' }}>
                    {date.length > 0 && (
                      <p className={`verdana-small padding-class-around fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small padding-class-around fade-text ${visible ? 'visible' : ''}`}>
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
                  padding: '0rem',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                  height: '300px',
                }}>
                  <div style={{ height: '100px', width: '100%' }}>
                    {date.length > 0 && (
                      <p className={`verdana-small padding-class-around fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small padding-class-around fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small padding-class-around fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small fade-text ${visible ? 'visible' : ''}`}>
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
                      <p className={`verdana-small padding-class-around fade-text ${visible ? 'visible' : ''}`}>
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
