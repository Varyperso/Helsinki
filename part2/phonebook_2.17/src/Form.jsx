import { useState } from "react";

const Form = ({ handleSubmit }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNameChange = e => setNewName(e.target.value);
  const handleNumberChange = e => setNewNumber(e.target.value);

  return (
    <form onSubmit={e => handleSubmit(e, newName, setNewName, newNumber, setNewNumber)}>
      <div>
        Name: <input onChange={handleNameChange} value={newName} /> <br />
        Number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};
export default Form;
