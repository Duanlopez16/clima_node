import fs from 'fs';
import axios from "axios";


class Busquedas {


    db_path = './database/data_base.json';
    constructor() {
        this.historial = [];
        this.leer_db();

    }

    get historial_capitalizado() {
        if (this.historial.length !== 0) {
            return this.historial.map((lugar, index) => {
                let palabras = lugar.split(' ');
                palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
                const indentificador = `${index +1}.`.green;
                return `${indentificador} ${palabras.join(' ')}`;
            });
        } else {
            return null;
        }
    }

    get get_paramas_location() {
        return {
            'key': process.env.MAP_KEY,
            'limit': process.env.LIMIT_MAP,
            'format': 'json'
        }
    }

    async ciudad(lugar = '') {
        try {
            let params = this.get_paramas_location;
            params['q'] = lugar;
            const intancie = axios.create({
                baseURL: `https://us1.locationiq.com/v1/search`,
                params: params
            });

            const response = await intancie.get();

            return response.data.map(lugar => ({
                id: lugar.place_id,
                name: lugar.display_name,
                lat: lugar.lat,
                lon: lugar.lon
            }));
        } catch (error) {
            console.log(error);
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async clima_ciudad(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon }
            })

            const response = await instance.get();

            const { weather, main } = response.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregar_historial(lugar = '') {
        if (!this.historial.includes(lugar.toLocaleLowerCase())) {
            this.historial.unshift(lugar.toLocaleLowerCase());
            this.guardar_bd();
        }
    }


    guardar_bd() {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.db_path, JSON.stringify(payload));
    }

    leer_db() {
        if (fs.existsSync(this.db_path)) {
            let data = fs.readFileSync(this.db_path, { encoding: 'utf-8' });
            if (data) {
                data = JSON.parse(data);
                this.historial = data.historial;
            }
        }
    }
}

export { Busquedas }