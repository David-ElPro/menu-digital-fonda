// Catálogo y persistencia compartidos por la pantalla y el panel.
(function () {
  'use strict';
  const STORAGE_KEY = 'fonda_menu_state_v1';
  const DEFAULT_STATE = {
        soups: [
            { id: 'sopa_pasta', name: 'Sopa de Pasta', active: true, color: '#ea580c' },
            { id: 'arroz_rojo', name: 'Arroz Rojo', active: true, color: '#dc2626' },
            { id: 'sopa_habas', name: 'Sopa de Habas', active: false, color: '#a16207' },
            { id: 'sopa_lentejas', name: 'Lentejas', active: false, color: '#78350f' }
        ],
        waters: [
            { id: 'jamaica', name: 'Jamaica', active: true, color: '#9f1239' },
            { id: 'naranja', name: 'Naranja', active: true, color: '#f97316' },
            { id: 'guayaba', name: 'Guayaba', active: false, color: '#fb7185' },
            { id: 'tamarindo', name: 'Tamarindo', active: false, color: '#92400e' },
            { id: 'limon', name: 'Limón', active: false, color: '#65a30d' }
        ],
        desserts: [
            { id: 'platanos', name: 'Plátanos fritos con lechera', price: 35, active: true },
            { id: 'gelatina', name: 'Gelatina', price: 20, active: true },
            { id: 'flan', name: 'Flan de leche', price: 20, active: true },
            { id: 'papas', name: 'Orden de papas a la francesa', price: 50, active: true }
        ],
        dishes: [
            { id: 'puerco_verde', category: 'Puerco', name: 'Puerco en Salsa Verde', price: 95, takeoutPrice: 100, active: true, sides: 'Con arroz y frijoles • Incluye 1L de agua y tortillas', img: 'img/puercoensalsaverde.jpg', sauceColor: '#4d7c0f', variants: [{ label: 'Normal', img: 'img/puercoensalsaverde.jpg' }, { label: 'Con Nopales', img: 'img/puercoensalsaverdeconnopales.jpg' }, { label: 'Con Calabacitas', img: 'img/puercoensalsaverdeconcalabacitas.jpg' }, { label: 'Con Verdolagas', img: 'img/puercoensalsaverdeconverdolagas.jpg' }], selectedVariant: 'Con Nopales' },
            { id: 'puerco_morita', category: 'Puerco', name: 'Puerco en Salsa Morita', price: 95, takeoutPrice: 100, active: true, sides: 'Con arroz y frijoles • Incluye 1L de agua y tortillas', img: 'img/puercoensalsamorita.jpg', sauceColor: '#7f1d1d', variants: [], selectedVariant: '' },
            { id: 'puerco_cacahuate', category: 'Puerco', name: 'Puerco en Salsa de Cacahuate', price: 95, takeoutPrice: 100, active: true, sides: 'Con arroz y frijoles • Incluye 1L de agua y tortillas', img: 'img/puercoensalsadecacahuate.jpg', sauceColor: '#b45309', variants: [], selectedVariant: '' },
            { id: 'adobo_puerco', category: 'Puerco', name: 'Adobo de Puerco', price: 95, takeoutPrice: 100, active: true, sides: 'Con arroz y frijoles • Incluye 1L de agua y tortillas', img: 'img/adobodepuerco.jpg', sauceColor: '#581c1c', variants: [], selectedVariant: '' },
            { id: 'puerco_jitomate', category: 'Puerco', name: 'Puerco en Salsa de Jitomate', price: 95, takeoutPrice: 100, active: false, sides: 'Con arroz y frijoles • Incluye 1L de agua y tortillas', img: 'img/puercoensalsadejitomate.jpg', sauceColor: '#b91c1c', variants: [{ label: 'Normal' }, { label: 'Con Nopales' }], selectedVariant: 'Normal' },
            { id: 'puerco_arbol', category: 'Puerco', name: 'Puerco en Salsa de Árbol', price: 95, takeoutPrice: 100, active: false, sides: 'Con arroz y frijoles • Incluye 1L de agua y tortillas', img: 'img/puercoensalsadearbol.jpg', sauceColor: '#991b1b', variants: [{ label: 'Normal' }, { label: 'Con Nopales' }], selectedVariant: 'Normal' },
            { id: 'filete_pescado', category: 'Especiales', name: 'Filete de Pescado Empanizado', price: 100, takeoutPrice: 100, active: false, sides: 'Con arroz, frijoles y ensalada • Incluye 1L de agua y tortillas', img: 'img/filetepescado.jpg', sauceColor: '#d97706', variants: [], selectedVariant: '' },
            { id: 'arrachera', category: 'Especiales', name: 'Arrachera Asada', price: 150, takeoutPrice: 150, active: false, sides: 'Con arroz, frijoles y ensalada • Incluye 1L de agua y tortillas', img: 'img/arrachera.jpg', sauceColor: '#7f1d1d', variants: [], selectedVariant: '' }
        ]
    };

  function validState(value) {
    return value && ['dishes', 'soups', 'waters', 'desserts'].every(key =>
      Array.isArray(value[key]) && value[key].every(item => item && typeof item === 'object')
    );
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn('No se pudo guardar el menú en este navegador.', error);
      return false;
    }
  }

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (validState(stored)) return stored;
    } catch (error) {
      console.warn('No se pudo leer el menú guardado.', error);
    }
    const initial = JSON.parse(JSON.stringify(DEFAULT_STATE));
    save(initial);
    return initial;
  }

  window.FondaMenu = { load, save };
})();
