import { useState } from "react";
import Items from "./Items";

const Filter = ({ persons, handleDeleteItem }) => {
  const [nameFilter, setNameFilter] = useState("");

  const handleNameFilter = e => setNameFilter(e.target.value);

  if (persons.length === 0) return <div>Loading..</div>
  
  const filteredResults = persons
    .filter(person => person.name.toLowerCase().includes(nameFilter))
    .sort((p1, p2) => p1.id - p2.id);

  return (
    <>
      <label>
        Filter results: <input onChange={handleNameFilter} value={nameFilter} />
      </label>
      <Items filteredResults={filteredResults} handleDeleteItem={handleDeleteItem} />
    </>
  );
};
export default Filter;
