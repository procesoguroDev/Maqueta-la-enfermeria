   /* Modal estado */ 
   let filaSeleccionada = null;

    function abrirModalEstado(boton) {
        filaSeleccionada = boton.closest('tr');
        document.getElementById('modalActualizarEstado').style.display = 'flex';
    }

    function cerrarModalEstado() {
        document.getElementById('modalActualizarEstado').style.display = 'none';
        document.getElementById('Estado').value = '';
        filaSeleccionada = null;
    }

    function guardarNuevoEstado() {
        const estado = document.getElementById('Estado').value;

        if (!estado) {
            alert('Selecciona el estado.');
            return;
        }

        const status = filaSeleccionada.querySelector('.status-name');
        status.textContent = estado;

        cerrarModalEstado();
    }
/* Modal envio de resultados */
    function abrirModalEmail(boton) {
        document.getElementById('modalEnviarResultados').style.display = 'flex';
    }

    function cerrarModalEnvio() {
        document.getElementById('modalEnviarResultados').style.display = 'none';
        document.getElementById('emailDestino').value = '';
    }
    function enviarResultados() {
        const email = document.getElementById('emailDestino').value;

     if (!email) {
        mostrarToast('Selecciona el E-mail de destino.', 'warning');
        return;
        }

        cerrarModalEnvio();

     mostrarToast('Archivo enviado.', 'success');
}
/* FunciÓn toast */   
 function mostrarToast(mensaje, tipo = 'success') {
    const contenedor = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');

        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

function mostrarArchivoSeleccionado(input) {
    const archivoNombre = input.closest('td').querySelector('.archivo-nombre');

    if (input.files.length > 0) {
        archivoNombre.textContent = input.files[0].name;
        mostrarToast('Archivo cargado correctamente.', 'success');
    } else {
        archivoNombre.textContent = 'Sin archivo';
    }
}
/* Modal estudio */ 
let filaEstudioSeleccionada = null;

function abrirModalEstudios(boton) {
    filaEstudioSeleccionada = boton.closest('tr');
    cargarEstudiosParaEliminar();
    document.getElementById('modalEstudios').style.display = 'flex';
}

function cerrarModalEstudios() {
    document.getElementById('modalEstudios').style.display = 'none';
    document.getElementById('nuevoEstudio').value = '';
    document.getElementById('estudioEliminar').value = '';
    filaEstudioSeleccionada = null;
}

function obtenerEstudiosActuales() {
    const estudiosLista = filaEstudioSeleccionada.querySelector('.estudios-lista');
    return estudiosLista.textContent
        .split(',')
        .map(estudio => estudio.trim())
        .filter(estudio => estudio !== '');
}

function guardarEstudios(estudios) {
    const estudiosLista = filaEstudioSeleccionada.querySelector('.estudios-lista');

    if (estudios.length === 0) {
        estudiosLista.textContent = 'Sin estudios';
        return;
    }

    estudiosLista.textContent = estudios.join(', ');
}

function cargarEstudiosParaEliminar() {
    const selectEliminar = document.getElementById('estudioEliminar');
    const estudios = obtenerEstudiosActuales();

    selectEliminar.innerHTML = '<option value="">Selecciona un estudio para quitar</option>';

    estudios.forEach(estudio => {
        if (estudio !== 'Sin estudios') {
            const option = document.createElement('option');
            option.value = estudio;
            option.textContent = estudio;
            selectEliminar.appendChild(option);
        }
    });
}

function agregarEstudio() {
    const estudio = document.getElementById('nuevoEstudio').value;

    if (!estudio) {
        mostrarToast('Selecciona un estudio.', 'warning');
        return;
    }

    let estudios = obtenerEstudiosActuales();

    if (estudios.includes('Sin estudios')) {
        estudios = [];
    }

    if (estudios.includes(estudio)) {
        mostrarToast('Ese estudio ya está agregado.', 'warning');
        return;
    }

    estudios.push(estudio);
    guardarEstudios(estudios);
    cargarEstudiosParaEliminar();

    document.getElementById('nuevoEstudio').value = '';
    mostrarToast('Estudio agregado correctamente.', 'success');
}

function quitarEstudio() {
    const estudio = document.getElementById('estudioEliminar').value;

    if (!estudio) {
        mostrarToast('Selecciona un estudio para quitar.', 'warning');
        return;
    }

    let estudios = obtenerEstudiosActuales();
    estudios = estudios.filter(item => item !== estudio);

    guardarEstudios(estudios);
    cargarEstudiosParaEliminar();

    mostrarToast('Estudio eliminado correctamente.', 'success');
}
function abrirModalHojaConsumo() {
    document.getElementById('modalHojaConsumo').style.display = 'flex';
}

function cerrarModalHojaConsumo() {
    document.getElementById('modalHojaConsumo').style.display = 'none';
    document.getElementById('pacienteConsumo').value = '';
    document.getElementById('formHojaConsumo').style.display = 'none';
}

function obtenerTurno(hora) {
    const horaNumero = Number(hora.split(':')[0]);

    if (horaNumero >= 7 && horaNumero < 15) {
        return 'Matutino';
    }

    if (horaNumero >= 15 && horaNumero < 22) {
        return 'Vespertino';
    }

    return 'Nocturno';
}

function cargarDatosHojaConsumo() {
    const select = document.getElementById('pacienteConsumo');
    const opcion = select.options[select.selectedIndex];

    if (!select.value) {
        document.getElementById('formHojaConsumo').style.display = 'none';
        return;
    }

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().slice(0, 5);

    const filaPaciente = buscarFilaPaciente(select.value);
    const estudios = filaPaciente
        ? filaPaciente.querySelector('.estudios-lista').textContent
        : opcion.dataset.procedimiento;

    document.getElementById('nombrePacienteConsumo').value = select.value;
    document.getElementById('fechaNacimientoConsumo').value = opcion.dataset.nacimiento;
    document.getElementById('procedimientoConsumo').value = estudios;
    document.getElementById('fechaConsumo').value = fecha;
    document.getElementById('horaConsumo').value = hora;
    document.getElementById('turnoConsumo').value = obtenerTurno(hora);
    document.getElementById('quimicoConsumo').value = 'Dr. Roberto Ramírez';

    document.getElementById('formHojaConsumo').style.display = 'block';
}

function buscarFilaPaciente(nombrePaciente) {
    const filas = document.querySelectorAll('#tablaLaboratorio tr');

    for (const fila of filas) {
        const paciente = fila.children[1].textContent.trim();

        if (paciente === nombrePaciente) {
            return fila;
        }
    }

    return null;
}

function agregarHojaConsumoTablaLaboratory(paciente, nombreArchivo, pdfUrl) {
    try {
        
        const tabla = document.getElementById('tablaHojasConsumo');
        console.log('hola mundo esto es data');

        if (tabla.children.length === 1 && tabla.children[0].children[0].colSpan === 3) {
            tabla.innerHTML = '';
        }

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${paciente}</td>
            <td>
                <a href="${pdfUrl}"  style="color: black !important;" target="_blank">${nombreArchivo}</a>
            </td>
            <td>
                <button class="btn btn-secondary" onclick="enviarHojaRecepcion()">
                    Enviar a Recepción
                </button>
            </td>
        `;

        tabla.appendChild(fila);
    } 
    catch (error) {
        console.error('error',error)    
    }
}

function generarHojaConsumoPDF() {
    try {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();
        const paciente = document.getElementById('nombrePacienteConsumo').value;
        const nacimiento = document.getElementById('fechaNacimientoConsumo').value;
        const procedimiento = document.getElementById('procedimientoConsumo').value;
        const fecha = document.getElementById('fechaConsumo').value;
        const hora = document.getElementById('horaConsumo').value;
        const turno = document.getElementById('turnoConsumo').value;
        const quimico = document.getElementById('quimicoConsumo').value;

        if (!paciente) {
            mostrarToast('Selecciona un paciente.', 'warning');
            return;
        }

        pdf.setFontSize(18);
        pdf.text('Hoja de consumo', 20, 20);

        pdf.setFontSize(12);
        pdf.text(`Nombre del paciente: ${paciente}`, 20, 40);
        pdf.text(`Fecha de nacimiento: ${nacimiento}`, 20, 50);
        pdf.text(`Procedimiento: ${procedimiento}`, 20, 60);
        pdf.text(`Fecha: ${fecha}`, 20, 70);
        pdf.text(`Hora: ${hora}`, 20, 80);
        pdf.text(`Turno: ${turno}`, 20, 90);
        pdf.text(`Nombre del químico: ${quimico}`, 20, 100);

        const nombreArchivo = `hoja-consumo-${paciente.replaceAll(' ', '-')}.pdf`;
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        agregarHojaConsumoTablaLaboratory(paciente, nombreArchivo, pdfUrl);
        cerrarModalHojaConsumo();
        mostrarToast('Hoja de consumo generada.', 'success');
    
        }
    catch (error) {
        console.error(error)    
    }
}

function enviarHojaRecepcion() {
    mostrarToast('Hoja enviada a Recepción.', 'success');
}