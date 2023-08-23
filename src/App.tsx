import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { decode } from "html-entities";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface Questions {
  category: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: any;
}

interface Correct {
  correct: number;
}

interface Total {
  total: number;
}

const defaultState = {
  category: "",
  difficulty: "",
  question: "",
  correct_answer: "",
  incorrect_answers: [],
};

interface Props {
  questions: Questions;
}

export const TriviaQuestion = ({ questions }: Props) => {
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const decodedQuestion = decode(questions.question);

  const newArr: string[] = [
    ...questions.incorrect_answers,
    questions.correct_answer,
  ];
  // console.log(newArr);
  const shuffle = (arr: string[]) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const shuffledArr = shuffle(newArr);
  // console.log(shuffledArr);

  const mappedAnswers = shuffledArr.map((answer) => {
    const decodedAnswer: string = decode(answer);

    const answeredCorrectly = () => {
      setCorrect(correct + 1);
      setTotal(total + 1);
    };

    const answeredIncorrectly = () => {
      setTotal(total + 1);
    };

    const clickHandler = () => {
      // console.log(decodedAnswer);
      if (decodedAnswer === questions.correct_answer) {
        answeredCorrectly();
      } else {
        answeredIncorrectly();
      }
    };
    console.log("ANSWERED CORRECT: " + correct + " TOTAL: " + total);

    return (
      <Button key={uuidv4()} onClick={clickHandler}>
        {decodedAnswer}
      </Button>
    );
  });

  return (
    <div key={uuidv4()}>
      <Card>{decodedQuestion}</Card>
      {mappedAnswers}
    </div>
  );
};

const App = () => {
  const [questions, setQuestions] = useState<Questions>(defaultState);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=1").then((response) => {
      const data = response.data.results[0];
      // console.log(data);
      setQuestions(data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <TriviaQuestion questions={questions} />
        <Button onClick={() => setClicked(!clicked)}>Next</Button>
      </header>
    </div>
  );
};

export default App;
