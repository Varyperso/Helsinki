import { useRef } from "react";

const Test1 = () => {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={(el) => {
        console.log("ref callback called:", el);
        inputRef.current = el;
      }} />
    </>
  )
}

export default Test1