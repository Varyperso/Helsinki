import { useState, useEffect } from "react";
import { getAll, createItem, deleteItem, updateItem } from "./services/fetch";
import Form from "./Form";
import Filter from "./Filter";
import Notification from "./Notification";

// prettier-ignore
const App = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    getAll().then(response => setPersons(response));
  }, []);

  const handleSubmit = (e, newName, setNewName, newNumber, setNewNumber) => {
    e.preventDefault();
    let numberOfDashes = 0;
    if (!newNumber.split('').every(char => {
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
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase().trim())) {
      if (confirm(`"${newName}" was previously added to the phonebook. do you want to change the number to the new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName);
        updateItem(personToUpdate.id, { ...personToUpdate, number: newNumber }).then(response => {
          setPersons(persons.map(person => person.name === response.name ? response : person));
          setNewName("");
          setNewNumber("");
          setNotification(`${newName}'s number has been changed`)
          setTimeout(() => setNotification(null), 3000)
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
    if (confirm(`Delete ${personToDelete} ?`)) {
      const newPersons = persons.filter((prev) => prev.id !== String(id));
      deleteItem(id).then(setPersons(newPersons));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Form handleSubmit={handleSubmit} handleDeleteItem={handleDeleteItem} />
      <h3>User Info List</h3>
      <Filter persons={persons} handleDeleteItem={handleDeleteItem} />
    </div>
  );
};

export default App;