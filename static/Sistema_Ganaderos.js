// Evento para la pestaña "Crear Ganaderos"
document.getElementById('crearGanaderos').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('contenido').innerHTML = `
        <h2>Crear Ganaderos</h2>
        <form id="crearGanaderoForm" enctype="multipart/form-data">
            <label for="nombre">Nombre:</label><br>
            <input type="text" id="nombre" name="nombre" required><br>
            <label for="apellido">Apellido:</label><br>
            <input type="text" id="apellido" name="apellido" required><br>
            <label for="ci">C.I.:</label><br>
            <input type="text" id="ci" name="ci" required><br>
            <label for="refMarca">RefMarca:</label><br>
            <input type="text" id="refMarca" name="refMarca" required><br>
            <label for="estancia">Estancia:</label><br>
            <input type="text" id="estancia" name="estancia" required><br>
            <label for="imagenMarca">Imagen de la Marca:</label><br>
            <input type="file" id="imagenMarca" name="imagenMarca" accept="image/*" required><br>
            <div id="imagenPreview" class="imagen-preview"></div><br>
            <input type="submit" value="Registrar">
        </form>
    `;

    // Obtener elementos del DOM
    const inputImagen = document.getElementById('imagenMarca');
    const imagenPreview = document.getElementById('imagenPreview');
    const form = document.getElementById('crearGanaderoForm');

    // Función para actualizar la vista previa de la imagen
    function actualizarVistaPrevia(event) {
        const archivo = event.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function(e) {
                imagenPreview.innerHTML = `
                    <img src="${e.target.result}" alt="Vista previa" style="max-width: 200px; max-height: 200px;"/>
                    <button type="button" id="eliminarImagen">Eliminar Imagen</button>
                `;
                // Manejador de evento para eliminar la imagen
                document.getElementById('eliminarImagen').addEventListener('click', function() {
                    inputImagen.value = ''; // Limpia el campo de archivo
                    imagenPreview.innerHTML = ''; // Limpia la vista previa
                });
            };
            lector.readAsDataURL(archivo);
        }
    }

    // Configurar el evento de cambio para el input de archivo
    inputImagen.addEventListener('change', actualizarVistaPrevia);

    // Evento para manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe

        // Obtener los datos del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const ci = document.getElementById('ci').value;
        const refMarca = document.getElementById('refMarca').value;
        const estancia = document.getElementById('estancia').value;

        // Obtener la imagen (si hay una)
        const imagen = document.getElementById('imagenMarca').files[0];
        const imagenSrc = imagen ? URL.createObjectURL(imagen) : '';

        // Crear un objeto de datos del ganadero
        const ganadero = {
            nombre,
            apellido,
            ci,
            refMarca,
            estancia,
            imagen: imagenSrc
        };

        // Obtener datos almacenados en localStorage
        let ganaderos = JSON.parse(localStorage.getItem('ganaderos')) || [];
        ganaderos.push(ganadero);
        localStorage.setItem('ganaderos', JSON.stringify(ganaderos));

        // Limpiar el formulario
        form.reset();
        imagenPreview.innerHTML = '';

        alert('Ganadero registrado exitosamente');
    });
});

// Evento para la pestaña "Ver Ganaderos"
document.getElementById('verGanaderos').addEventListener('click', function(event) {
    event.preventDefault();
    const ganaderos = JSON.parse(localStorage.getItem('ganaderos')) || [];

    if (ganaderos.length === 0) {
        document.getElementById('contenido').innerHTML = '<h2>Ver Ganaderos</h2><p>No hay ganaderos registrados.</p>';
        return;
    }

    document.getElementById('contenido').innerHTML = `
        <h2>Ver Ganaderos</h2>
        <label for="buscar">Buscar:</label>
        <input type="text" id="buscar" placeholder="Buscar por nombre, apellido o C.I.">
        <table id="ganaderosTable">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>C.I.</th>
                    <th>RefMarca</th>
                    <th>Estancia</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${ganaderos.map((ganadero, index) => `
                    <tr>
                        <td>${ganadero.nombre}</td>
                        <td>${ganadero.apellido}</td>
                        <td>${ganadero.ci}</td>
                        <td>${ganadero.refMarca}</td>
                        <td>${ganadero.estancia}</td>
                        <td><img src="${ganadero.imagen}" alt="Imagen de Marca" style="max-width: 100px; max-height: 100px;"/></td>
                        <td>
                            <button class="editar" data-index="${index}">Editar</button>
                            <button class="eliminar" data-index="${index}">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Funcionalidad de búsqueda
    document.getElementById('buscar').addEventListener('input', function(event) {
        const query = event.target.value.toLowerCase();
        const rows = document.querySelectorAll('#ganaderosTable tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const textContent = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');
            row.style.display = textContent.includes(query) ? '' : 'none';
        });
    });

    // Funcionalidad de editar
    document.querySelectorAll('.editar').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const ganadero = ganaderos[index];
            document.getElementById('contenido').innerHTML = `
                <h2>Editar Ganadero</h2>
                <form id="editarGanaderoForm" enctype="multipart/form-data">
                    <label for="nombre">Nombre:</label><br>
                    <input type="text" id="nombre" name="nombre" value="${ganadero.nombre}" required><br>
                    <label for="apellido">Apellido:</label><br>
                    <input type="text" id="apellido" name="apellido" value="${ganadero.apellido}" required><br>
                    <label for="ci">C.I.:</label><br>
                    <input type="text" id="ci" name="ci" value="${ganadero.ci}" required><br>
                    <label for="refMarca">RefMarca:</label><br>
                    <input type="text" id="refMarca" name="refMarca" value="${ganadero.refMarca}" required><br>
                    <label for="estancia">Estancia:</label><br>
                    <input type="text" id="estancia" name="estancia" value="${ganadero.estancia}" required><br>
                    <label for="imagenMarca">Imagen de la Marca:</label><br>
                    <input type="file" id="imagenMarca" name="imagenMarca" accept="image/*"><br>
                    <div id="imagenPreview" class="imagen-preview">
                        ${ganadero.imagen ? `<img src="${ganadero.imagen}" alt="Vista previa" style="max-width: 200px; max-height: 200px;"/>` : ''}
                    </div><br>
                    <input type="submit" value="Guardar Cambios">
                </form>
            `;

            // Obtener elementos del DOM
            const inputImagen = document.getElementById('imagenMarca');
            const imagenPreview = document.getElementById('imagenPreview');
            const form = document.getElementById('editarGanaderoForm');

            // Función para actualizar la vista previa de la imagen
            function actualizarVistaPrevia(event) {
                const archivo = event.target.files[0];
                if (archivo) {
                    const lector = new FileReader();
                    lector.onload = function(e) {
                        imagenPreview.innerHTML = `
                            <img src="${e.target.result}" alt="Vista previa" style="max-width: 200px; max-height: 200px;"/>
                            <button type="button" id="eliminarImagen">Eliminar Imagen</button>
                        `;
                        // Manejador de evento para eliminar la imagen
                        document.getElementById('eliminarImagen').addEventListener('click', function() {
                            inputImagen.value = ''; // Limpia el campo de archivo
                            imagenPreview.innerHTML = ''; // Limpia la vista previa
                        });
                    };
                    lector.readAsDataURL(archivo);
                }
            }

            // Configurar el evento de cambio para el input de archivo
            inputImagen.addEventListener('change', actualizarVistaPrevia);

            // Evento para manejar el envío del formulario
            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Evita que el formulario se envíe

                // Obtener los datos del formulario
                const nombre = document.getElementById('nombre').value;
                const apellido = document.getElementById('apellido').value;
                const ci = document.getElementById('ci').value;
                const refMarca = document.getElementById('refMarca').value;
                const estancia = document.getElementById('estancia').value;

                // Obtener la imagen (si hay una)
                const imagen = document.getElementById('imagenMarca').files[0];
                const imagenSrc = imagen ? URL.createObjectURL(imagen) : ganadero.imagen;

                // Crear un objeto de datos del ganadero
                const ganaderoActualizado = {
                    nombre,
                    apellido,
                    ci,
                    refMarca,
                    estancia,
                    imagen: imagenSrc
                };

                // Actualizar los datos en localStorage
                ganaderos[index] = ganaderoActualizado;
                localStorage.setItem('ganaderos', JSON.stringify(ganaderos));

                // Regresar a la vista de "Ver Ganaderos"
                document.getElementById('verGanaderos').click();
            });
        });
    });

    // Funcionalidad de eliminar
    document.querySelectorAll('.eliminar').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            if (confirm('¿Estás seguro de que deseas eliminar este ganadero?')) {
                // Eliminar el ganadero
                ganaderos.splice(index, 1);
                localStorage.setItem('ganaderos', JSON.stringify(ganaderos));
                document.getElementById('verGanaderos').click(); // Actualiza la vista
            }
        });
    });
});
