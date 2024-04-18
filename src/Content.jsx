import Part from "./Part";

const Content = ({ partsAndExercises }) => {
  return (
    <div>
      <Part partsAndExercises={Object.entries(partsAndExercises)[0]} />
      <Part partsAndExercises={Object.entries(partsAndExercises)[1]} />
      <Part partsAndExercises={Object.entries(partsAndExercises)[2]} />
    </div>
  );
};

export default Content;
