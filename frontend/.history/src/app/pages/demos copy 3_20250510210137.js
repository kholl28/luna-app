 
 
 
 
 // Demographics form component
 const DemographicsForm = () => (
  <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
    <Typography variant="h6" sx={{ mb: 3 }}>
      Please enter your demographic information
    </Typography>
    
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={Age || ''}
          onChange={(e) => setAge(e.target.value)}
          error={formErrors.age}
          helperText={formErrors.age ? "Please enter a valid age" : ""}
          InputProps={{ inputProps: { min: 10, max: 100 } }}
        />
      </Grid>
      
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Feet"
          type="number"
          value={Feet || ''}
          onChange={(e) => setFeet(e.target.value)}
          error={formErrors.feet}
          helperText={formErrors.feet ? "Required" : ""}
          InputProps={{ inputProps: { min: 3, max: 8 } }}
        />
      </Grid>
      
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Inches"
          type="number"
          value={Inches || ''}
          onChange={(e) => setInches(e.target.value)}
          error={formErrors.inches}
          helperText={formErrors.inches ? "Required" : ""}
          InputProps={{ inputProps: { min: 0, max: 11 } }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Weight (lbs)"
          type="number"
          value={Weight || ''}
          onChange={(e) => setWeight(e.target.value)}
          error={formErrors.weight}
          helperText={formErrors.weight ? "Please enter a valid weight" : ""}
          InputProps={{ inputProps: { min: 70, max: 500 } }}
        />
      </Grid>
    </Grid>
    
    {apiError && (
      <Typography color="error" sx={{ mt: 2 }}>
        {apiError}
      </Typography>
    )}
    
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Button 
        variant="contained"
        onClick={handlePrediction}
        disabled={!Age || !Feet || !Inches || !Weight}
      >
        Generate Prediction
      </Button>
    </Box>
  </Box>
);