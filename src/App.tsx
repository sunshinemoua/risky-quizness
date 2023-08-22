import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  interface Questions {
    category: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: any;
  }
  const [question, setQuestion] = useState<Questions[]>([]);

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=1").then((response) => {
      const data = response.data.results;
      setQuestion(data);
    });
  }, []);

  console.log(question);

  const options = question.map((question) => {
    const newArr: string[] = [
      ...question.incorrect_answers,
      question.correct_answer,
    ];
    console.log(newArr);

    const shuffle = (arr: string[]) => {
      return arr.sort(() => Math.random() - 0.5);
    };

    const shuffledArr = shuffle(newArr);
    console.log(shuffledArr);

    const mappedAnswers = shuffledArr.map((answer) => {
      return <Card key={uuidv4()}>{answer}</Card>;
    });

    return (
      <div key={uuidv4()}>
        <Card>{question.question}</Card>
        {mappedAnswers}
      </div>
    );
  });

  // const mapped = question.map((question) => {
  //   const newArr: string[] = [
  //     ...question.incorrect_answers,
  //     question.correct_answer,
  //   ];
  //   console.log(newArr);

  //   const shuffle = (arr: string[]) => {
  //     return arr.sort(() => Math.random() - 0.5);
  //   };

  //   const shuffledArr = shuffle(newArr);
  //   console.log(shuffledArr);

  //   return (
  //     <div>
  //       <Card>HI</Card>
  //     </div>
  //   );
  // });

  return (
    <div className="App">
      <header className="App-header">
        <div>{options}</div>
      </header>
    </div>
  );
};

export default App;
