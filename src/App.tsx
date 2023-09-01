import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { decode, encode } from "html-entities";
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
  options: string[];
}

export const TriviaQuestion = ({
  question,
  clicked,
  setClicked,
  options,
}: Props) => {
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<any>([]);
  const [isNotCorrect, setIsNotCorrect] = useState<any>([]);

  if (question === null) return null;

  const decodedQuestion: string = decode(question.question);
  const correctAnswer: string = decode(question.correct_answer);
  const score: number = Math.floor((correct / total) * 100);

  const encodedIncorrectAnswers = question.incorrect_answers.map((ans: any) => {
    const encodedIncorrect = encode(ans);
    return encodedIncorrect;
  });

  const clickHandler = (selected: any) => {
    console.log("SELECTING " + selected);

    const encodedSelected: string = encode(selected);
    console.log("ENCODED " + encodedSelected);

    setIsDisabled(!isDisabled);

    if (encodedSelected === question.correct_answer) {
      setIsCorrect(options.filter((item) => item === encodedSelected));
      setIsNotCorrect(options.filter((item) => item !== encodedSelected));

      setCorrect(correct + 1);
      setTotal(total + 1);
    } else {
      setIsCorrect([correctAnswer]);
      setIsNotCorrect(options.filter((item) => item !== correctAnswer));
      setTotal(total + 1);
    }
  };

  const mappedAnswers = options.map((answer, index) => {
    const decodedAnswer: string = decode(answer);

    return (
      <div className="d-flex my-2" key={index}>
        <Button
          onClick={() => clickHandler(decodedAnswer)}
          variant={
            isCorrect.includes(decodedAnswer)
              ? "success"
              : isNotCorrect.includes(decodedAnswer)
              ? "danger"
              : "primary"
          }
          disabled={isDisabled}
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

  console.log(mappedAnswers);
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
  const [options, setOptions] = useState<string[]>([]);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [clicked]);

  const getData = async () => {
    await axios.get("https://opentdb.com/api.php?amount=1").then((response) => {
      const data: Question = response.data.results[0];
      setQuestion(data);

      const newArr = [...data.incorrect_answers, data.correct_answer];
      console.log(newArr);

      const newShuffled = shuffle(newArr);
      console.log(newShuffled);
      setOptions(newShuffled);
    });
  };

  const shuffle = (arr: string[]) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  console.log(question);

  return (
    <div className="App">
      <header className="App-header">
        <TriviaQuestion
          question={question}
          clicked={clicked}
          setClicked={setClicked}
          options={options}
        />
      </header>
    </div>
  );
};

export default App;
