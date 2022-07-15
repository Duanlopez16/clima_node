import 'dotenv/config'
import { inquirer_menu, inquirer_pausa, leer_input, listado_lugares } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";


const main = async() => {

    let opt = null;

    const busquedas = new Busquedas();
    do {
        opt = await inquirer_menu();

        switch (opt) {
            case 1:
                const lugar = await leer_input('Ciudad:');
                const ciudades = await busquedas.ciudad(lugar);
                const id_lugar = await listado_lugares(ciudades);
                if (id_lugar !== 0) {
                    const info_lugar = ciudades.find(lugar => lugar.id === id_lugar);
                    busquedas.agregar_historial(info_lugar.name);
                    const clima = await busquedas.clima_ciudad(info_lugar.lat, info_lugar.lon);
                    console.log(clima.min);
                    console.log('\nInformacion de la ciudad\n'.green);
                    console.log(`Ciudad: ${info_lugar.name}`);
                    console.log(`Latitud: ${info_lugar.lat}`);
                    console.log(`Longitud: ${info_lugar.lon}`);
                    console.log('Temperatura:', clima.temp);
                    console.log('Temperatura minima: ', clima.min);
                    console.log('Temperatura maxima: ', clima.max);
                    console.log('Descripcion clima:', clima.desc);
                }
                break;
            case 2:
                const lugares = busquedas.historial_capitalizado;
                if (lugares) {
                    console.log('\n');
                    lugares.forEach((lugar) => {
                        console.log(lugar);
                    });
                } else {
                    console.log('No se encontro historial.');
                }
                break;
        }
        if (opt != 0) {
            await inquirer_pausa();
        }

    } while (opt !=
        0);
}

main();