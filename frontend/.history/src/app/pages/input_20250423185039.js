import React, { useEffect, useState } from 'react';

import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; how to keep the css from the calendar but add my own?

import '../app.css';
import '../globals.css';

import Button from '@mui/material/Button';

// predicting gif
import LoadingOverlay from 'react-loading-overlay';
// import Predicting from '/src/app/assets/predicting.gif';

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
    // Trigger fade-in when component mounts
    setVisible(true);
  }, []);

  // Log the name whenever it changes
    React.useEffect(() => {
      console.log("Date updated:", date);
    }, [date]);

    React.useEffect(() => {
      console.log("Second date updated:", secondDate.toString());
    }, [secondDate]);

  const handleSubmit = () => {
    setShowSecondCalendar(true);
    console.log("Submitted first cycle");
  }

  const handleSubmit2 = () => {
    if (secondDate.length > 0 && date.length >0) {
      if (new Date(secondDate[0]) <= new Date(date[0])) {
        setDateError('The second period must occur after the first period.');
        return; // stop here — don’t proceed to third calendar
      } else {
        setDateError(''); // clear message if dates are okay
      }
    }
    setShowSecondCalendar(false);
    setShowThirdCalendar(true);
    console.log("Submitted second cycle");
  };

  // Custom Loader Component
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
            zIndex: 1000, // Ensure it covers everything
          }),
        }}
      >
        {children}
      </LoadingOverlay>
    );
  }

  // Handle Predict button click
  const handleClick = () => {
    if (thirdDate.length > 0 && secondDate.length > 0) {
      if (
        new Date(thirdDate[0]) <= new Date(secondDate[0]) &&
        new Date(thirdDate[0]) <= new Date(date[0])
      ) {
        setDate2Error('The third period must occur after the first and second periods.');
        return; // stop here — don’t proceed to prediction
      } else {
        setDate2Error(''); // clear message if dates are okay
      }
    }
    console.log("Predict button clicked");
    setLoading(true); // Show loader  

    // DO the API call
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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
      })
      .then((data) => {
        setLoading(false); // Hide loader
        console.log("Prediction result:", data);
      // Handle the response data as needed
      })
      .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      });

    setLoading(false);

    setCurrentPage("prediction");

    // Simulate a delay (e.g., API call)
  //   setTimeout(() => {
  //     setLoading(false); // Hide loader after delay
  //     console.log("Prediction complete!");
  //     setCurrentPage("prediction"); // Navigate after delay
  //   }, 5000); // Adjust delay as needed
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        position: 'relative', // <-- important for absolute positioning
      }}
    >
<MyLoader active={loading}>
<>
{/* FIRST CALENDAR  */}
          {!showSecondCalendar && !showThirdCalendar && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '2rem',
                gap: '1.5rem', // keeps consistent spacing
              }}
            >
            {/* Instructional text */}
            <p
              className={`verdana-large text-center padding-class-less fade-text ${
                visible ? 'visible' : ''
              }`}
            >
              Please select the dates of your last three periods, beginning with the oldest.
            </p>

            {/* Calendar */}
            <Calendar
              onChange={setDate}
              value={date}
              selectRange={true}
              defaultActiveStartDate={null}
            />
  
              {/* text container */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 'calc(50% + 240px)', // 220px offset to the right of center
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px transparent #ccc',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                }}
                  >
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

                  <p className= {`verdana-small padding-class-around" ${
                    secondDate.length > 0 ? '' : 'hidden-date'
                  }`}>
                    <b>Second period:</b>
                    <br />
                    <span className="bold">Start date:</span>
                    {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                    <br />
                    <span className="bold">End date:</span>
                    {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                  </p>

                  <p className= {`verdana-small padding-class-around" ${
                    thirdDate.length > 0 ? '' : 'hidden-date'
                  }`}>
                    <b>Third period (newest):</b>
                    <br />
                    <span className="bold">Start date:</span>
                    {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                    <br />
                    <span className="bold">End date:</span>
                    {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                  </p>
                  </div>

              {/* Next Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '2rem',
                }}
              >
                {date.length > 2 && 
                  <Button onClick={handleSubmit}>Next</Button>}
              </div>          

{/* SECOND CALENDAR */}

              {showSecondCalendar && !showThirdCalendar && (
              <><div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '2rem',
                    gap: '1.5rem', // keep consistent spacing
                  }}
                >

                  <p
                    className={`verdana-large text-center padding-class-less fade-text ${visible ? 'visible' : ''}`}
                  >
                    Please select the dates of your last three periods, beginning with the oldest.
                  </p>

                  <Calendar
                    onChange={setSecondDate}
                    value={secondDate}
                    selectRange={true}
                    defaultActiveStartDate={null} />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'calc(50% + 240px)',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: '1px transparent #ccc',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    minWidth: '300px',
                  }}
                >
                    <p className={`verdana-small padding-class-around" ${date.length > 0 ? '' : 'hidden-date'}`}>
                      <b>First period (oldest):</b>
                      <br />
                      <span className="bold">Start date:</span>
                      {date.length > 0 ? date[0].toDateString() : ' '}
                      <br />
                      <span className="bold">End date:</span>
                      {date.length > 0 ? date[1].toDateString() : ' '}
                    </p>

                    <p className={`verdana-small padding-class-around" ${secondDate.length > 0 ? '' : 'hidden-date'}`}>
                      <b>Second period:</b>
                      <br />
                      <span className="bold">Start date:</span>
                      {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                      <br />
                      <span className="bold">End date:</span>
                      {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                    </p>
                  </div>


                    {/* date error code */}
                    {dateError && (
                      <p className="verdana-xs" style={{
                        color: '#EF5350',
                        marginTop: '0.5rem',
                      }}
                      >
                        {dateError}
                      </p>
                    )}
                  </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem',
                  }}
                >
                  {secondDate.length > 2 && 
                  <Button onClick={handleSubmit2}>Next</Button>}
                </div>

{/* THIRD CALENDAR */}
    {showThirdCalendar && (
      <><div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '2rem',
                        gap: '1.5rem',
                      }}
                    >
                      {/* Instructional text */}
                      <p
                        className={`verdana-large text-center padding-class-less fade-text ${visible ? 'visible' : ''}`}
                      >
                        Please select the dates of your last three periods, beginning with the oldest.
                      </p>

                      {/* calendar */}
                      <Calendar
                        onChange={setThirdDate}
                        value={thirdDate}
                        selectRange={true}
                        defaultActiveStartDate={null} />

                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 'calc(50% + 240px)',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          border: '1px transparent #ccc',
                          padding: '1rem',
                          borderRadius: '8px',
                          backgroundColor: 'transparent',
                          minWidth: '300px',
                        }}
                      >
                        <p className={`verdana-small padding-class-around" ${date.length > 0 ? '' : 'hidden-date'}`}>
                          <b>First period (oldest):</b>
                          <br />
                          <span className="bold">Start date:</span>
                          {date.length > 0 ? date[0].toDateString() : ' '}
                          <br />
                          <span className="bold">End date:</span>
                          {date.length > 0 ? date[1].toDateString() : ' '}
                        </p>

                        <p className={`verdana-small padding-class-around" ${secondDate.length > 0 ? '' : 'hidden-date'}`}>
                          <b>Second period:</b>
                          <br />
                          <span className="bold">Start date:</span>
                          {secondDate.length > 0 ? secondDate[0].toDateString() : ' '}
                          <br />
                          <span className="bold">End date:</span>
                          {secondDate.length > 0 ? secondDate[1].toDateString() : ' '}
                        </p>

                        <p className={`verdana-small padding-class-around" ${thirdDate.length > 2 ? '' : 'hidden-date'}`}>
                          <b>Third period (newest):</b>
                          <br />
                          <span className="bold">Start date:</span>
                          {thirdDate.length > 0 ? thirdDate[0].toDateString() : ' '}
                          <br />
                          <span className="bold">End date:</span>
                          {thirdDate.length > 0 ? thirdDate[1].toDateString() : ' '}
                        </p>
                      </div>

                      {/* date error code */}
                      {date2Error && (
                        <p className="verdana-xs" style={{
                          color: '#EF5350',
                          marginTop: '0.5rem',
                        }}
                        >
                          {date2Error}
                        </p>
                      )}
                    </div><div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2rem',
                      }}
                    >
                        {thirdDate.length > 2 &&
                          <Button onClick={handleClick}>Predict</Button>}
                      </div></>
            )}
              </MyLoader>
            </div>
          )}
        </div>
        </>
        </>
      </LoadingOverlay>
    );
}

export default Input;