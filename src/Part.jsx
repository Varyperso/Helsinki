const Part = ({ partsAndExercises }) => {
  let key = partsAndExercises[1].name;
  let value = partsAndExercises[1].exercises;
  return <div>{key + ": " + value}</div>;
};

export default Part;
