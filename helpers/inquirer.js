import inquirer from 'inquirer';

import colors from 'colors';

const menu_opts = [{
    type: 'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [{
            value: 1,
            name: `${'1.'.green} Buscar ciudad.`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`
        },
        {
            value: 0,
            name: `${'0.'.red } salir\n`
        }
    ]
}];

const inquirer_menu = async() => {
    console.clear();
    console.log('===================='.green);
    console.log('  Elija una opcion '.green);
    console.log('====================\n'.green);

    const { opcion } = await inquirer.prompt(menu_opts);
    return opcion;
}


const inquirer_pausa = async() => {
    console.log('\n');
    await inquirer.prompt([{
        type: 'input',
        name: 'enter',
        message: `PRESIONE ${'ENTER'.green} PARA CONTINUAR`,
    }]);
}

const leer_input = async(message) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Ingrese un valor';
            }
            return true;
        }
    }];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listado_lugares = async(lugares = []) => {
    if (lugares.length !== 0) {
        const choices = lugares.map((lugar, key) => {
            const name = `${key + 1}. ${lugar.name}`;
            return {
                value: lugar.id,
                name
            }
        });

        choices.unshift({
            value: 0,
            name: `0. Cancelar`.red
        });
        const preguntas = [{
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }];

        const { id } = await inquirer.prompt(preguntas);
        return id;
    } else {
        return null;
    }
}

const confirmar = async(message) => {
    const pregunta = [{
        type: 'confirm',
        name: 'ok',
        message
    }];

    const { ok } = await inquirer.prompt(pregunta);
    return ok;
}

const listado_tareas_check_box = async(tareas = []) => {
    const choices = tareas.map((tarea, key) => {
        const name = `${key + 1}. ${tarea.desc}`;
        return {
            value: tarea.id,
            name,
            checked: (tarea.completado_en) ? true : false
        }
    });

    const pregunta = [{
        type: 'checkbox',
        name: 'ids',
        message: 'completar tareas',
        choices
    }];
    const { ids } = await inquirer.prompt(pregunta);
    return ids;

}

export {
    inquirer_menu,
    inquirer_pausa,
    leer_input,
    confirmar,
    listado_lugares
}