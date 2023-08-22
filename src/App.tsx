import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { decode } from "html-entities";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
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

  const [question, setQuestion] = useState<Questions[]>([]);
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=1").then((response) => {
      const data = response.data.results;
      setQuestion(data);
    });
  }, []);

  const options = question.map((question) => {
    const decodedQuestion = decode(question.question);

    const newArr: string[] = [
      ...question.incorrect_answers,
      question.correct_answer,
    ];

    const shuffle = (arr: string[]) => {
      return arr.sort(() => Math.random() - 0.5);
    };

    const shuffledArr = shuffle(newArr);

    const mappedAnswers = shuffledArr.map((answer) => {
      const decodedAnswer = decode(answer);

      const answeredCorrectly = () => {
        setCorrect(correct + 1);
        setTotal(total + 1);
      };

      const answeredIncorrectly = () => {
        setTotal(total + 1);
      };

      const clickHandler = () => {
        if (decodedAnswer === question.correct_answer) {
          answeredCorrectly();
        } else {
          answeredIncorrectly();
        }
      };

      return (
        <Card key={uuidv4()} onClick={clickHandler}>
          {decodedAnswer}
        </Card>
      );
    });

    return (
      <div key={uuidv4()}>
        <Card>{decodedQuestion}</Card>
        {mappedAnswers}
      </div>
    );
  });

  console.log("ANSWERED CORRECT: " + correct + "TOTAL: " + total);

  return (
    <div className="App">
      <header className="App-header">
        <div>{options}</div>
      </header>
    </div>
  );
};

export default App;
