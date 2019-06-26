<h1>DEMO PERSONNEL MANAGEMENT</h1>

![Human Resources Management](image.jpg)

<h2>Software de gestión de personal FullStack</h2>

La propuesta de este proyecto se basa en la creación de una web **API FullStack**. En la **Master Branch** está publicado el frontend y en la **Backend Branch** está toda la estructura backend creada en NodeJS y Express. Adicionalmente hacemos una llamada a la Base de Datos con MySQL publicada en servidores AWS.

Las tecnologías utilizadas en Frontend son:
<ul>
<li> HTML 5</li>
<li> CSS 3</li>
<li> JavaScript</li>
<li> JQuery</li>
<li> Bootstrap</li>
</ul>

Las tecnologías utilizadas en Backend son:
<ul>
<li> NodeJS</li>
<li> Express</li>
<li> MySQL</li>
<li> RDS (AWS Services)</li>
</ul>

Para visualizar el listado completo de los usuarios que conforman la web API, se realiza una <b>petición GET</b>, para que posteriormente se crea una card por cada usuario.

Al solicitar la creación de un nuevo usuario, hacemos primeramente una <b>petición POST</b> a la web API y posteriormente creamos la card del nuevo usuario. La card más reciente siempre aparecerá en la parte superior de la lista.

Al realizar una llamada con el botón "edit", hacemos primeramente una <b>petición PUT</b> y que a través de una ejecución del modal vía Bootstrap, tenemos oportunidad de editar el usuario y así sustituir la card anterior por una nueva con la información actualizada.

Se puede hacer una <b>petición DELETE</b> donde podemos elminar al usuario que se ha solicitado, a la par se elimina la card de DOM y se genera un Alert de Boostrap para indicar la acción. Esta acción tiene un doble check para evitar posibles errores en la eliminación del usuario.

Puedes conocer el funcionamiento de la API a través de su [documentación en formato PDF.](API-documentation.pdf)

Para activar la API se necesita el siguiente comando:
> node app.js
<!--  -->
