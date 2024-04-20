const Item = ({ filteredResults, handleDeleteItem }) => {
  return (
    <ul>
      {filteredResults.map((person, index) => (
        <li key={index}>
          {person.id}. {person.name} {person.number}
          <button onClick={() => handleDeleteItem(index)}>Delete Item</button>
        </li>
      ))}
    </ul>
  );
};
export default Item;
