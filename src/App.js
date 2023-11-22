import Main from "./component/guessNumber.js";
import TaiXiu from "./component/taixiu.js";
import BauCua from "./component/bauCua.js";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

function App() {
  const [budget, setBudget] = useState(10000);
  const [option, setOption] = useState(1);

  useEffect(() => {
    Cookies.set('budget', budget, { expires: 7 });
    Cookies.set('loan', 0, { expires: 7 });
  }, [budget]); // Added [budget] as a dependency

  const handleOption = (value) => () => {
    setOption(value);
  }

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <div className="game-option">
        <button
          className={`btn btn-game ${option === 1 ? 'active' : ''}`}
          onClick={handleOption(1)}
        >
          1 ăn 70
        </button><br></br>
        <button
          className={`btn btn-game ${option === 2 ? 'active' : ''}`}
          onClick={handleOption(2)}
        >
          Đoán xem
        </button>
        <button
          className={`btn btn-game ${option === 3 ? 'active' : ''}`}
          onClick={handleOption(3)}
        >
          Bầu cua
        </button>
      </div>
      {option === 1 ? <Main /> : (option === 2 ? <TaiXiu /> : <BauCua />)}
    </div>
  );
}

export default App;
