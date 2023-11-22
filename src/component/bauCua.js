import React, { useState, useEffect } from 'react';
import "../App.css"
import Cookies from 'js-cookie';


function App() {
  const [display, setDisplay] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(parseInt(Cookies.get('budget')));
  const [bet, setBet] = useState(1000);
  const [listBet, setListBet] = useState([])
  const [option, setOption] = useState([]);
  let checkBet = 0;
  let objTemp = {};
  let finalResult = 0;

  const generateRandomNumbers = () => {
    checkBet=0;
    objTemp = {};
    finalResult = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const randomNum1 = Math.floor(Math.random() * 6) + 1;
        const randomNum2 = Math.floor(Math.random() * 6) + 1;
        const randomNum3 = Math.floor(Math.random() * 6) + 1;

        setDisplay(`${randomNum1} ${randomNum2} ${randomNum3}`);
      }, 10);

      setTimeout(() => {
        clearInterval(interval);
        const newRandomNumber1 = Math.floor(Math.random() * 6) + 1;
        const newRandomNumber2 = Math.floor(Math.random() * 6) + 1;
        const newRandomNumber3 = Math.floor(Math.random() * 6) + 1;

        const sum = calculatorResult([newRandomNumber1, newRandomNumber2, newRandomNumber3]);

        // delete to calculator
        objTemp = option.filter((opt) => opt !== newRandomNumber1).filter((opt) => opt !== newRandomNumber2).filter((opt) => opt !== newRandomNumber3);

        setDisplay(`${convertValue(newRandomNumber1)} ${convertValue(newRandomNumber2)} ${convertValue(newRandomNumber3)}`);
        resolve(sum);
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

    try {
      const result = await generateRandomNumbers();
      console.log("chỗ tính tiền : ",result);
      const newBudget = budget + result;
      setBudget(newBudget);
      Cookies.set('budget', newBudget, { expires: 7 });
    } catch (error) {
      console.error(error);
    }
  };

  // Setup bầu cua
  const handleOption = (value) => () => {
    const updatedBet = bet + listBet.reduce((acc, curr) => acc + curr, 0);
    console.log("check bet: ",updatedBet);
    if (updatedBet <= budget){
      if (!option.includes(value)) {
        setOption((prevOption) => [...prevOption, value]);
        setListBet((prevListBet) => [...prevListBet, bet]);
      } else {
        setOption((prevOption) => prevOption.filter((opt) => opt !== value));
        setListBet((prevListBet) => prevListBet.filter((prevBet, index) => option[index] !== value));
      }
      setMessage('');

    } else {
      setMessage('Không đủ tiền thì khỏi chơi');
    }
    console.log("Tổng bet: ", sumBet(listBet));
  };

  function sumBet(listBet){
    let totalSum = 0;
    Object.keys(listBet).forEach((key) => {
      totalSum += listBet[key];
    });
    return totalSum;
  }

  const handleBet = (value) => () => {
    setBet(value);
  };

  // Delete choosen
  function calculatorResult(obj) {
    const resultList = { ...obj };
    let sum = 0;

    Object.keys(option).forEach((key) => {
      console.log("Vòng đầu: ", option[key]);
      let check = false;
      Object.keys(resultList).forEach((key1) => {
        console.log(resultList[key1]);
        if (resultList[key1] === option[key]) {
          check = true;
          console.log("Có trùng này, cộng ", listBet[key]);
          sum += listBet[key];
          delete resultList[key1];
          return; // Sử dụng return để thoát khỏi vòng lặp inner khi đã tìm thấy giá trị
        }
      });
      if (check === false) {
        console.log("Không trùng cái nào cả, trừ ", listBet[key]);
        sum -= listBet[key];
      }
    });

    console.log("Kết quả cuối được ", sum);
    return sum;
  }

  return (
    <div className="container">
      <div className="container">
        <div className='head'>
          <h1>Còn lại: {budget}</h1>
        </div>
        <br></br>
        <div className="result-control">
          {display !== '' && <h2>{display}</h2>}
          {randomNumber && <h1>Kết quả: {randomNumber}</h1>}
        </div>
        <h3>{message}</h3><br></br>
        {/* <h3>Option: [{option}]</h3> */}
        <h3>Tổng Bet: [{sumBet(listBet)}]</h3><br></br>

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
        <div style={{marginTop:"10px"}} className="input-area">
          <button
            className={`btn btn-taixiu ${bet === 1000 ? 'active' : ''}`}
            onClick={handleBet(1000)}
          >
            1K
          </button>
          <button
            className={`btn btn-taixiu ${bet === 2000 ? 'active' : ''}`}
            onClick={handleBet(2000)}
          >
            2K
          </button>
          <button
            className={`btn btn-taixiu ${bet === 5000 ? 'active' : ''}`}
            onClick={handleBet(5000)}
          >
            5K
          </button>
          <button
            className={`btn btn-taixiu ${bet === 10000 ? 'active' : ''}`}
            onClick={handleBet(10000)}
          >
            10K
          </button>
          <button
            className={`btn btn-taixiu ${bet === 20000 ? 'active' : ''}`}
            onClick={handleBet(20000)}
          >
            20K
          </button>
          <button
            className={`btn btn-taixiu ${bet === 50000 ? 'active' : ''}`}
            onClick={handleBet(50000)}
          >
            50K
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;
