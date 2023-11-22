import React, { useState, useEffect } from 'react';
import "../App.css"
import Cookies from 'js-cookie';


function App() {
  const [display, setDisplay] = useState('');
  const [randomNumber, setRandomNumber] = useState(null);
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(parseInt(Cookies.get('budget')));
  const [bet, setBet] = useState('');
  const [loan, setLoan] = useState(parseInt(Cookies.get('loan')));
  const [img, setImg] = useState(false);
  const [endGame, setEndGame] = useState("");


  useEffect(() => {
    Cookies.set('budget', budget, { expires: 7 });
    if (loan >= 50000 && budget <= 0) {
      setEndGame("../img/over.jpg")
    }
  }, [budget]);

  useEffect(() => {
    Cookies.set('loan', loan, { expires: 7 });
  }, [loan]);

  const generateRandomNumbers = () => {
    setImg(false);
    return new Promise((resolve) => {
      setDisplay('Generating numbers...');
      const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 100);
        setDisplay(randomNum.toString().padStart(2, '0'));
      }, 10);

      setTimeout(() => {
        clearInterval(interval);
        const newRandomNumber = Math.floor(Math.random() * 90 + 10);
        setDisplay(newRandomNumber.toString().padStart(2, '0'));
        setRandomNumber(newRandomNumber);
        resolve(newRandomNumber);
      }, 3000);
    });
  };

  const compareResult = async () => {
    const parsedNumber = parseInt(number);
    const parsedBet = parseInt(bet);
    if (isNaN(parsedNumber) || parsedNumber < 0 || isNaN(parsedBet) || parsedBet < 0) {
      setMessage('Đặt tiền đặt số đi bạn');
      return;
    }

    setMessage('');
    setNumber('');
    setBet('');

    try {
      if (parsedBet > budget) {
        setMessage("Không đủ tiền rồi, bốc cái bát đi rồi nói chuyện tiếp");
      } else {
        const result = await generateRandomNumbers();
        console.log(result);
        if (parsedNumber === result) {
          setMessage('Gấp đôi đi bạn');
          setBudget(budget + parsedBet * 70);
        } else {
          setMessage('Non');
          setBudget(budget - parsedBet);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoanOption = (value) => () => {
    if (loan >= 50000 && budget <= 0) {
      setMessage("Trả nợ trước đi rồi nói tiếp");
    } else {
      setMessage(`Bốc cái bát ${value} thì chú cầm về ${value * 0.8}, nhớ trả không là cụt giò`);
      const valueLoan = value * 1000;
      setBudget(budget + (valueLoan * 0.8));
      setLoan(loan + value * 1000);
    }
  }

  const handlePayLoan = () => {
    console.log("ABC");
    if (budget >= loan) {
      setMessage("Oke hết nợ, chơi tiếp đi chú");
      setBudget(budget - loan);
      setLoan(0);
    } else {
      setMessage("Không đủ tiền mà đòi trả nợ, đá vô cuốn họng giờ");
      setImg(true);
    }
    console.log("ABC");
  }

  return (
    <div className="container">
      {endGame ? (
        <div>
        <h1>-1 dân chơi, +1 con nợ</h1><br></br>
        <img src={require("../img/over.jpg")} alt="Logo" />
        </div>
      ) : (
        <div className="container">
          <h1>Lucky or m đi</h1>
          <div className='head'>
            <h1>Còn lại: {budget}</h1>
            <h1>Nợ: {loan}</h1>
          </div>
          <div className="input-area">
            <input
              placeholder='Vào số'
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              maxLength="2"
              className='input-option'
            />
            <input
              placeholder='Bet bao nhiêu ?'
              value={bet}
              onChange={(event) => setBet(event.target.value)}
              className='input-option'
            />
            <button className="btn btn-taixiu" onClick={compareResult}>Lắc</button>
          </div>
          <div className="result-control">
            {display !== '' && <h2>{display}</h2>}
            {randomNumber && <h1>Kết quả: {randomNumber}</h1>}
          </div>
          <h3>{message}</h3>
          {img ? (
            <img src={require("../img/slap.jpg")} alt="Logo" />
          ) : (
            <div className='bottom-control'>
              <h2>Vòng cấp vốn</h2>
              <div className="loan-control">
                <button className="btn btn-loan" onClick={handleLoanOption(10)}>Bát 10</button>
                <button className="btn btn-loan" onClick={handleLoanOption(20)}>Bát 20</button>
                <button className="btn btn-loan" onClick={handleLoanOption(30)}>Bát 30</button>
                <button className="btn" onClick={handlePayLoan}>Trả nợ</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

  );
}

export default App;
