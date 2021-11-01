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

    showAPI(datas) {
        let contentResult = selector('#content');
    
        // scripting
        datas.forEach(data => {
            const { nombre, precio, img, id } = data;
            let col = creator('div');
            let card = creator('div');
            let divImg = creator('div')
            let image = creator('img');
            let card_body = creator('div');
            let h5 = creator('h5');
            let divCount = creator('div')
            let input = creator('input')
            let p = creator('p');
    
            col.classList.add('col');
            card.classList.add('card');
            card.style = 'width: 20rem;'
            divImg.classList.add('content-img', 'p-2')
            image.classList.add('card-img-top', 'img');
            card_body.classList.add('card-body');
            h5.classList.add('card-title');
            divCount.classList.add('d-flex', 'p-1', 'flex-row', 'justify-content-between', 'align-items-center')
            p.classList.add('card-text', 'mb-0');
            input.classList.add('p-1', 'text-center', 'input')
            input.style = 'width: 3rem;'
    
            image.src = `${img}`;
            h5.textContent = `${nombre}`;
            p.textContent = `$${precio}`
            input.type = 'number';
            input.min = '0';
            input.id = `producto-${id}`;
            input.placeholder = '0'

            card_body.appendChild(h5);
            divCount.appendChild(p);
            divCount.appendChild(input);
            card_body.appendChild(divCount)
            divImg.appendChild(image)
            card.appendChild(divImg);
            card.appendChild(card_body);
            col.appendChild(card)
            contentResult.appendChild(col)
    
        })
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
// show MENU-API
const showMenuAPI = (datas) => {
    ui.showAPI(datas)
}

// consult the API
const consultAPI = () => {
    const url = "http://localhost:4000/menu";
    fetch(url)
        .then(response => response.json())
        .then(result => showMenuAPI(result))
        .catch(err => console.log(err))
}

// add new client 
const newClient = () => {
    let table = selector('#table').value;
    let hours = selector('#hours').value;
    let spinner = selector('.spinner');
    let menu = selector('.menu')

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
        menu.classList.remove('d-none')
        form.reset();
        consultAPI();
        // window.open('./../../facturacion.html', '_blank');
    },2000)
}

// create database with IndexdDB
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