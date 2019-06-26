function getCard(objUserData) {
  // Función que sirve para crear la card, según valor recibido por argumento
  return `
	<div id="element-${objUserData["employee_id"]}" class="row justify-content-md-center card-user">
		<div class="col col-lg-4">
			<div class="card">
				<h5 class="card-header user-name" mi-nombre="${objUserData['employee_name']}"><i class="fas fa-user-tag"></i> USERNAME: ${objUserData["employee_name"]}</h5>
				<div class="card-body">
					<h5 class="card-title" id="user-salary"><i class="fas fa-money-check-alt"></i> Salary: ${objUserData["employee_salary"]} euros</h5>
					<p class="card-text" id="user-age"><i class="fas fa-glass-cheers"></i> Age: ${objUserData["employee_age"]}</p>
					<p class="card-text" id="user-id"><i class="fas fa-passport"></i> ID: ${objUserData["employee_id"]}</p>
				</div>
			</div>
		</div>
		<div class="col-md-auto align-buttons">
			<a href="#" class="btn btn-primary edit-user-button" data-toggle="modal" data-target="#edituser-modal" onclick="document.getElementById('edituser-id').value = ${objUserData['employee_id']};document.getElementById('edituser-name').value = '${objUserData['employee_name']}';document.getElementById('edituser-age').value = '${objUserData['employee_age']}';document.getElementById('edituser-salary').value = '${objUserData['employee_salary']}'"><i class="fas fa-user-edit"></i> Edit</a><br>
			<!-- document.getElementById('deleteuser-id').value = ${objUserData['employee_id']} coje el valor de ID que existía ya en la card elegida y lo mete como value del input -->
			<a href="#" class="btn btn-primary" data-toggle="modal" data-target="#deleteuser-modal" onclick="document.getElementById('deleteuser-id').value = ${objUserData['employee_id']}"><i class="fas fa-user-slash"></i> Delete</a>
		</div>
	</div>
	`;
}

function loadUsers() {
  // Carga todos los employees de la API
  $.get('https://35.177.4.218:3000/employees', createUsersIndex);
}

function createUsersIndex(data) {
  // Crea la card por cada employee
  const objUserData = data; //JSON.parse(data);//ya esta parseado
  let dataReverse = objUserData.reverse();
  for (var i = 0; i < dataReverse.length; i++) {
    const row = document.querySelectorAll('#user-card')[0];
    row.appendChild(document.createElement('div')); // Crea un div vacio y en este se trabaja
    const userDataCard = document.querySelectorAll('#user-card > div:last-child')[0]; // div:last-child es el div que se ha creado
		// Creamos la card con la función getCard
		userDataCard.innerHTML = getCard(dataReverse[i]);
  }
}

function uploadNewUserData() {
  // Función para hacer una llamada post y publicar el user en la API
  let newUserName = document.querySelector('#newuser-name').value;
  let newUserSalary = document.querySelector('#newuser-salary').value;
  let newUserAge = document.querySelector('#newuser-age').value;
  var requester = new XMLHttpRequest();
  requester.onreadystatechange = function() {
    if (this.readyState != 4) {
      return
    }
    if (this.status == 200) {
      var objUserData = JSON.parse(this.responseText);
      const editAlertPos = document.querySelectorAll('#user-card')[0];
      const editAlertCont = `<div class="alert alert-success" role="alert" id="new-alert"> The user <b>${objUserData["employee_name"]}</b> was <b>created</b> successfully</div>`;
      const position = "beforebegin";
      editAlertPos.insertAdjacentHTML(position, editAlertCont);
      setTimeout(function() {
        document.querySelector('#new-alert').remove();
      }, 3000);
      getNewUser(objUserData);
			// Función que crea la card para un usuario nuevo
    }
  }
  requester.open("POST", "http://35.177.4.218:3000/create", true);
  requester.setRequestHeader('Content-Type', 'application/json');
  requester.send(JSON.stringify({
    "name": `${newUserName}`,
    "salary": `${newUserSalary}`,
    "age": `${newUserAge}`
  }));
}

// BIND - Crear un nuevo user y posteriormente crear una nueva card con ese user
const clickNewUserButton = document.querySelector('#newuser-submit-button');
clickNewUserButton.addEventListener('click', () => {
  uploadNewUserData();
	// Ejecutamos la función para subir los datos con una llamada POST
  document.querySelector('#newuser-name').value = '';
  document.querySelector('#newuser-age').value = '';
  document.querySelector('#newuser-salary').value = '';
});

function getNewUser(objUserData) {
  // 	Función para crear un nuevo usuario con el botón add new user
  console.log(objUserData);
  const row = document.querySelectorAll('#user-card')[0];
  // Crea un div vacio y en este se trabaja
  row.appendChild(document.createElement('div'));
  const userDataCard = document.querySelectorAll('#user-card > div:first-child')[0]; // div:last-child es el div que se ha creado
  const position = "afterbegin";
  // Insertar la card justo debajo de la card creada
  userDataCard.insertAdjacentHTML(position, getCard(objUserData));
}

function callUserData() {
  // Llama a la API para obtener el usuario elegido con el ID
  const userId = $('#calluser-id').val();
  console.log(userId);
  $.get('http://35.177.4.218:3000/employee/' + userId, function(evento) {
    createCardUser;
		// Función para crear la card del nuevo usuario
  });
}

function createCardUser(data) {
  // Crea la card del usuario elegido con el ID
  const objUserData = JSON.parse(data);
  console.log(objUserData);
  const row = document.querySelectorAll('#user-card')[0];
  row.appendChild(document.createElement('div')); // Crea un div vacio y en este se trabaja
  const userDataCard = document.querySelectorAll('#user-card > div:first-child')[0]; // div:last-child es el div que se ha creado
  userDataCard.innerHTML = getCard(objUserData);
}
// BIND - Ejecuta la petición a la API al hacer click en el botón del modal call user
const clickGetUserButton = document.querySelector('#calluser-button');
clickGetUserButton.addEventListener('click', callUserData);

function updateUserData(userId) {
  /*
  Función para hacer una llamada PUT para actualizar los datos del usuario
  */
  let newUserName = document.querySelector('#edituser-name').value;
  let newUserSalary = document.querySelector('#edituser-salary').value;
  let newUserAge = document.querySelector('#edituser-age').value;
  userId = document.querySelector('#edituser-id').value;
  console.log(userId);
  var requester = new XMLHttpRequest();
  requester.onreadystatechange = function() {
    if (this.readyState != 4) {
      return
    }
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data)
      const editAlertPos = document.querySelectorAll('#user-card')[0];
      const editAlertCont = `<div class="alert alert-warning" role="alert" id="edit-alert"> The user <b>${newUserName}</b> was <b>updated</b> successfully</div>`;
      const position = "beforebegin";
      editAlertPos.insertAdjacentHTML(position, editAlertCont);
      setTimeout(function() {
        document.querySelector('#edit-alert').remove();
      }, 3000);
      updateUserCard(newUserName, newUserSalary, newUserAge, userId);
    }
  }
  requester.open("PUT", "http://35.177.4.218:3000/update/" + userId, true);
  requester.setRequestHeader('Content-Type', 'application/json');
  requester.send(JSON.stringify({
    "name": `${newUserName}`,
    "salary": `${newUserSalary}`,
    "age": `${newUserAge}`
  }));
}

function updateUserCard(newUserName, newUserSalary, newUserAge, userId) {
  /*
  Editar la card de un usuario registrado
  */
  const row = document.querySelectorAll('#user-card')[0];
  row.appendChild(document.createElement('div')); // Crea un div vacio y en este se trabaja
  const userDataCard = document.querySelectorAll('#user-card > div:first-child')[0];
  userDataCard.innerHTML =
    `
  <div id="element-${userId}" class="row justify-content-md-center card-user">
    <div class="col col-lg-4">
      <div class="card">
        <h5 class="card-header user-name" mi-nombre="${newUserName}"><i class="fas fa-user-tag"></i> USERNAME: ${newUserName}</h5>
        <div class="card-body">
          <h5 class="card-title" id="user-salary"><i class="fas fa-money-check-alt"></i> Salary: ${newUserSalary} euros</h5>
          <p class="card-text" id="user-age"><i class="fas fa-glass-cheers"></i> Age: ${newUserAge}</p>
          <p class="card-text" id="user-id"><i class="fas fa-passport"></i> ID: ${userId}</p>
        </div>
      </div>
    </div>
    <div class="col-md-auto align-buttons">
      <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#edituser-modal" onclick="document.getElementById('edituser-id').value = ${userId}"><i class="fas fa-user-edit"></i> Edit</a><br>
      <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#deleteuser-modal" onclick="document.getElementById('deleteuser-id').value = ${userId}"><i class="fas fa-user-slash"></i> Delete</a>
    </div>
  </div>
  `;
}

// BIND - editar la card de un usuario
// Llama a la función editUserData para eliminar el usuario de la API
const clickEditUserButton = document.querySelectorAll('#edituser-button')[0];
clickEditUserButton.addEventListener('click', function(evento) {
  // edituser-id es el valor que aparece en el input, lo coge previamente del userId
  var id = document.getElementById('edituser-id').value;
  // Con replaceWith realmente eliminamos el div original porque es sustituido por contenido vacio
  updateUserData(id);
  document.querySelector('#edituser-name').value = '';
  // document.querySelector("#element-" + id + ".user-name").getAttribute("mi-nombre");
  document.querySelector('#edituser-age').value = '';
  document.querySelector('#edituser-salary').value = '';
  document.querySelector('#edituser-id').value = '';
  $('#element-' + id).replaceWith('');
});

function deleteUserData() {
  /*
  Función para eliminar el usuario en la API
  */
  let userId = document.querySelector('#deleteuser-id').value;
  console.log(userId);
  var requester = new XMLHttpRequest();
  requester.onreadystatechange = function() {
    if (this.readyState != 4) {
      return
    }
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      const deleteAlertPos = document.querySelectorAll('#user-card')[0];
      const deleteAlertCont = `<div class="alert alert-danger" role="alert" id="delete-alert">The user <b>${userId}</b> was <b>deleted</b> successfully</div>`;
      const position = "afterbegin";
      deleteAlertPos.insertAdjacentHTML(position, deleteAlertCont);
      setTimeout(function() {
        document.querySelector('#delete-alert').remove();
      }, 3000);
    }
  }
  requester.open("DELETE", "http://35.177.4.218:3000/delete/" + userId, true);
  requester.send();
}

// BIND - eliminar la card de un usuario
// Llama a la función deleteUserData para eliminar el usuario de la API
// El innerhtml pone al div vacio
const clickDeleteUserButton = document.querySelectorAll('#deleteuser-button')[0];
clickDeleteUserButton.addEventListener('click', function(event) {
  // deleteuser-id es el valor que aparece en el input, lo coge previamente del objUserData['id']
  var id = document.getElementById('deleteuser-id').value;
  document.querySelectorAll('#element-' + id)[0].innerHTML = "";
  deleteUserData(id);
});

loadUsers();

//
