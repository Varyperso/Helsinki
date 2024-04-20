import { useState, useEffect } from "react";
import { getAll, createItem, deleteItem, updateItem } from "./services/fetch";
import Form from "./Form";
import Filter from "./Filter";
import Notification from "./Notification";

// prettier-ignore
const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notification, setNotification] = useState(null)


  useEffect(() => {
    getAll().then((response) => setPersons(response));
  }, [notification]);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleNameFilter = (e) => setNameFilter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    let numberOfDashes = 0;
    if (![...newNumber].every((char) => {
        char === "-" && numberOfDashes++;
        if (numberOfDashes > 2) return false;
        return (char >= "0" && char <= "9") || char === "-";
      })) {
      alert(`"${newNumber}" is invalid, can only contain numbers and only 2 "-" characters`);
      return;
    }
    if (newNumber.length < 9 || newNumber[0] === "-" || newNumber[newNumber.length - 1] === "-") {
      alert(`"${newNumber}" is invalid, it either is shorter than 9 characters or doesn't start/end with a number`);
      return;
    }
    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase().trim())) {
      if (confirm(`"${newName}" was previously added to the phonebook. do you want to change the number to the new one?`)) {
        const personToUpdate = persons.find((person) => person.name === newName);
        updateItem(personToUpdate.id, { ...personToUpdate, number: newNumber }).then((response) => {
          setPersons(persons.concat(response)); /// i don't understand why it doesn't update the state of the entire list with this command
          setNewName("");
          setNewNumber("");
          setNotification(`${newName}'s number has been changed`)
          setTimeout(() => setNotification(null), 3000)
          // getAll().then((response) => setPersons(response)); // had to refresh the list this way, couldn't figure out another way.. :(
        }).catch(err => {
          console.log(err);
          setNotification(`error changing number. "${newName}" doesn't exist.`)
        });
      }
      return;
    } else {
      createItem({ name: newName, number: newNumber, id: `${persons.length}` }).then((response) => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewNumber("");
        setNotification(`added ${newName}`)
        setTimeout(() => setNotification(null), 3000)
      });
    }
  };

  const handleDeleteItem = (id) => {
    const personToDelete = persons.find((person) => person.id === String(id)).name;
    if (window.confirm(`Delete ${personToDelete} ?`)) {
      const newPersons = persons.filter((prev) => prev.id !== String(id));
      deleteItem(id).then(setPersons(newPersons));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
        handleDeleteItem={handleDeleteItem}
      />
      <h3>User Info List</h3>
      <Filter
        persons={persons}
        nameFilter={nameFilter}
        handleNameFilter={handleNameFilter}
        handleDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default App;
