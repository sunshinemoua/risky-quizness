import React, { useEffect, useState } from "react";
import "./App.css";
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

  const mapped = question.map((question) => {
    console.log(question.correct_answer);
    console.log(question.incorrect_answers);

    const incorrect = question.incorrect_answers;
    console.log(incorrect);
    const mapInc = incorrect.map((inc: any) => {
      return <Card>{inc}</Card>;
    });

    return (
      <div>
        <Card>{question.question}</Card>
        {mapInc}
        <Card>{question.correct_answer}</Card>
      </div>
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <div>{mapped}</div>
      </header>
    </div>
  );
};

export default App;
