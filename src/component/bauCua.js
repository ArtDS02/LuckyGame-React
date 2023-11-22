import React, { useState, useEffect } from 'react';
import "../App.css"
import Cookies from 'js-cookie';


function App() {
  const [display, setDisplay] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(parseInt(Cookies.get('budget')));
  const [bet, setBet] = useState('');
  const [option, setOption] = useState([]);
  let objTemp = {};

  const generateRandomNumbers = () => {
    objTemp = {};
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const randomNum1 = Math.floor(Math.random() * 6) + 1;
        const randomNum2 = Math.floor(Math.random() * 6) + 1;
        const randomNum3 = Math.floor(Math.random() * 6) + 1;

        setDisplay(`${randomNum1} ${randomNum2} ${randomNum3}`);
      }, 10);

      let count = 0;

      setTimeout(() => {
        clearInterval(interval);
        const newRandomNumber1 = Math.floor(Math.random() * 6) + 1;
        const newRandomNumber2 = Math.floor(Math.random() * 6) + 1;
        const newRandomNumber3 = Math.floor(Math.random() * 6) + 1;

        if (Object.values(option).includes(newRandomNumber1) === true) count += 1;
        if (Object.values(option).includes(newRandomNumber2) === true) count += 1;
        if (Object.values(option).includes(newRandomNumber3) === true) count += 1;

        // delete to calculator
        objTemp = option.filter((opt) => opt !== newRandomNumber1).filter((opt) => opt !== newRandomNumber2).filter((opt) => opt !== newRandomNumber3);


        setDisplay(`${convertValue(newRandomNumber1)} ${convertValue(newRandomNumber2)} ${convertValue(newRandomNumber3)}`);
        resolve(count);
      }, 3000);
    });
  };

  const convertValue = (value) => {
    switch (value) {
      case 1:
        return 'Nai';
      case 2:
        return 'Bầu';
      case 3:
        return 'Gà';
      case 4:
        return 'Cá';
      case 5:
        return 'Cua';
      case 6:
        return 'Tôm';
    }
  }

  const compareResult = async () => {
    if (budget < 1000) {
      setMessage('Không đủ tiền thì khỏi chơi');
      return;
    }

    setMessage('');
    setBet('');

    try {
      const result = await generateRandomNumbers();
      setMessage("ăn được " + result + " thua " + objTemp.length);
      console.log("result: ",result);
      console.log("objTemp: ",objTemp);
      // Calculate the updated budget and update it using the state updater function
      setBudget((prevBudget) => prevBudget + result * 1000 - objTemp.length * 1000);
      Cookies.set('budget', budget + result * 1000 - objTemp.length * 1000, { expires: 7 });
    } catch (error) {
      console.error(error);
    }
  };

  // Setup bầu cua
  const handleOption = (value) => () => {
    setOption((prevOption) => {
      if (!prevOption.includes(value)) {
        return [...prevOption, value]; // Add value if it's not already present
      } else {
        return prevOption.filter((opt) => opt !== value); // Remove value if it exists
      }
    });
    checkContain(value);
  };

  const checkContain = (value) => {
    console.log("option: ", option.length);
    console.log("option: ", option);
    console.log("option: ", Object.values(option).includes(value));
  }

  // Delete choosen
  function removeKeyByValue(obj, value) {
    const updatedObj = { ...obj };
    Object.keys(updatedObj).forEach((key) => {
      if (updatedObj[key] === value) {
        delete updatedObj[key];
      }
    });
    setOption(updatedObj);
  }

  return (
    <div className="container">
      <div className="container">
        <h1>Bầu cua</h1>
        <div className='head'>
          <h1>Còn lại: {budget}</h1>
          <h1>Mặc định: 1000 </h1>
        </div>
        <br></br>
        <div className="result-control">
          {display !== '' && <h2>{display}</h2>}
          {randomNumber && <h1>Kết quả: {randomNumber}</h1>}
        </div>
        <h3>{message}</h3><br></br>
        {/* <h3>Option: [{option}]</h3><br></br> */}
        <div className="input-area">
          <button
            className={`btn btn-taixiu ${Object.values(option).includes(1) === true ? 'active' : ''}`}
            onClick={handleOption(1)}
          >
            <img src={require("../img/deer.png")} alt="Logo" />
          </button>
          <button
            className={`btn btn-taixiu ${Object.values(option).includes(2) === true ? 'active' : ''}`}
            onClick={handleOption(2)}
          >
            <img src={require("../img/calabash.png")} alt="Logo" />
          </button>
          <button
            className={`btn btn-taixiu ${Object.values(option).includes(3) === true ? 'active' : ''}`}
            onClick={handleOption(3)}
          >
            <img src={require("../img/chicken.png")} alt="Logo" />
          </button>
          <button
            className={`btn btn-taixiu ${Object.values(option).includes(4) === true ? 'active' : ''}`}
            onClick={handleOption(4)}
          >
            <img src={require("../img/fish.png")} alt="Logo" />
          </button>
          <button
            className={`btn btn-taixiu ${Object.values(option).includes(5) === true ? 'active' : ''}`}
            onClick={handleOption(5)}
          >
            <img src={require("../img/crab.png")} alt="Logo" />
          </button>
          <button
            className={`btn btn-taixiu ${Object.values(option).includes(6) === true ? 'active' : ''}`}
            onClick={handleOption(6)}
          >
            <img src={require("../img/shrimp.png")} alt="Logo" />
          </button>
        </div><br></br>
        <button className="btn btn-taixiu" onClick={compareResult}>Lắc</button>
      </div>
    </div>
  );
}

export default App;
