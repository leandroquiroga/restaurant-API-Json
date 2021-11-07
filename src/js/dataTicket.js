import { creator, navMenu, selector, ui } from "./app/app";

let db;

const loadTicket = () => {
    let content = selector('#content');

    // cheak if indexDB that open
    if (window.indexedDB.open('sales', 1)) {
        let request = indexedDB.open('sales', 1);

        request.onerror = () => console.log('No se pudo conectar');

        // conection success with IndexdDB and to step through the data with the cursor
        request.onsuccess = () => {
            db = request.result;

            let objectStore = db.transaction('sales').objectStore('sales')
            objectStore.openCursor().onsuccess = (e) => {
                let cursor = e.target.result


                if (cursor) {
                    const { table, hours, orden, id } = cursor.value;
                    let mount = 0;
                    let card = creator('div');
                    let h3 = creator('h3')
                    let divHeader = creator('div');
                    let smallTable = creator('small');
                    let smallHour = creator('small');
                    let total = creator('div');
                    let smallText = creator('small');
                    let smallMount = creator('small');
                    let divContent = creator('div');
                    let ul = creator('ul');

                    card.classList.add('order', 'shadow', 'rounded-3', 'p-2', 'd-flex', 'row', 'justify-content-center');

                    // description ID ticket order
                    h3.classList.add('card-title');
                    h3.textContent = `Ticket : ${id}`

                    // description number table and hours 
                    divHeader.classList.add('d-flex', 'p-2', 'col' ,'justify-content-between');
                    smallTable.classList.add('table-ticket');
                    smallHour.classList.add('time-modal');

                    smallTable.textContent = `Mesa: N°${table}`;
                    smallHour.textContent = `Hora: ${hours}`
                    divHeader.appendChild(smallHour);
                    divHeader.appendChild(smallTable);

                    // ticket order
                    divContent.classList.add('d-flex', 'justify-contnet-center', 'row', 'p-2', 'border-botton')
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
                        mount = mount + ui.totalPrice(count, precio)
                    })
                    divContent.appendChild(ul);
                    // total mount 
                    total.classList.add('d-flex', 'px-4', 'justify-content-between', 'align-items-center' , 'p-2', 'border');
                    smallText.classList.add('text-mount');
                    smallText.textContent = 'Total: ';

                    smallMount.classList.add('text-mount');
                    smallMount.textContent = `$${mount}`

                    total.appendChild(smallText);
                    total.appendChild(smallMount);

                    // card
                    card.appendChild(h3)
                    card.appendChild(divHeader)
                    card.appendChild(divContent)
                    card.appendChild(total)


                    content.appendChild(card)

                    // next cursor
                    cursor.continue()
                }
            }
        }
    }
}

loadTicket()
navMenu()