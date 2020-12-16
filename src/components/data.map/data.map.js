export async function getData(url) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  console.log(data);

  const countries = data.Countries;
  countries.forEach((country) => {
    const countryName = country.Country;
    const totalConfirmed = country.TotalConfirmed;
    const totalDeaths = country.TotalDeaths;
    console.log(countryName, totalDeaths, totalConfirmed);
  });
}

export default getData;
