import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { decode } from "html-entities";
import axios from "axios";
import { Card, Button, Stack } from "react-bootstrap";
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
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<any>>;
}

export const TriviaQuestion = ({ question, clicked, setClicked }: Props) => {
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<any>([]);
  const [isNotCorrect, setIsNotCorrect] = useState<any>([]);

  const [color, setColor] = useState<string>("primary");

  if (question === null) return null;

  const decodedQuestion: string = decode(question.question);
  const score: number = Math.floor((correct / total) * 100);

  const newArr: string[] = [
    ...question.incorrect_answers,
    question.correct_answer,
  ];
  console.log("NEW ARR " + newArr);

  const shuffle = (arr: string[]) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const shuffledArr: string[] = shuffle(newArr);
  console.log(question.correct_answer);
  console.log("SUFFLED ARR " + shuffledArr);

  const clickHandler = (selected: any) => {
    setIsDisabled(!isDisabled);

    if (selected === question.correct_answer) {
      setIsCorrect(shuffledArr.filter((item) => item === selected));
      setIsNotCorrect(shuffledArr.filter((item) => item !== selected));

      setCorrect(correct + 1);
      setTotal(total + 1);
    } else {
      setIsCorrect([question.correct_answer]);
      setIsNotCorrect(
        shuffledArr.filter((item) => item !== question.correct_answer)
      );
      setTotal(total + 1);
    }
  };

  console.log(color);
  console.log(isNotCorrect);

  const mappedAnswers = shuffledArr.map((answer, index) => {
    const decodedAnswer: string = decode(answer);

    return (
      <div className="d-flex my-2" key={index}>
        <Button
          onClick={() => clickHandler(decodedAnswer)}
          // disabled={isDisabled}
          // size="sm"
          className={color}
          variant={
            isCorrect.includes(decodedAnswer)
              ? "success"
              : isNotCorrect.includes(decodedAnswer)
              ? "danger"
              : "primary"
          }
        >
          {decodedAnswer}
        </Button>
      </div>
    );
  });

  const nextBtnHandler = () => {
    setClicked(!clicked);
    setIsDisabled(!isDisabled);
  };

  return (
    <div className="trivia-card-wrapper">
      <div className="calculations-wrapper">
        <Card>
          Correct: {correct} / {total}
        </Card>
        <Card> Score: {score >= 0 ? score : 0}%</Card>
      </div>

      <Card className="question-bg-card">
        <Card className="question">{decodedQuestion}</Card>
        <div className="answers-wrapper">{mappedAnswers}</div>
      </Card>
      <Button className="w-50" onClick={nextBtnHandler}>
        Next
      </Button>
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
  }, [clicked]);

  return (
    <div className="App">
      <header className="App-header">
        <TriviaQuestion
          question={question}
          clicked={clicked}
          setClicked={setClicked}
        />
      </header>
    </div>
  );
};

export default App;
