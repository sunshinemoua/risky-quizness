import React from "react";
import "./App.css";
import axios from "axios";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
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
