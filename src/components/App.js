import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "../Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(curState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...curState, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...curState, status: "error" };
    case "start":
      return {
        ...curState,
        status: "active",
        secondsRemaining: curState.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = curState.questions.at(curState.index);
      return {
        ...curState,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? curState.points + question.points
            : curState.points,
      };
    case "nextQuestion":
      return { ...curState, index: curState.index + 1, answer: null };
    case "finish":
      return {
        ...curState,
        status: "finished",
        highscore:
          curState.points > curState.highscore
            ? curState.points
            : curState.highscore,
      };
    case "restart":
      // return {
      //   ...curState,
      //   index: 0,
      //   points: 0,
      //   answer: null,
      //   highscore: 0,
      //   status: "ready",
      // };
      return {
        ...initialState,
        questions: curState.questions,
        status: "ready",
        highscore: curState.highscore,
      };
    case "tick":
      return {
        ...curState,
        secondsRemaining: curState.secondsRemaining - 1,
        status: curState.secondsRemaining === 0 ? "finished" : curState.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestion = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    console.log("Hello");
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestion={numQuestion}
            dispatch={dispatch}
            answer={answer}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestion}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={numQuestion}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
