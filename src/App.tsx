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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [color, setColor] = useState<string>("primary");

  if (question === null) return null;

  const decodedQuestion: string = decode(question.question);
  const score: number = Math.floor((correct / total) * 100);

  const newArr: string[] = [
    ...question.incorrect_answers,
    question.correct_answer,
  ];
  // console.log(newArr);

  const shuffle = (arr: string[]) => {
    return arr.sort(() => Math.random() - 1);
  };

  const shuffledArr: string[] = shuffle(newArr);
  // console.log(shuffledArr);

  const mappedAnswers = shuffledArr.map((answer) => {
    const decodedAnswer: string = decode(answer);

    const clickHandler = () => {
      setIsDisabled(!isDisabled);

      if (decodedAnswer === question.correct_answer) {
        setCorrect(correct + 1);
        setTotal(total + 1);
        changeColor();
      } else {
        setTotal(total + 1);
        changeColor();
      }
    };

    const changeColor = () => {
      if (decodedAnswer === question.correct_answer) {
        setIsCorrect(true);
        setColor("success");
      } else {
        setIsCorrect(false);
        setColor("danger");
      }
    };

    console.log(color);

    return (
      <div className="d-flex my-2" key={uuidv4()}>
        <Button
          onClick={clickHandler}
          // disabled={isDisabled}
          size="sm"
          className={"answer-options-" + { color }}
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
