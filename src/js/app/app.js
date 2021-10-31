const selector = (elment) => document.querySelector(elment);
const creator = (element) => document.createElement(element);

/* ================ Class ================ */
class Interface {
    showErr(text) {
        let elementParent = selector('.time');
        let div = creator('div');
        div.classList.add('err');
        div.textContent = text;

        elementParent.appendChild(div)
        setTimeout(() => {
            div.remove()
        }, 3500);
    }
}

/* ================ Global Varialbes  ================ */
const ui = new Interface();
let form = selector('#form');
let DB;
let buttonOrder = selector('#calculator-mount')
let client = {
    table: '',
    hours: '',
    orden: [],
}

/* ================ Functions ================ */
const newClient = () => {
    let table = selector('#table').value;
    let hours = selector('#hours').value;
    let spinner = selector('.spinner');

    // Check if there are empty fields
    const empatyFields = [table, hours].some( field => field === '' );

    if (empatyFields) {
        ui.showErr('Todos los campos son obligatorios')
        return
    }

    spinner.classList.remove('d-none')
    client = { ...client, table, hours }
    setTimeout(() => {
        spinner.classList.add('d-none')
        form.reset()
        window.open('./../../facturacion.html', '_blank');
     },2000)
    console.log(client)
}

const createDB = () => {
    const database = window.indexedDB.open('sales', 1);

    database.onerror = () => console.log("No se pudo crear la base de datos");
    database.onsuccess = () => {
        DB = database.result;
        console.log("Database ok")
    }

    database.onupgradeneeded = (e) => {
        const db = e.target.result;
        const objectStore = db.createObjectStore('sales', {
            keyPath: 'id',
            autoincremet: true,
        })

        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('precio', 'precio', { unique: false });
        objectStore.createIndex('categoria', 'categoria', { unique: false });
    }
}

export const initAPP = () => {
    document.addEventListener('DOMContentLoaded', () => {
        createDB();
        buttonOrder.addEventListener('click', newClient)
    })
}