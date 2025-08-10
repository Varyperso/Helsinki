import Country from "./Country";

const Countries = ({ countriesArr }) => {
  const flip = true;

  if (countriesArr?.length === 0) return <p>no results</p>;
  else if (countriesArr?.length > 10) return <p>too many results</p>;
  else if (countriesArr?.length == 1) return <Country countryObj={countriesArr[0]} flip={flip} />;
  else if (countriesArr?.length > 1 && countriesArr?.length < 10)
    return (
      <ul>
        {countriesArr?.map((country, index) => 
          <div key={index}><Country countryObj={country} /></div>
        )}
      </ul>
    );
};

export default Countries;