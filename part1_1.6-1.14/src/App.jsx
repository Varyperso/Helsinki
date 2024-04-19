import { useState } from "react";

function Button({ clickHandler, text }) {
  return <button onClick={clickHandler}>{text}</button>;
}

function StatisticLine({ text, value }) {
  return (
    <tr>
      <td style={{ margin: "4x", fontSize: "18px" }}>
        {text}: {value}
      </td>
    </tr>
  );
}

function Statistics({ good, neutral, bad }) {
  let total = good + neutral + bad;
  let avg = total === 0 ? "?" : (good + bad * -1) / total;
  let positive = total === 0 ? "?" : (good * 100) / total + "%";
  return (
    <table>
      <caption style={{ fontSize: "32px", margin: "20px 0px", textAlign: "left" }}>Statistics</caption>
      <tbody>
        <StatisticLine text="good" value={total ? good : "?"} />
        <StatisticLine text="neutral" value={total ? neutral : "?"} />
        <StatisticLine text="bad" value={total ? bad : "?"} />
        <StatisticLine text="total" value={total ? total : "?"} />
        <StatisticLine text="average" value={avg} />
        <StatisticLine text="positive" value={positive} />
      </tbody>
    </table>
  );
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const [selectedAnecdote, setSelectedAnecdote] = useState(0);
  const [selected, setSelected] = useState(Array(anecdotes.length).fill(0));

  let highestVotesAnecdote = selected.indexOf(Math.max(...selected));

  const clickGoodHandler = () => {
    setGood((prev) => prev + 1);
  };
  const clickNeutralHandler = () => {
    setNeutral((prev) => prev + 1);
  };
  const clickBadHandler = () => {
    setBad((prev) => prev + 1);
  };

  const clickAnecdote = () => {
    setSelectedAnecdote(Math.floor(Math.random() * anecdotes.length));
  };
  const clickVoteAnecdote = () => {
    const arrCopy = [...selected];
    arrCopy[selectedAnecdote]++;
    setSelected(arrCopy);
  };

  return (
    <>
      <div>
        <h1>feedback</h1>
        <Button clickHandler={clickGoodHandler} text="good" />
        <Button clickHandler={clickNeutralHandler} text="neutral" />
        <Button clickHandler={clickBadHandler} text="bad" />
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
      <div>
        <h1>Anecdote of the day</h1>
        <Button clickHandler={clickAnecdote} text="Random Anecdote" /> <br />
        <h3>{anecdotes[selectedAnecdote]} </h3>
        <p>has {selected[selectedAnecdote]} Votes </p>
        <Button clickHandler={clickVoteAnecdote} text="Vote" />
        <h1>Anecdote with most votes</h1>
        {Math.max(...selected) > 0 ? <h3>{anecdotes[highestVotesAnecdote]}</h3> : "..awaiting votes.."}
      </div>
    </>
  );
};

export default App;
