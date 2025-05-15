import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import PredictionChart from "../components/PredictionChart";

import '../app.css';
import '../globals.css';
import { set } from 'date-fns';

const Prediction = ({ setCurrentPage, currentPage, setResult, result, setName, UserName }) => {
    const [predictionData, setPredictionData] = useState(null);

    useEffect(() => {
      const fetchPrediction = async () => {
        try {
          const response = await fetch("http://localhost:5000/predict", {
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
              weight: 133,
            }),
          });
  
          const data = await response.json();
          if (data && 'predictionDate' in data && 'lowerBound' in data && 'upperBound' in data) {
            setPredictionData(data);
          } else {
            console.error("Response missing expected fields:", data);
          }
        } catch (error) {
          console.error("Error fetching prediction:", error);
        }
      };
  
      fetchPrediction();
    }, []);
    
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

    return (
        <div>
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
                  Hello {UserName},
                  </p>
              </div>
              <div className={`verdana-small fade-text2 ${visible ? 'visible' : ''}`}>
                  <p>
                  Your next period is predicted to start on or around {predictionData ? predictionData.predictionDate : "loading..."}. 
                  </p>
              </div>
            </div>
          <div className="max-w-xl mx-auto mt-10">
          {predictionData ? (
            <PredictionChart {...predictionData} />
          ) : (
            <p>Loading prediction...</p>
          )}
          <div className={`fade-text ${visible ? 'visible' : ''}`}>
            <p className={`verdana-large padding-class`}> 
            This period predictor app was trained using data from a 2013 study by <a href="https://epublications.marquette.edu/cgi/viewcontent.cgi?article=1002&context=data_nfp">Fehring et al.</a>
            that collected data on the menstrual cycles of 159 anonymous American women over a span of 12 months to compare the efficacy of two internet-supported natural family planning methods.\n

            For each woman, approximately 10 cycles were logged. For each cycle, information such as the length of the cycle and the length of menstruation is logged, 
            as well as the demographic information of the client (age, height, weight).\n

            A computer model, known as a "machine learning model" was then fed this data and identified patterns between these variables.\n

            For instance, the average menstrual cycle length is around 28 days, but this varies from person to person. It's very common to have cycles that vary by up to five days from one month to 
            the next. Overall, though, among individual people, patterns exist in the lengths of each of their cycles.\n

            Thus, the model was able to look at each of the 159 women in the dataset and identify a pattern in the lengths of their cycles.\n\n

            Additionally, previous research has indicated that age and BMI (which is calculated from height and weight) have a significant relationship with the length of one's menstrual cycles.
            Specifically, women in different age groups and BMI categories experience significant differences in cycle length.\n
            
            As people age, the lengths of their cycles tend to shorten on average, until they reach 50 years or older, wherein their cycles become longer, and are typically the longest of all. For BMI, a 
            2022 analysis found that people with higher BMIs tend to have longer menstrual cycles.\n\n

            Without explicitly being told this, the model is able to identify these relationships. Then, when a user (that's you!) provides the model with new, unseen data about your cycles and demographics, it is able
            to predict the date of your next period.\n\n
            
            This is because a **menstrual cycle** is defined as **the time from the first day of a person's period to the day before the start date of the next period**.\n\n

            So, if the model predicts that, based on your past three periods and your age and BMI, that your next cycle will be 28 days long, it can take the date of your most recent period, add 28 days to it,
            and then 

            
            The model that was used to create this app, known as a "machine learning model", was able to identify these differences.
            
            
            Thus, the model will adjust its final prediction based on this User-inputted information.




             </p>
          </div>
        </div>
      </div>
    );
};

export default Prediction;