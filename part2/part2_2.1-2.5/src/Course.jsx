const Header = ({ courseName }) => (
  <h3>
    <u>{courseName}</u>
  </h3>
);

const Content = ({ partsAndExercises }) => {
  return (
    <div>
      {partsAndExercises.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Part = ({ part }) => {
  return <p>{part.name + ": " + part.exercises}</p>;
};

const Total = ({ partsAndExercises }) => {
  const result = [...partsAndExercises].reduce((accumulator, part) => accumulator + part.exercises, 0);
  return (
    <p>
      The <b>total</b> sum of exercises in all {partsAndExercises.length} parts is: <strong>{result}</strong>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header courseName={course.name} />
      <Content partsAndExercises={course.parts} />
      <Total partsAndExercises={course.parts} />
    </>
  );
};
export default Course;
