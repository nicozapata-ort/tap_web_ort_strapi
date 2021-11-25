#Strapi personalizado para TAP

Agregar las modificaciones en las variables de entorno, bien sea con un archivo .env o por otro método utilizando las siguientes descripciones: 

DATABASE_HOST: IP o URL de donde este hosteada la base de datos.
DATABASE_PORT: puerto a utilizar para conectarse a la base de datos.
DATABASE_USERNAME: usuario que será utilizado para acceder a la base de datos.
DATABASE_PASSWORD: contraseña del usuario anterior definido para acceder a la base de datos.
DATABASE_SCHEMA: string utilizado para el esquema de la base de datos.
DATABASE_NAME: nombre de la base de datos.
URL_LANDING: IP o URL donde esté hosteada la landing, incluyendo de ser necesario el puerto.
HOST: IP o URL donde estará hosteado el servidor.
PORT: Puerto que será utilizado para el servidor.
ADMIN_JWT_SECRET: string alfanumérico que será utilizado para codificar los tokens JWT.

Una vez se hayan creado las tablas en la base de datos, buscar la tabla participantes y verificar que los campos phone y dni tengan como tipo de datos bigint y no int, en caso de que no sea así, cambiarlos para que queden en bigint.


#Manuales
En la carpeta principal se encuentran tanto el Manual de Usuario y el Manual del Programador con todas las especificaciones del sistema.
