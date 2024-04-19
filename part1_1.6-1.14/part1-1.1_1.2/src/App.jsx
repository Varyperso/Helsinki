const Header = ({ courseName }) => {
  <p1>{courseName}</p1>;
};

const Part = ({ partsAndExercises }) => {
  let key = partsAndExercises.name;
  let value = partsAndExercises.exercises;
  return <div>{key + ": " + value}</div>;
};

const Content = ({ partsAndExercises }) => {
  return (
    <div>
      <Part partsAndExercises={partsAndExercises[0]} />
      <Part partsAndExercises={partsAndExercises[1]} />
      <Part partsAndExercises={partsAndExercises[2]} />
    </div>
  );
};

const Total = ({ partsAndExercises }) => {
  const result = [...partsAndExercises].reduce((accumulator, keyValue) => accumulator + keyValue.exercises, 0);
  return (
    <p>
      the total sum of exercises in all 3 parts: <strong>{result}</strong>
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header courseName={course.name} />
      <Content partsAndExercises={course.parts} />
      <Total partsAndExercises={course.parts} />
    </div>
  );
};

export default App;
