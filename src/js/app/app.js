/* ================ Global Functions  ================ */
export const selector = (elment) => document.querySelector(elment);
export const creator = (element) => document.createElement(element);
/* ================ Global Variables  ================ */
let DB;
let form = selector('#form');
let buttonOrder = selector('#calculator-mount');
let buttonFinish = selector('#finish-orden');
let spinner = selector('.spinner');
/* ============ Object Global =========*/
let client = {
    table: '',
    hours: '',
    orden: [],
}
/* ================ Class ================ */
class Interface {
    clearHTML(div) {
        while (div.firstChild) {
            div.removeChild(div.firstChild)
        }
    }
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
        let menuPizza = selector('#content-pizza');
        let menuEmp = selector('#content-empanadas');
        let menuDrink = selector('#content-drink');
        // scripting
        datas.forEach(data => {
            const { nombre, precio, img, id, categoria } = data;
            let col = creator('div');
            let card = creator('div');
            let divImg = creator('div')
            let image = creator('img');
            let card_body = creator('div');
            let h5 = creator('h5');
            let divCount = creator('div')
            let input = creator('input')
            let p = creator('p');

            col.id = `${id}`
            col.classList.add('col', 'shadow', 'rounded-3');
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
            input.id = `${id}`;
            input.placeholder = '0'

            // ADD count and menu a order
            input.onchange = () => {
                const count = Number(input.value)
                buttonFinish.disabled = false;
                this.productCalculator({...data, count })
            }

            card_body.appendChild(h5);
            divCount.appendChild(p);
            divCount.appendChild(input);
            card_body.appendChild(divCount)
            divImg.appendChild(image)
            card.appendChild(divImg);
            card.appendChild(card_body);
            col.appendChild(card);


        // according to its category, place each item on the menu
            switch (categoria) {
                case 'Pizzas':
                    menuPizza.appendChild(col)
                    break;
                case 'Empanadas':
                    menuEmp.appendChild(col)
                    break;
                case 'Bebidas':
                    menuDrink.appendChild(col)
                    break;
            }
        })
    }
    productCalculator(product) {
        let { orden } = client;

        // if the item is in the array, update the quantity
        if (product.count > 0) {

            // check if element exists in array
            if (orden.some(article => article.id === product.id)) {
                // if it exists, we update the quantity
                const ordenUpdate = orden.map(article => {
                    if (article.id === product.id) {
                        article.count = product.count;
                    }
                    return article;
                });
                // add new array an client.orden
                client.orden = [...ordenUpdate]
            } else {
                // the artible does not existm so we add it
                client.orden = [...orden, product];
            }
        } else {
            // filter items tha are not equal
            const result = orden.filter(article => article.id !== product.id);
            // take a copy and assigns it to the orden array
            client.orden = [...result]
        }
        let modal = selector('.modal-body');
        this.clearHTML(modal);
        
        // disable button the order if array.length = 0
        if(client.orden.length === 0) buttonFinish.disabled = true;


        this.showTikect(client);
    }

    // create a ticket orden
    showTikect(product) {
        const { table, hours, orden } = product;
        let total = 0;
        let time = selector('#time-modal');
        let tableOrden = selector('#table-ticket');
        let modal = selector('.modal-body');
        let mount = selector('#mount')

        tableOrden.textContent = `Mesa: N°${table}`;
        time.textContent = `Hora: ${hours}`;

        // ul
        let ul = creator('ul');
        ul.classList.add('list-group')

        orden.forEach(article => {
            const { nombre, count, precio } = article

            let li = creator('li')
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between')
            // p ==> name of products
            let p = creator('p');
            p.classList.add('card-text', 'w-50');
            p.textContent = nombre


            // small of the count
            let smallCant = creator('small')
            smallCant.classList.add('card-time')
            smallCant.textContent = `${count}x`
            
            // small of price
            let small = creator('small');
            small.classList.add('card-time');
            small.textContent = `$  ${precio}`
            
            li.appendChild(p)
            li.appendChild(smallCant)
            li.appendChild(small)
            // add element p and small
            ul.appendChild(li)
            
            total = total + this.totalPrice(count, precio)

        })
        mount.textContent = `$${total}`
        modal.appendChild(ul)

    }

    // return mount total of an orden
    totalPrice(cant, price) {
        return cant * price;
    }
}

/* ================ Instance Class  ================ */
export const ui = new Interface();
/* ================ Functions ================ */
// show MENU-API
const showMenuAPI = (datas) => {
    let buy = selector('.buyOrder');
    
    ui.showAPI(datas);
    
    // buy confirmed and create DB
    buy.addEventListener('click', () => {
        let ul = selector('.list-group');

        // check length of the element ul, if there are elements create DB 
        if (ul.childNodes.length) {
            let transaction = DB.transaction(['sales'], 'readwrite');
            let objectStore = transaction.objectStore('sales');
            let alert = selector('#alert-success')
            client.id = Date.now();
            // add cliente in IndexdDB
            objectStore.add(client)
            transaction.oncomplete = () => console.log("Completo")

            
            // alert success
            alert.classList.remove('visually-hidden');
            setTimeout(() => {
                alert.classList.add('visually-hidden');
                // refresh 
                window.location.reload();
            }, 2500)
        }
    })
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
        objectStore.createIndex('table', 'table', { unique: false });
        objectStore.createIndex('hours', 'hours', { unique: false });
        objectStore.createIndex('order', 'order', { unique: false });
    }
}

// active responsive-menu
export const navMenu = () => {
    let menu = selector('.logo-menu');

    menu.addEventListener('click', () => {
        let menu_mobile = selector('.nav-menu');
        menu_mobile.classList.toggle('visually-hidden')
    })
}
export const initAPP = () => {
    document.addEventListener('DOMContentLoaded', () => {
        createDB();
        buttonOrder.addEventListener('click', newClient);
        navMenu()
    })
}