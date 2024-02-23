interface PlayerBirthInfo {
  birthCity: string;
  birthState?: string;
  birthCountry: string;
}

export function determinePlayerBirthplaceInfo(birthPlace: string): PlayerBirthInfo {
  const birthPlaceParts = birthPlace.split(',');

  if (birthPlaceParts.length !== 3) {
    throw Error('Unable to determine player birthplace info; invalid birth place');
  }

  const birthCity = birthPlaceParts[0];
  const birthCountry = birthPlaceParts[2].trim();

  if (birthPlaceParts[1]) {
    return {
      birthCity,
      birthState: birthPlaceParts[1].trim(),
      birthCountry,
    };
  }

  return { birthCity, birthCountry };
}
