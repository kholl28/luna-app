import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import PredictionChart from "../components/PredictionChart";

import '../app.css';
import '../globals.css';

const Prediction = ({ setCurrentPage, currentPage, result, setResult, setName, UserName }) => {
    const [predictionData, setPredictionData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPrediction = async () => {
        try {
          // Check if we already have result data
          if (result && Object.keys(result).length > 0) {
            console.log("Using existing result data:", result);
            setPredictionData(result);
            setLoading(false);
            return;
          }
          
          // Otherwise make a new API call
          console.log("Making API call to fetch prediction...");
          const response = await fetch("import React, { useEffect, useState } from 'react';
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
      const response = await fetch("http://localhost:5000/predict", {
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
", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              thirdDate: "2025-04-20", // Format: YYYY-MM-DD
              cycle_1: "25 days",
              cycle_2: "28 days",
              Age: 27,
              Feet: 5,
              Inches: 10,
              weight: 133, // Changed from Weight to weight to match backend
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
          }
  
          const data = await response.json();
          console.log("Received prediction data:", data);
          
          if (data && 'predictionDate' in data && 'lowerBound' in data && 'upperBound' in data) {
            setPredictionData(data);
            setResult(data); // Save the result to parent state
          } else {
            console.error("Response missing expected fields:", data);
            setError("The response data is incomplete");
          }
        } catch (error) {
          console.error("Error fetching prediction:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPrediction();
    }, [result, setResult]);
    
    const handleHome = () => {
        // Reset the result state
        setResult('');
        setName('');
        // Navigate back to the homepage
        setCurrentPage("homepage");
        console.log("Returned to homepage");
    };

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading prediction data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
          <p className="text-red-500 text-xl mb-4">Error fetching prediction</p>
          <p>{error}</p>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleHome}
            style={{ marginTop: '1rem' }}
          >
            Return to Home
          </Button>
        </div>
      );
    }

    return (
        <div>
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100vh',
              textAlign: 'center',
            }}>
              <div className={`fade-text ${visible ? 'visible' : ''}`}>
                <p className={`verdana-xl padding-class-toppest`}> 
                  Hello {UserName || "there"},
                  </p>
              </div>
              <div className={`verdana-small fade-text2 ${visible ? 'visible' : ''}`}>
                  <p>
                  Your next period is predicted to start on or around {predictionData?.predictionDate || "loading..."}. 
                  </p>
              </div>
            </div>
          <div className="max-w-xl mx-auto mt-10">
          {predictionData ? (
            <PredictionChart {...predictionData} />
          ) : (
            <p>Unable to load prediction chart.</p>
          )}
  
          <div className={`fade-text ${visible ? 'visible' : ''}`}>
          <p className={`verdana-small padding-class`}> 

          This plot shows the predicted date of your next period, as well as the 95% confidence interval for this prediction.

          </p> 
          </div>

          <div className={`fade-text ${visible ? 'visible' : ''}`}>
            <p className={`verdana-small padding-class`}> 

            This period predictor app was trained using data from a 2013 study by <a href="https://epublications.marquette.edu/cgi/viewcontent.cgi?article=1002&context=data_nfp">Fehring et al.</a>
            that collected data on the menstrual cycles of 159 anonymous American women over a span of 12 months to compare the efficacy of two internet-supported natural family planning methods.<br />
            <br />
            For each woman, approximately 10 cycles were logged. For each cycle, information such as the length of the cycle and the length of menstruation is logged, 
            as well as the demographic information of the client (age, height, weight).<br /><br />

            A computer model, known as a "machine learning model" was then fed this data and identified patterns between these variables.<br /><br />

            For instance, the average menstrual cycle length is around 28 days, but this varies from person to person. It's very common to have cycles that vary by up to five days from one month to 
            the next. Overall, though, patterns exist among individual people in the lengths of each of their cycles.<br /><br />

            Thus, the model was able to look at each of the 159 women in the dataset and identify a pattern in the lengths of their cycles.<br /><br />

            Additionally, previous research has indicated that age and BMI (which is calculated from height and weight) have a significant relationship with the length of one's menstrual cycles.
            Specifically, women in different age groups and BMI categories experience significant differences in cycle length.<br /><br />
            
            As people age, the lengths of their cycles tend to shorten on average, until they reach 50 years or older, wherein their cycles become longer, and are typically the longest of all. For BMI, a 
            2022 analysis found that people with higher BMIs tend to have longer menstrual cycles.<br /><br />

            Without explicitly being told this, the model is able to identify these relationships. Then, when a user (that's you!) provides the model with new, unseen data about your cycles and demographics, it is able
            to predict the date of your next period.<br /><br />
            
            This is because a **menstrual cycle** is defined as **the time from the first day of a person's period to the day before the start date of the next period**.<br /><br />

            So, if the model predicts that, based on your past three periods and your age and BMI, that your next cycle will be 28 days long, it can take the date of your most recent period, add 28 days to it,
            and then the day *after* those 28 days will be the date of your next period!

             </p>
          </div>
          
          <div className="flex justify-center mt-8 mb-10">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleHome}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
};

export default Prediction;