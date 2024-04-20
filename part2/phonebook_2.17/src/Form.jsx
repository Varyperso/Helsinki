const Form = ({ newName, handleNameChange, newNumber, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
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
