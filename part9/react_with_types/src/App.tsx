import courseParts from "./data/courseData";
import type { CoursePart } from "./types/CourseTypes";
import assertNever from "./utils/assertNever.ts";

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;

type CourseName = { courseName: string }
const Header = ({ courseName }: CourseName) => <h2>{courseName}</h2>

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <div>
          <p><b>{coursePart.name}</b> {coursePart.exerciseCount}</p>
          <p><i>{coursePart.description}</i></p>
        </div>
      );
    case "group":
      return (
        <div>
          <p><b>{coursePart.name}</b> {coursePart.exerciseCount}</p>
          <p>Group projects: {coursePart.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <p><b>{coursePart.name}</b> {coursePart.exerciseCount}</p>
          <p><i>{coursePart.description}</i></p>
          <p>Background: {coursePart.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <p><b>{coursePart.name}</b> {coursePart.exerciseCount}</p>
          <p><i>{coursePart.description}</i></p>
          <p>Requirements: {coursePart.requirements.map((req, i) => i !== coursePart.requirements.length - 1? <span>{req}, </span> : <span>{req}</span>)}</p>
        </div>
      );
    default:
      return assertNever(coursePart);
  }
};

type CourseParts = { courseParts: CoursePart[] }
const Content = ({ courseParts }: CourseParts) => {
  return (
    <>
      {courseParts.map(coursePart => <Part key={coursePart.name} coursePart={coursePart}></Part>)}
    </>
  )
}

type TotalExercises = { totalExercises: number }
const Total = ({ totalExercises }: TotalExercises) => <p>{ totalExercises }</p>
