// Catálogo compartido. Los nuevos platillos inician desactivados.
(function () {
  'use strict';
  const STORAGE_KEY = 'fonda_menu_state_v1';
  const DEFAULT_STATE = {
  "display": {"brightness": 1, "textSize": 1},
  "catalogVersion": 3,
  "dishes": [
    {
      "id": "puerco_verde",
      "category": "Puerco",
      "name": "Puerco en Salsa Verde",
      "price": 95,
      "takeoutPrice": 100,
      "active": true,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puercoensalsaverde.jpg",
      "sauceColor": "#4d7c0f",
      "variants": [
        {
          "label": "Normal",
          "img": "img/puercoensalsaverde.jpg"
        },
        {
          "label": "Con Nopales",
          "img": "img/puercoensalsaverdeconnopales.png"
        },
        {
          "label": "Con Calabacitas",
          "img": "img/puercoensalsaverdeconcalabacitas.png"
        },
        {
          "label": "Con Verdolagas",
          "img": "img/puercoensalsaverdeconverdolagas.png"
        }
      ],
      "selectedVariant": "Con Nopales",
      "includesSoup": true
    },
    {
      "id": "puerco_morita",
      "category": "Puerco",
      "name": "Puerco en Salsa Morita",
      "price": 95,
      "takeoutPrice": 100,
      "active": true,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puercoensalsamorita.jpg",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "puerco_cacahuate",
      "category": "Puerco",
      "name": "Puerco en Salsa de Cacahuate",
      "price": 95,
      "takeoutPrice": 100,
      "active": true,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puercoensalsadecacahuate.jpg",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "adobo_puerco",
      "category": "Puerco",
      "name": "Adobo de Puerco",
      "price": 95,
      "takeoutPrice": 100,
      "active": true,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/adobodepuerco.jpg",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "puerco_jitomate",
      "category": "Puerco",
      "name": "Puerco en Salsa de Jitomate",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puercoensalsadejitomate.jpg",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal",
          "img": "img/puercoensalsadejitomate.jpg"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        },
        {
          "label": "Con Verdolagas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "puerco_arbol",
      "category": "Puerco",
      "name": "Puerco en Salsa de Árbol",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puercoensalsadearbol.jpg",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal",
          "img": "img/puercoensalsadearbol.jpg"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "filete_pescado",
      "category": "Especiales",
      "name": "Filete de Pescado Empanizado",
      "price": 100,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/filetedepescadoempanizado.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "arrachera",
      "category": "Especiales",
      "name": "Arrachera Asada",
      "price": 150,
      "takeoutPrice": 150,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/arrachera.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "entomatado_verde",
      "category": "Res",
      "name": "Entomatado de Res en Salsa Verde",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/entomatadoderes.png",
      "sauceColor": "#4d7c0f",
      "variants": [
        {
          "label": "Normal"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "entomatado_jitomate",
      "category": "Res",
      "name": "Entomatado de Res en Salsa de Jitomate",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "barbacoa_res",
      "category": "Res",
      "name": "Barbacoa de Res",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/barbacoaderes.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "asado_res_verde",
      "category": "Res",
      "name": "Asado de Res en Salsa Verde",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#4d7c0f",
      "variants": [
        {
          "label": "Normal"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "asado_res_rojo",
      "category": "Res",
      "name": "Asado de Res en Salsa Roja",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "puerco_guajillo",
      "category": "Puerco",
      "name": "Puerco en Guajillo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puercoenguajillo.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "puerco_ancho",
      "category": "Puerco",
      "name": "Puerco en Chile Ancho",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/puerchoenchileancho.png",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "cochinita",
      "category": "Puerco",
      "name": "Cochinita Pibil",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/cochinitapibil.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "mole_verde_puerco",
      "category": "Puerco",
      "name": "Mole Verde con Puerco",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/moleverdeconpuerco.png",
      "sauceColor": "#4d7c0f",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "mole_rojo_puerco",
      "category": "Puerco",
      "name": "Mole Rojo con Puerco",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_verde",
      "category": "Pollo",
      "name": "Pollo en Salsa Verde",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/polloensalsaverde.jpg",
      "sauceColor": "#4d7c0f",
      "variants": [
        {
          "label": "Normal",
          "img": "img/polloensalsaverde.jpg"
        },
        {
          "label": "Con Nopales",
          "img": "img/polloensalsaverdeconnopales.png"
        },
        {
          "label": "Con Calabacitas",
          "img": "img/polloensalsaverconcalabacitas.png"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "pollo_jitomate",
      "category": "Pollo",
      "name": "Pollo en Salsa de Jitomate",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/polloensalsadejitomate.png",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal",
          "img": "img/polloensalsadejitomate.png"
        },
        {
          "label": "Con Nopales",
          "img": "img/polloenjitomateconnopales.png"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "pollo_guajillo",
      "category": "Pollo",
      "name": "Pollo en Guajillo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/polloensalsadeguajillo.png",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal",
          "img": "img/polloensalsadeguajillo.png"
        },
        {
          "label": "Con Nopales",
          "img": "img/polloenguajilloconnopales.png"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "pollo_arbol",
      "category": "Pollo",
      "name": "Pollo en Salsa de Árbol",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Normal"
        },
        {
          "label": "Con Nopales"
        },
        {
          "label": "Con Calabacitas"
        }
      ],
      "selectedVariant": "Normal",
      "includesSoup": true
    },
    {
      "id": "adobo_pollo",
      "category": "Pollo",
      "name": "Adobo de Pollo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_crema",
      "category": "Pollo",
      "name": "Pollo en Crema",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_chipotle",
      "category": "Pollo",
      "name": "Pollo en Crema de Chipotle",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/polloencremadechipotle.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_champinones",
      "category": "Pollo",
      "name": "Pollo en Crema de Champiñones",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/polloencremadechampiñon.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_poblana",
      "category": "Pollo",
      "name": "Pollo en Crema Poblana",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pechuga_tamarindo",
      "category": "Pollo",
      "name": "Pechuga en Salsa de Tamarindo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/pechugaensalsadetamarindo.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_jardinera",
      "category": "Pollo",
      "name": "Pollo a la Jardinera",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "mole_rojo_pollo",
      "category": "Pollo",
      "name": "Mole Rojo con Pollo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/molerojoconpollo.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "mole_verde_pollo",
      "category": "Pollo",
      "name": "Mole Verde con Pollo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/moleverdeconpollo.png",
      "sauceColor": "#4d7c0f",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pollo_morita",
      "category": "Pollo",
      "name": "Pollo en Salsa Morita",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/polloensalsamorita.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "chilaquiles",
      "category": "Antojitos",
      "name": "Chilaquiles Verdes",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/chilaquilesverdes.png",
      "sauceColor": "#4d7c0f",
      "variants": [
        {
          "label": "Con Pollo"
        },
        {
          "label": "Con Huevo"
        }
      ],
      "selectedVariant": "Con Pollo",
      "includesSoup": true
    },
    {
      "id": "enchiladas",
      "category": "Antojitos",
      "name": "Enchiladas Verdes",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/enchiladasverdes.png",
      "sauceColor": "#4d7c0f",
      "variants": [
        {
          "label": "Con Pollo"
        },
        {
          "label": "Con Queso Oaxaca"
        }
      ],
      "selectedVariant": "Con Pollo",
      "includesSoup": true
    },
    {
      "id": "enmoladas",
      "category": "Antojitos",
      "name": "Enmoladas",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/enmoladas.png",
      "sauceColor": "#9a3412",
      "variants": [
        {
          "label": "Con Pollo"
        },
        {
          "label": "Con Queso Oaxaca"
        }
      ],
      "selectedVariant": "Con Pollo",
      "includesSoup": true
    },
    {
      "id": "bisteck_encebollado",
      "category": "Puerco",
      "name": "Bisteck de Puerco Asado Encebollado",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/bisteckasadoencebollado.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pancita",
      "category": "Caldos",
      "name": "Pancita",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Incluye entrada del día, 1L de agua y tortillas",
      "img": "img/pancita.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "caldo_res",
      "category": "Caldos",
      "name": "Caldo de Res con Verdura",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Incluye entrada del día, 1L de agua y tortillas",
      "img": "img/caldoderesconverdura.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "clemole_res",
      "category": "Caldos",
      "name": "Clemole de Res con Verdura Rojo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Incluye entrada del día, 1L de agua y tortillas",
      "img": "img/clemolederesconverdura.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "caldo_pollo",
      "category": "Caldos",
      "name": "Caldo de Pollo con Verdura",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Incluye entrada del día, 1L de agua y tortillas",
      "img": "img/caldodepolloconverdura.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "clemole_pollo",
      "category": "Caldos",
      "name": "Clemole de Pollo con Verdura Rojo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Incluye entrada del día, 1L de agua y tortillas",
      "img": "img/clemoledepolloconverdura.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "chiles_capeados",
      "category": "Antojitos",
      "name": "Chiles Rellenos Capeados",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/chilerelleno.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "chiles_sin_capear",
      "category": "Antojitos",
      "name": "Chiles Rellenos sin Capear",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "tortas_papa",
      "category": "Antojitos",
      "name": "Tortas de Papa",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/tortasdepapa.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "tortas_philadelphia",
      "category": "Antojitos",
      "name": "Tortas de Papa Rellenas de Philadelphia",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "croquetas_atun",
      "category": "Antojitos",
      "name": "Croquetas de Atún",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/croquetasdeatun.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "higado",
      "category": "Res",
      "name": "Hígado de Res Encebollado",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/higadoderesencebollado.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pechuga_asada",
      "category": "Pollo",
      "name": "Pechuga de Pollo Asada",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/pechugaasada.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "carne_enchilada",
      "category": "Puerco",
      "name": "Carne Enchilada",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/carnenchilada.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "milanesa_pollo",
      "category": "Pollo",
      "name": "Milanesa de Pollo",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/milanesadepollo.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "bisteck_mexicana",
      "category": "Puerco",
      "name": "Bisteck de Puerco a la Mexicana",
      "price": 95,
      "takeoutPrice": 100,
      "active": false,
      "sides": "Arroz, frijoles o ambos • Incluye 1L de agua y tortillas",
      "img": "img/bisteckalamexicana.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "cecina",
      "category": "Especiales",
      "name": "Cecina",
      "price": 150,
      "takeoutPrice": null,
      "active": false,
      "sides": "Arroz, frijoles o ambos y ensalada • Incluye 1L de agua y tortillas",
      "img": "img/cecina.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": true
    },
    {
      "id": "pozole_puerco",
      "category": "Paquetes",
      "name": "Pozole de Puerco",
      "price": 110,
      "takeoutPrice": null,
      "active": false,
      "sides": "Paquete: pozole + orden de tacos dorados + 1L de agua",
      "img": "img/pozoledepuerco.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": false,
      "packageItems": [
        {
          "name": "Orden de tacos dorados",
          "img": "img/tacosdorados.png",
          "color": "#d97706"
        }
      ]
    },
    {
      "id": "pozole_pollo",
      "category": "Paquetes",
      "name": "Pozole de Pollo",
      "price": 110,
      "takeoutPrice": null,
      "active": false,
      "sides": "Paquete: pozole + orden de tacos dorados + 1L de agua",
      "img": "img/pozoledepollo.png",
      "sauceColor": "#9a3412",
      "variants": [],
      "selectedVariant": "",
      "includesSoup": false,
      "packageItems": [
        {
          "name": "Orden de tacos dorados",
          "img": "img/tacosdorados.png",
          "color": "#d97706"
        }
      ]
    }
  ],
  "soups": [
    {
      "id": "sopa_pasta",
      "name": "Sopa de Pasta",
      "active": true,
      "color": "#ea580c",
      "img": "img/sopafideo.png"
    },
    {
      "id": "arroz_rojo",
      "name": "Arroz Rojo",
      "active": true,
      "color": "#dc2626",
      "img": "img/sopaarroz.png"
    },
    {
      "id": "sopa_habas",
      "name": "Sopa de Habas",
      "active": false,
      "color": "#a16207",
      "img": "img/sopahaba.png"
    },
    {
      "id": "sopa_lentejas",
      "name": "Lentejas",
      "active": false,
      "color": "#78350f",
      "img": "img/sopalentejas.png"
    }
  ],
  "waters": [
    {
      "id": "jamaica",
      "name": "Jamaica",
      "active": true,
      "color": "#9f1239",
      "img": "img/aguajamaica.png"
    },
    {
      "id": "naranja",
      "name": "Naranja",
      "active": true,
      "color": "#f97316",
      "img": ""
    },
    {
      "id": "guayaba",
      "name": "Guayaba",
      "active": false,
      "color": "#fb7185",
      "img": "img/aguaguayaba.png"
    },
    {
      "id": "tamarindo",
      "name": "Tamarindo",
      "active": false,
      "color": "#92400e",
      "img": "img/aguatamarindo.png"
    },
    {
      "id": "limon",
      "name": "Limón",
      "active": false,
      "color": "#65a30d",
      "img": "img/agualimon.png"
    }
  ],
  "desserts": [
    {
      "id": "platanos",
      "name": "Plátanos fritos con lechera",
      "price": 35,
      "active": true,
      "img": "img/platanosfritos.png"
    },
    {
      "id": "gelatina",
      "name": "Gelatina",
      "price": 20,
      "active": true,
      "img": "img/gelatina.png"
    },
    {
      "id": "flan",
      "name": "Flan de leche",
      "price": 20,
      "active": true,
      "img": "img/flandeleche.png"
    },
    {
      "id": "papas",
      "name": "Orden de papas a la francesa",
      "price": 50,
      "active": true,
      "img": "img/ordendepapasalafrancesa.png"
    }
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

  function normalize(stored) {
    if (!validState(stored)) throw new Error('El menú compartido tiene un formato inválido.');
        const merged = JSON.parse(JSON.stringify(DEFAULT_STATE));
        for (const key of ['dishes', 'soups', 'waters', 'desserts']) {
          merged[key] = merged[key].map(item => {
            const previous = stored[key].find(saved => saved.id === item.id);
            if (!previous) return item;
            if (typeof previous.active === 'boolean') item.active = previous.active;
            if (stored.catalogVersion >= 3) {
              if (Number.isFinite(previous.price) && previous.price >= 0) item.price = previous.price;
              if (previous.takeoutPrice === null || Number.isFinite(previous.takeoutPrice) && previous.takeoutPrice >= 0) item.takeoutPrice = previous.takeoutPrice;
            }
            if (item.variants && item.variants.some(v => v.label === previous.selectedVariant)) {
              item.selectedVariant = previous.selectedVariant;
            }
            return item;
          });
          merged[key].push(...stored[key].filter(saved => !merged[key].some(item => item.id === saved.id)));
        }
    const display = stored.display || {};
    merged.display = {
      brightness: [1, 2, 3, 4].includes(display.brightness) ? display.brightness : 1,
      textSize: [1, 1.15, 1.3].includes(display.textSize) ? display.textSize : 1
    };
    return merged;
  }

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (validState(stored)) {
        const merged = normalize(stored);
        if (JSON.stringify(merged) !== JSON.stringify(stored)) save(merged);
        return merged;
      }
    } catch (error) {
      console.warn('No se pudo leer el menú guardado.', error);
    }
    const initial = JSON.parse(JSON.stringify(DEFAULT_STATE));
    save(initial);
    return initial;
  }

  function dishImage(dish) {
    const variant = (dish.variants || []).find(item => item.label === dish.selectedVariant);
    return variant && variant.img || dish.img;
  }
  window.FondaMenu = { load, save, dishImage, normalize };
})();
