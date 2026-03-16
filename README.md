#  DAC - CONTPAQi Comercial SP

## Microservicio auth-ms

Microservicio que permite la gestion de usuarios y el control de la autenticacion

## Instrucciones de implementación

### Instalación de dependencias.


> npm install

### Enviroment

- PORT=numero de puerto 
- DATABASE_URL="postgresql://<usuario>:<contraseña>@<servidor>:<puerto>/<nombre_base_de_datos>?schema=public"
- VALID_EMAIL_DOMAINS="ejm1.com,ejm2.com"
- VALID_EMAIL_DOMAINS="ejm1.com,ejm2.com"
- TZ='zona horaria'
- FILEDIRECTORY= 'nombre del directorio'
- PROFILE_PICTURE_DIRECTORY ='nombre del directorio'

### Ejecucion del proyecto para developers

Se tiene generar primero el modelo de prisma
> npx prisma generate

Instruccion para levantar el microservice
> npm run start:dev