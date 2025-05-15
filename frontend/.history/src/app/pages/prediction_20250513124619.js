import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import PredictionChart from "../components/PredictionChart";
import PredictionExplanation from "../components/PredictionExplanation";

import '../app.css';
import '../globals.css';

const Prediction = ({ setCurrentPage, currentPage, result, setResult, setName, UserName }) => {
    const [predictionData, setPredictionData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to format date as "Month Day"
    const formatDate = (dateString) => {
      if (!dateString) return "loading...";
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });
    };

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
          
          const response = await fetch('/api/prediction', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
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
            minHeight: '100vh',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            }}>
              <div className={`verdana-xl padding-class-toppest fade-text ${visible ? 'visible' : ''}`}>
                Hello {UserName || "there"}!
              </div>
              <div className={`verdana-small padding-class fade-text2 ${visible ? 'visible' : ''}`}>
                Your next period is predicted to start on or around {formatDate(result?.predictionDate)}. 
              </div>
          <div className="max-w-xl mx-auto mt-10 padding-class-around">
          {result ? (
            <PredictionChart {...result} />
          ) : (
            <p>Unable to load prediction chart.</p>
          )}
            </div>
          <div className={`fade-text ${visible ? 'visible' : ''}`}>
            <p className={`verdana-xs padding-class`}>
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
