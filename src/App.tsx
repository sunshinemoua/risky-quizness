import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { decode } from "html-entities";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface Question {
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

interface Props {
  question: Question | null;
}

export const TriviaQuestion = ({ question }: Props) => {
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  if (question === null) return null;

  const decodedQuestion: string = decode(question.question);

  const newArr: string[] = [
    ...question.incorrect_answers,
    question.correct_answer,
  ];
  // console.log(newArr);
  const shuffle = (arr: string[]) => {
    return arr.sort(() => Math.random() - 1);
  };

  const shuffledArr: string[] = shuffle(newArr);
  console.log(shuffledArr);

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
      if (decodedAnswer === question.correct_answer) {
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
  const [question, setQuestion] = useState<Question | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=1").then((response) => {
      const data: Question = response.data.results[0];
      setQuestion(data);
    });
  }, []);

  console.log(question);
  return (
    <div className="App">
      <header className="App-header">
        <TriviaQuestion question={question} />
        <Button onClick={() => setClicked(!clicked)}>Next</Button>
      </header>
    </div>
  );
};

export default App;
