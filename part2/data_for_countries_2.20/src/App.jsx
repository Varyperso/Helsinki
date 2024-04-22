import { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./Countries";

const App = () => {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    if (search) {
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then((response) => {
        setCountries(response.data);
      });
    }
  }, [search]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (event) => {
    event.preventDefault();
    setSearch(value);
  };

  let filt = countries?.filter((country) => country.name.common.toLowerCase().includes(value.toLowerCase()));

  return (
    <div>
      <form onSubmit={onSearch}>
        search country: <input value={value} onChange={handleChange} />
        <button type="submit">country list</button>
      </form>
      <Countries countriesArr={filt} />
    </div>
  );
};

export default App;
