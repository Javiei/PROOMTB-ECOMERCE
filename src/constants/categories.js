export const CATEGORIES = {
  BIKES: [
    { value: 'MTB', label: 'MTB' },
    { value: 'Ruta', label: 'Ruta' },
    { value: 'Urbana', label: 'Urbana' },
    { value: 'Eléctrica', label: 'Eléctrica' }
  ],
  ACCESSORIES: [
    { value: 'Lavado', label: 'Lavado' },
    { value: 'Rolos', label: 'Rolos' },
    { value: 'Cremas', label: 'Cremas' },
    { value: 'Bombas y CO2', label: 'Bombas y CO2' },
    { value: 'Herramientas y Aceites', label: 'Herramientas y Aceites' },
    { value: 'Cintas de Timón', label: 'Cintas de Timón' },
    { value: 'Protectores de Bicicletas', label: 'Protectores de Bicicletas' },
    { value: 'Guardalodos', label: 'Guardalodos' },
    { value: 'Milleros', label: 'Milleros' },
    { value: 'Ciclo Computadoras GPS', label: 'Ciclo Computadoras GPS' },
    { value: 'Relojes GPS', label: 'Relojes GPS' },
    { value: 'Sensores', label: 'Sensores' },
    { value: 'Luces', label: 'Luces' },
    { value: 'Cascos', label: 'Cascos' },
    { value: 'Guantillas', label: 'Guantillas' },
    { value: 'Gafas', label: 'Gafas' },
    { value: 'Protecciones', label: 'Protecciones' },
    { value: 'Nutrición', label: 'Nutrición' },
    { value: 'Bulticos y Mochilas', label: 'Bulticos y Mochilas' },
    { value: 'Termeras', label: 'Termeras' },
    { value: 'Termos', label: 'Termos' },
    { value: 'Puños', label: 'Puños' },
    { value: 'Porta Bicicletas y Burros', label: 'Porta Bicicletas y Burros' }
  ]
};

export const ALL_CATEGORIES = [
  { value: 'all', label: 'Todas las categorías' },
  { group: 'Bicicletas', options: CATEGORIES.BIKES },
  { group: 'Accesorios', options: CATEGORIES.ACCESSORIES },
  { group: 'Ropa', options: [
    { value: 'Licra', label: 'Licra' },
    { value: 'Jerseys', label: 'Jerseys' }
  ]}
];
