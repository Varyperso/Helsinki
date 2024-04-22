import Country from "./Country";

const Countries = ({ countriesArr }) => {
  const flip = true;

  if (countriesArr?.length == 1) return <Country countryObj={countriesArr[0]} flip={flip} />;

  if (countriesArr?.length > 1 && countriesArr?.length < 10)
    return (
      <ul>
        {countriesArr?.map((country, index) => (
          <>
            <div key={index}>
              {country.name.common} {<Country countryObj={country} />}
            </div>
          </>
        ))}
      </ul>
    );

  if (countriesArr?.length === 0) return <p>no results</p>;
  if (countriesArr?.length > 10) return <p>too many results</p>;
};

export default Countries;
