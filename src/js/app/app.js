let DB;

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
    })
}