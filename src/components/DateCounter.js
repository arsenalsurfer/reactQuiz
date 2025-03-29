import { useReducer } from "react";

function DateCounter() {
  // takes 1st arg current state and an 2nd arg action
  function reducer(curState, action) {
    console.log(curState, action);

    // if handling MULTIPLE state always use switch for the action type
    switch (action.type) {
      case "dec":
        return { ...curState, count: curState.count - curState.step };
      case "inc":
        return { ...curState, count: curState.count + curState.step };
      case "setCount":
        return { ...curState, count: action.payload };
      case "setStep":
        return { ...curState, step: action.payload };
      case "reset":
        // we could set it this as object or we can return just the initial state
        // return { count: 0, step: 1 };
        return initialState;
      default:
        throw new Error("Unknown action");
    }

    // // This is for SINGLE state only
    // // if (action.type === "inc") return curState + action.payload;
    // if (action.type === "inc") return curState + 1;
    // // if (action.type === "dec") return curState - action.payload;
    // if (action.type === "dec") return curState - 1;
    // if (action.type === "setCount") return action.payload;
  }

  // for multiple state declaration
  const initialState = { count: 0, step: 1 };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state; // destructure the pieces of state from state

  // single state only declaration
  // const [count, dispatch] = useReducer(reducer, 0); // 1st arg reducer func, 2nd arg initial state

  // This mutates the date object.
  const date = new Date("june 21 2027");

  date.setDate(date.getDate() + count);

  const dec = function () {
    // dispatch({ type: "dec", payload: 1 }); // this object is now we call actions when we work in reducer functions
    dispatch({ type: "dec" }); // we can remove the payload as it is understandble increment 1 and can be define in the formula inside the reducer function 'reducer()'

    // setCount((count) => count - 1);
    // setCount((count) => count - step);
  };

  const inc = function () {
    // dispatch({ type: "inc", payload: 1 });
    dispatch({ type: "inc" });

    // setCount((count) => count + 1);
    // setCount((count) => count + step);
  };

  const defineCount = function (e) {
    dispatch({ type: "setCount", payload: Number(e.target.value) });
    // we need the payload here because we need to pass the new value from element

    // setCount(Number(e.target.value));
  };

  const defineStep = function (e) {
    dispatch({ type: "setStep", payload: Number(e.target.value) });

    // setStep(Number(e.target.value));
  };

  const reset = function () {
    dispatch({ type: "reset" });

    // setCount(0);
    // setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
