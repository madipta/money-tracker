const MAX_PLACES = 3;

function annotate(number: number, abbr: string, maxPlaces: number) {
  let rounded = 0;
  switch (abbr) {
    case 'T':
      rounded = number / 1e12;
      break;
    case 'B':
      rounded = number / 1e9;
      break;
    case 'M':
      rounded = number / 1e6;
      break;
    case 'K':
      rounded = number / 1e3;
      break;
    case '':
      rounded = number;
      break;
  }
  const test = new RegExp('\\.\\d{' + maxPlaces + ',}$');
  if (test.test('' + rounded)) {
    rounded = +rounded.toFixed(maxPlaces);
  }
  return rounded + abbr;
}

export function abbreviate(number: number, maxPlaces = MAX_PLACES) {
  let abbr;
  if (number >= 1e12) {
    abbr = 'T';
  } else if (number >= 1e9) {
    abbr = 'B';
  } else if (number >= 1e6) {
    abbr = 'M';
  } else if (number >= 1e3) {
    abbr = 'K';
  } else {
    abbr = '';
  }
  return annotate(number, abbr, maxPlaces);
}
