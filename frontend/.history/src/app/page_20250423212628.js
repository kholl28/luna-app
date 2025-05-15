"use client";// App.js

// import { BrowserRouter, Routes, Route } from 'react-raouter-dom';
import Link from 'next/link';
import Homepage from './pages/homepage';
import Input from './pages/input';
import Demos from './pages/demos';
import Navbar from './Navbar';
import {useState} from 'react';

import './app.css'
import './globals.css'

function App() {
    // return (<div>
    //       <Link href="/" element={<Homepage />} />
    //       <Link href="/homepage" element={<Homepage />} />
    //       <Link href="/input" element={<Input />} />
    //   </div>);

    const [currentPage, setCurrentPage] = useState('homepage');
    const [UserName, setName] = useState('');
    const [Age, setAge] = useState('');
    const [Feet, setFeet] = useState('');
    const [Inches, setInches] = useState('');
    const [Weight, setWeight] = useState('');

    if (currentPage === 'homepage') {
        return <Homepage currentPage={currentPage} setCurrentPage={setCurrentPage} UserName={UserName} setName={setName}/>;
    } else if (currentPage === 'input') {
        return <Input currentPage={currentPage} setCurrentPage={setCurrentPage}/>;
    } else if (currentPage === 'demos') {
        // console.log("Demos page has loaded");
        return <Demos currentPage={currentPage} setCurrentPage={setCurrentPage} 
        UserName={UserName} setName={setName} 
        Age={Age} setAge={setAge}
        Feet={Feet} setFeet={setFeet}
        Inches={Inches} setInches={setInches}
        Weight={Weight} setWeight={setWeight}
        />;
    } else if (currentPage === 'prediction') {
        return <Input currentPage={currentPage} setCurrentPage={setCurrentPage}/>;
        dates_1 = {date} setdate
    }


}

// def height_converter(Feet, Inches):
//     total_inches = (Feet * 12) + Inches
//     return total_inches

// # # create BMI variable from user-inputted height & weight
// # # -------------
// height_inches = height_converter(Feet, Inches)  # Convert height to total inches
// weight_num = float(weight)  # Convert weight to a float

// bmi = round((weight_num / (height_inches ** 2) * 703), 2)

export default App;