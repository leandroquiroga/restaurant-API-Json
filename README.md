# Generador de tikect 
Es aplicacion se basa en consumir informacion desde una API REST (creada con JSON-Server ) para mostrar informacion del menu de un restaurante que cierra el pedido a una mesa. Una vez que se colocamos el numero de la mesa y la hora en la que se cierra podemos indicar que pidio el cliente y generarle el un ticket de compra con la informacion detallada de lo que consumio(cantidad de pedidos, precio por pedido y total a pagar)

# Construido con 🛠️
* HTML5
* CSS3
* JavaScript
* Bootstrap
* JSON Server
* IndexdDB

# Funcionalidades ⚙️
## Validacion: 
Esta validacion consiste en guardar los valores en un arreglo con la condicion que los campos no esten vacios. 

## Base de datos 
La base de datos esta creada con IndexdDB con la intencion de que por cada ticket que generemos estos datos se guarden en la base de datos del navegador y luego lo podramos mostrar en facturacion para llevar un control de todos los tikeck generados con respectiva informacion 

## API Rest con JSON-server 
Esta API contiene informacion de menu del restaurante, nombre, precio, id, y una imagen para luego mostrarla para realizar el cierre de mesa.

## Modal Ticket
Este modal se activa cuando tenemos al menos un pedido en nuestro arreglo de pedidos, en caso contrario no podemos ver la informacion del pedido. Nos permite generar el tikect una vez confirmado para que se guarde en nuestra base de datos. 

## Lista de menu 
La lista de menu se trae desde la API REST de manera ordenada por cada seccion. 


# Modo de uso 
```bash

# Clone this repository
$ git clone https://github.com/leandroquiroga/restaurant-API-Json

# Build the app
$ npm run build

# Run the app
$ npm run start

#Run the API Rest 
$ json-server --watch db.json --port 4000

```

# Contacto 📫
- [Linkedin](https://www.linkedin.com/in/leanquiroga95/)
- [Frontend Mentor](https://www.frontendmentor.io/profile/leandroquiroga)
- [Email](mailto:leandroquiroga9514@gmail.com)

# Autor 👤
Realizado con ❤️ por [Leandro Quiroga](https://github.com/leandroquiroga);