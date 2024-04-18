const Total = ({ partsAndExercises }) => {
  const result = [...partsAndExercises].reduce((accumulator, keyValue) => accumulator + keyValue.exercises, 0);

  return (
    <p>
      the total sum of exercises in all 3 parts: <strong>{result}</strong>
    </p>
  );
};

export default Total;
