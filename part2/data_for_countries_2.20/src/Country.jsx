import { useEffect, useState } from "react";
import Weather from "./Weather";

const Country = ({ countryObj, flip }) => {
  const [showParameters, setShowParameters] = useState(false);

  useEffect(() => {
    if (flip) setShowParameters(!showParameters);
  }, []);

  const toggleParameters = () => {
    setShowParameters(!showParameters);
  };

  return (
    countryObj && (
      <>
        <button onClick={toggleParameters}>{showParameters ? "Hide Parameters" : "Show Parameters"}</button>
        {showParameters && (
          <>
            <h1>{countryObj.name.common}</h1>
            <p>{countryObj.capital[0]}</p>
            <p>{countryObj.area}</p>
            <h3>Languages: </h3>
            {Object.values(countryObj.languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}{" "}
            <br />
            <img src={countryObj.flags.png} />
            <Weather pos={countryObj.latlng} />
          </>
        )}
      </>
    )
  );
};

export default Country;
