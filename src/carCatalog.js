const carBrandPrefixes = [
  { prefix: 'Mercedes-Maybach', brand: 'Mercedes-Benz', modelPrefix: 'Maybach' },
  { prefix: 'Mercedes-AMG', brand: 'Mercedes-Benz', modelPrefix: 'AMG' },
  { prefix: 'Mercedes-Benz', brand: 'Mercedes-Benz' },
  { prefix: 'Rolls-Royce', brand: 'Rolls-Royce' },
  { prefix: 'Range Rover', brand: 'Land Rover', modelPrefix: 'Range Rover' },
  { prefix: 'Porsche', brand: 'Porsche' },
  { prefix: 'BMW', brand: 'BMW' },
  { prefix: 'Chevrolet', brand: 'Chevrolet' },
  { prefix: 'Bentley', brand: 'Bentley' },
];

function getCarIdentity(name) {
  const match = carBrandPrefixes.find(({ prefix }) => name.startsWith(`${prefix} `));
  if (!match) {
    const [brand, ...modelParts] = name.split(' ');
    return { brand, model: modelParts.join(' ') };
  }

  const remainder = name.slice(match.prefix.length).trim();
  return {
    brand: match.brand,
    model: [match.modelPrefix, remainder].filter(Boolean).join(' '),
  };
}

const carRecords = [
  { name: 'Porsche 911 Carrera', slug: 'porsche-911-carrera', category: 'Sport', seasonalBestseller: true, transmission: 'Automatic', seats: 4, price: 350, deposit: 3000, images: ['/cars/porsche-911/1.jpg.png', '/cars/porsche-911/2.jpg.png', '/cars/porsche-911/3.jpg.png', '/cars/porsche-911/4.jpg.png'] },
  { name: 'BMW M4 Competition', slug: 'bmw-m4-competition', category: 'Sport', transmission: 'Automatic', seats: 4, price: 280, deposit: 2500, images: ['/cars/bmw-m4/1.png', '/cars/bmw-m4/2.png', '/cars/bmw-m4/3.png', '/cars/bmw-m4/4.png'] },
  { name: 'Chevrolet Corvette C7', slug: 'chevrolet-corvette-c7', category: 'Sport', transmission: 'Automatic', seats: 2, price: 300, deposit: 3000, images: ['/cars/corvette-c7/1.png', '/cars/corvette-c7/2.png', '/cars/corvette-c7/3.png', '/cars/corvette-c7/4.png'] },
  { name: 'Porsche 718 Cayman GT4', slug: 'porsche-718-cayman-gt4', category: 'Sport', transmission: 'Automatic', seats: 2, price: 320, deposit: 3000, images: ['/cars/cayman-718/1.png', '/cars/cayman-718/2.png', '/cars/cayman-718/3.png', '/cars/cayman-718/4.png'] },
  { name: 'Mercedes-Benz S-Class', slug: 'mercedes-benz-s-class', category: 'Luxury & Business', transmission: 'Automatic', seats: 4, price: 280, deposit: 2500, images: ['/cars/mercedes-s/1.jpeg', '/cars/mercedes-s/2.jpeg', '/cars/mercedes-s/3.jpeg', '/cars/mercedes-s/4.jpeg'] },
  { name: 'BMW 5 Series', slug: 'bmw-5-series', category: 'Luxury & Business', transmission: 'Automatic', seats: 5, price: 150, deposit: 1500, images: ['/cars/bmw-5/1.png', '/cars/bmw-5/2.png', '/cars/bmw-5/3.png', '/cars/bmw-5/4.png'] },
  { name: 'Range Rover Sport', slug: 'range-rover-sport', category: 'SUV', transmission: 'Automatic', seats: 5, price: 250, deposit: 2500, images: ['/cars/range-rover/1.png', '/cars/range-rover/2.png', '/cars/range-rover/3.png', '/cars/range-rover/4.png'] },
  { name: 'Porsche Cayenne Coupe', slug: 'porsche-cayenne-coupe', category: 'SUV', transmission: 'Automatic', seats: 5, price: 280, deposit: 2500, images: ['/cars/porsche-cayenne/1.png', '/cars/porsche-cayenne/2.png', '/cars/porsche-cayenne/3.png', '/cars/porsche-cayenne/4.png'] },
  { name: 'Mercedes-AMG G 63', slug: 'mercedes-amg-g-63', category: 'SUV', transmission: 'Automatic', seats: 5, price: 450, deposit: 4000, images: ['/cars/g-63/1.png', '/cars/g-63/2.png', '/cars/g-63/3.png', '/cars/g-63/4.png'] },
  { name: 'Mercedes-Maybach S-Class', slug: 'mercedes-maybach-s-class', category: 'Premium', transmission: 'Automatic', seats: 4, price: 550, deposit: 5000, images: ['/cars/maybach-s/1.png', '/cars/maybach-s/2.png', '/cars/maybach-s/3.png', '/cars/maybach-s/4.png'] },
  { name: 'Rolls-Royce Ghost', slug: 'rolls-royce-ghost', category: 'Premium', transmission: 'Automatic', seats: 4, price: 900, deposit: 7000, images: ['/cars/rolls/1.png', '/cars/rolls/2.png', '/cars/rolls/3.png', '/cars/rolls/4.png'] },
  { name: 'Bentley Continental GT', slug: 'bentley-continental-gt', category: 'Premium', transmission: 'Automatic', seats: 4, price: 650, deposit: 5000, images: ['/cars/bentley-continental/1.png', '/cars/bentley-continental/2.png', '/cars/bentley-continental/3.png', '/cars/bentley-continental/4.png'] },
  { name: 'Porsche Panamera Turbo S', slug: 'porsche-panamera-turbo-s', category: 'Sport Cars', year: 2021, engine: '4.0 V8 biturbo', power: '630 hp / 463 kW', consumption: 'To be confirmed for the exact vehicle', transmission: '8-speed PDK', drive: 'AWD', seats: 4, price: 340, promotion: { regularPrice: 390, period: '1-3' }, deposit: 3000, rentalRates: { '1-3': 340, '4-7': 322, '8-14': 294, '15-29': 266, '30+': 238 }, images: ['/cars/panamera-971/1.png', '/cars/panamera-971/2.png', '/cars/panamera-971/3.png', '/cars/panamera-971/4.png'] },
  { id: 'audi-rs6-avant', brand: 'Audi', model: 'RS6 Avant', name: 'Audi RS6 Avant', slug: 'audi-rs6-avant', category: 'Sport', bodyType: 'Wagon', year: null, engine: '4.0L V8 Twin-Turbo', power: '600 HP', consumption: '12.5 L/100 km', transmission: null, fuelType: null, drive: 'quattro', seats: null, price: 350, deposit: 2000, rentalRates: { '1-3': 350, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/rs-6/1.png', '/cars/rs-6/2.png', '/cars/rs-6/3.png', '/cars/rs-6/4.png'], availability: 'to-confirm', featured: false, descriptionKey: 'audiRs6Avant' },
  { id: 'audi-r8-v10', brand: 'Audi', model: 'R8 V10', name: 'Audi R8 V10', slug: 'audi-r8-v10', category: 'Sport', seasonalBestseller: true, bodyType: 'Coupe', year: null, engine: '5.2L V10 FSI', power: '620 HP', consumption: '13.1 L/100 km', transmission: null, fuelType: null, drive: 'quattro', seats: null, price: 650, deposit: 2000, rentalRates: { '1-3': 650, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/r-8/1.png', '/cars/r-8/2.png', '/cars/r-8/3.png', '/cars/r-8/4.png'], availability: 'to-confirm', featured: false, descriptionKey: 'audiR8V10' },
  { id: 'mercedes-amg-gt-63-s', brand: 'Mercedes-Benz', model: 'AMG GT 63 S', name: 'Mercedes-AMG GT 63 S', slug: 'mercedes-amg-gt-63-s', category: 'Sport', bodyType: 'Sedan', year: null, engine: '4.0L V8 Biturbo', power: '639 HP', consumption: '13.5 L/100 km', transmission: null, fuelType: null, drive: '4MATIC+', seats: null, price: 450, deposit: 2000, rentalRates: { '1-3': 450, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/amg-63s/1.png', '/cars/amg-63s/2.png', '/cars/amg-63s/4.png', '/cars/amg-63s/3.png'], availability: 'to-confirm', featured: false, descriptionKey: 'mercedesAmgGt63s' },
  { id: 'audi-a6', brand: 'Audi', model: 'A6', name: 'Audi A6', slug: 'audi-a6', category: 'Luxury & Business', bodyType: 'Sedan', year: null, engine: '3.0L V6 TFSI', power: '340 HP', consumption: '8.5 L/100 km', transmission: null, fuelType: null, drive: 'quattro', seats: null, price: 150, deposit: 2000, rentalRates: { '1-3': 150, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/audi-a6/1.png', '/cars/audi-a6/2.png', '/cars/audi-a6/4.png', '/cars/audi-a6/3.png'], availability: 'to-confirm', featured: false, descriptionKey: 'audiA6' },
  { id: 'audi-a7-sportback', brand: 'Audi', model: 'A7 Sportback', name: 'Audi A7 Sportback', slug: 'audi-a7-sportback', category: 'Luxury & Business', bodyType: 'Sportback', year: null, engine: '3.0L V6 TFSI', power: '340 HP', consumption: '8.5 L/100 km', transmission: null, fuelType: null, drive: 'quattro', seats: null, price: 180, deposit: 2000, rentalRates: { '1-3': 180, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/audi-a7/1.png', '/cars/audi-a7/2.png', '/cars/audi-a7/3.png', '/cars/audi-a7/4.png'], availability: 'to-confirm', featured: false, descriptionKey: 'audiA7Sportback' },
  { id: 'audi-rs-q8', brand: 'Audi', model: 'RS Q8', name: 'Audi RS Q8', slug: 'audi-rs-q8', category: 'SUV', bodyType: 'SUV', year: null, engine: '4.0L V8 Twin-Turbo', power: '600 HP', consumption: '13.5 L/100 km', transmission: null, fuelType: null, drive: 'quattro', seats: null, price: 400, deposit: 2000, rentalRates: { '1-3': 400, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/rsq-8/1.png', '/cars/rsq-8/4.png', '/cars/rsq-8/2.png', '/cars/rsq-8/3.png'], availability: 'to-confirm', featured: false, descriptionKey: 'audiRsQ8' },
  { id: 'porsche-macan', brand: 'Porsche', model: 'Macan', name: 'Porsche Macan', slug: 'porsche-macan', category: 'SUV', bodyType: 'SUV', year: null, engine: '2.9L V6 Twin-Turbo', power: '380 HP', consumption: '10.5 L/100 km', transmission: null, fuelType: null, drive: 'AWD', seats: null, price: 220, deposit: 2000, rentalRates: { '1-3': 220, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/macan/1.png', '/cars/macan/2.png', '/cars/macan/3.png', '/cars/macan/4.png'], availability: 'to-confirm', featured: false, descriptionKey: 'porscheMacan' },
  { id: 'bmw-x5-m-competition', brand: 'BMW', model: 'X5 M Competition', name: 'BMW X5 M Competition', slug: 'bmw-x5-m-competition', category: 'SUV', bodyType: 'SUV', year: null, engine: '4.4L V8 Twin-Turbo', power: '625 HP', consumption: '12.8 L/100 km', transmission: null, fuelType: null, drive: 'M xDrive', seats: null, price: 350, deposit: 2000, rentalRates: { '1-3': 350, '4-7': null, '8-14': null, '15-29': null, '30+': null }, images: ['/cars/bmwx5m/1.png', '/cars/bmwx5m/2.png', '/cars/bmwx5m/3.png', '/cars/bmwx5m/4.png'], availability: 'to-confirm', featured: false, descriptionKey: 'bmwX5MCompetition' },
];

export const cars = carRecords.map((car) => ({
  id: car.id || car.slug,
  ...getCarIdentity(car.name),
  ...car,
  bodyType: car.bodyType ?? null,
  year: car.year ?? null,
  engine: car.engine ?? null,
  power: car.power ?? null,
  transmission: car.transmission ?? null,
  fuelType: car.fuelType ?? null,
  drive: car.drive ?? null,
  seats: car.seats ?? null,
  price: car.price ?? null,
  deposit: car.deposit ?? null,
  rentalRates: car.rentalRates ?? null,
  availability: car.availability ?? 'unconfirmed',
  featured: car.featured ?? false,
  images: car.images || ['/hero-911.png'],
}));

export function getAvailableCarBrands() {
  return [...new Set(cars.map(({ brand }) => brand))].sort((a, b) => a.localeCompare(b));
}

export function filterCarsByBrandAndCategory({ brand, category } = {}) {
  return cars.filter((car) =>
    (!brand || car.brand === brand) &&
    (!category || car.category === category || (category === 'Sport' && car.category === 'Sport Cars'))
  );
}
