import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  interface Questions {
    question: string;
    correct: string;
    incorrect: any;
  }
  const [questions, setQuestions] = useState<Questions[]>([]);

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=50").then((response) => {
      const data = response.data.results;
      setQuestions(data);
    });
  }, []);

  console.log(questions);

  return (
    <div className="App">
      <header className="App-header">
        <Card className="question">Question</Card>
        <Card className="choice">Answer1</Card>
        <Card className="choice">Answer2</Card>
        <Card className="choice">Answer3</Card>
        <Card className="choice">Answer4</Card>
      </header>
    </div>
  );
};

export default App;
