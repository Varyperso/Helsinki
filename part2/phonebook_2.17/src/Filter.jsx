import Item from "./Item";

const Filter = ({ persons, nameFilter, handleNameFilter, handleDeleteItem }) => {
  const filteredResults = persons.filter((person) => person.name.toLowerCase().includes(nameFilter));
  return (
    <>
      <div>
        Filter results: <input onChange={handleNameFilter} value={nameFilter} />
      </div>
      <Item filteredResults={filteredResults} handleDeleteItem={handleDeleteItem} />
    </>
  );
};
export default Filter;
