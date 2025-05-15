import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import PredictionChart from "../components/PredictionChart";
import '../app.css';
import '../globals.css';

const Prediction = ({ setCurrentPage, currentPage, result, setResult, setName, UserName }) => {
    const [predictionData, setPredictionData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    // Function to format date as "Month Day"
    const formatDate = (dateString) => {
      if (!dateString) return "loading...";
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const handleError = (error, message) => {
      console.error(message, error);
      setError(error.message || message);
      setLoading(false);
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
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ /* relevant data */ })
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
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      );
    }

    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-10 text-center">
              <div className={`fade-text ${visible ? 'visible' : ''}`}>
                <p className="verdana-xl padding-class-topper"> 
                  {UserName || "Hello"}, your next period is predicted to start on or around <b>{formatDate(predictionData?.predictionDate)}</b>. 
                </p>
              </div>
              <div className={`verdana-s-normal fade-text2 ${visible ? 'visible' : ''}`}>
                <p>
                  There is no exact science for calculating when your next period will start, and cycle length naturally fluctuates month to month for each person. <br /> 
                  So, this start date is just a well-informed estimate. The graph below shows you the range of dates your period could start in.
                </p>
              </div>
          </div>
          
          <div className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
            {predictionData ? (
              <PredictionChart {...predictionData} />
            ) : (
              <p className="text-center">Unable to load prediction chart.</p>
            )}
    
            <div className={`fade-text ${visible ? 'visible' : ''}`}>
              <p className="verdana-s padding-class-around"> 
                This plot shows the predicted date of your next period, as well as the 95% confidence interval for this prediction.
              </p> 
            </div>

            <div className={`fade-text ${visible ? 'visible' : ''}`}>
              <p className="verdana-s-normal padding-class-top-less"> 
                <b>About this tool</b>
                <br />
                <br />
                This period predictor app was created using data from a 2013 study by <a href="https://epublications.marquette.edu/cgi/viewcontent.cgi?article=1002&context=data_nfp" className="text-blue-600 hover:underline">Fehring et al.</a>
                that collected data on the menstrual cycles of 159 anonymous American women over a span of 12 months to compare the efficacy of two internet-supported natural family planning methods.<br />
                <br />
                For each woman, approximately 10 cycles were logged; for each cycle, information such as the length of the cycle and the length of menstruation is logged, 
                as well as the demographic information of the client (age, height, weight).<br /><br />

                A computer model, known as a "machine learning model" was then fed this data, looked at each of the 159 women in the dataset, and identified patterns between these variables .
                It looked at each of the 159 women in the dataset 
                and identified patterne in the lengths of their cycles.<br /><br />

                Indeed, relationships exist among the length of future cycles and the length of past cycles. For instance, the average menstrual cycle length for all women in the world is around 28 days, but this varies from 
                person to person. Some people have shorter cycles on average, whereas others have longer ones. Once you know your average cycle length, this information can be used to predict future cycle lengths.<br /><br />

                Additionally, patterns exist among age and BMI (which is calculated from height and weight) and the average length of a person's menstrual cycle. Previous research has indicated that people in different age groups
                 and BMI categories experience significant differences in cycle length.<br /><br />
                
                As people age, the lengths of their cycles tend to shorten on average, until they reach 50 years or older, wherein their cycles become longer, and are typically the longest of all. For BMI, a 
                2022 analysis found that people with higher BMIs tend to have longer menstrual cycles.<br /><br />

                Without explicitly being told this, the model is able to identify these relationships. Then, when a user (that's you!) provides the model with new, unseen data about your cycles and demographics, it is able
                to predict the date of your next period.<br /><br />
                
                
                So, if the model predicts that, based on your past three periods and your age and BMI, that your next cycle will be 28 days long, it can take the date of your most recent period, add 28 days to it,
                and then the day <em>after</em> those 28 days will be the date of your next period!<br /><br />

                It's very common for people to have cycles that vary by up to five days from one month to the next. 


        
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
