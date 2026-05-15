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

function generarHojaConsumoPDF() {
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

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

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

    agregarHojaConsumoTabla(paciente, nombreArchivo, pdfUrl);
    cerrarModalHojaConsumo();

    mostrarToast('Hoja de consumo generada.', 'success');
}

function agregarHojaConsumoTabla(paciente, nombreArchivo, pdfUrl) {
    const tabla = document.getElementById('tablaHojasConsumo');

    if (tabla.children.length === 1 && tabla.children[0].children[0].colSpan === 3) {
        tabla.innerHTML = '';
    }

    const fila = document.createElement('tr');

    fila.innerHTML = `
        <td>${paciente}</td>
        <td>
            <a href="${pdfUrl}" target="_blank">${nombreArchivo}</a>
        </td>
        <td>
            <button class="btn btn-secondary" onclick="enviarHojaRecepcion()">
                Enviar a Recepción
            </button>
        </td>
    `;

    tabla.appendChild(fila);
}

function enviarHojaRecepcion() {
    mostrarToast('Hoja enviada a Recepción.', 'success');
}
/* Hoja de consumo ENF */

let contadorHojaConsumoENF = 1;

function abrirModalHojaConsumoENF() {
    document.getElementById('modalHojaConsumoENF').style.display = 'flex';
}

function cerrarModalHojaConsumoENF() {
    document.getElementById('modalHojaConsumoENF').style.display = 'none';
    document.getElementById('pacienteConsumoENF').value = '';
    document.getElementById('procedimientoConsumoENF').value = '';
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

function generarHojaConsumoPDFENF() {
    const selectPaciente = document.getElementById('pacienteConsumoENF');
    const paciente = selectPaciente.value;
    const curacion = document.getElementById('procedimientoConsumoENF').value;

    if (!paciente) {
        mostrarToast('Selecciona un paciente.', 'warning');
        return;
    }

    if (!curacion) {
        mostrarToast('Selecciona el tipo de curación.', 'warning');
        return;
    }

    const opcionPaciente = selectPaciente.options[selectPaciente.selectedIndex];
    const nacimiento = opcionPaciente.getAttribute('data-nacimiento') || '';

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().slice(0, 5);
    const turno = obtenerTurno(hora);
    const enfermero = 'Dr. Roberto Ramírez';

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text('Hoja de consumo - Enfermería', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Nombre del paciente: ${paciente}`, 20, 40);
    pdf.text(`Fecha de nacimiento: ${nacimiento}`, 20, 50);
    pdf.text('Procedimiento: Curación', 20, 60);
    pdf.text(`Tipo de curación: ${curacion}`, 20, 70);
    pdf.text(`Fecha: ${fecha}`, 20, 80);
    pdf.text(`Hora: ${hora}`, 20, 90);
    pdf.text(`Turno: ${turno}`, 20, 100);
    pdf.text(`Nombre del enfermero: ${enfermero}`, 20, 110);

    const nombreArchivo = `hoja-consumo-curacion-${paciente.replaceAll(' ', '-')}.pdf`;
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    agregarHojaConsumoTablaENF(paciente, nombreArchivo, pdfUrl);
    cerrarModalHojaConsumoENF();

    mostrarToast('Hoja de consumo de curación generada.', 'success');
}

/* Medicamento ENF */

function abrirModalMedicamentoENF() {
    document.getElementById('modalMedicamentoENF').style.display = 'flex';
}

function cerrarModalMedicamentoENF() {
    document.getElementById('modalMedicamentoENF').style.display = 'none';
    document.getElementById('pacienteMedicamentoENF').value = '';

    const selectMedicamento = document.getElementById('medicamentoConsumoENF');
    Array.from(selectMedicamento.options).forEach(option => {
        option.selected = false;
    });
}

function generarHojaMedicamentoPDFENF() {
    const selectPaciente = document.getElementById('pacienteMedicamentoENF');
    const paciente = selectPaciente.value;

    const medicamentosSeleccionados = Array.from(
        document.getElementById('medicamentoConsumoENF').selectedOptions
    ).map(option => option.value);

    if (!paciente) {
        mostrarToast('Selecciona un paciente.', 'warning');
        return;
    }

    if (medicamentosSeleccionados.length === 0) {
        mostrarToast('Selecciona al menos un medicamento.', 'warning');
        return;
    }

    const opcionPaciente = selectPaciente.options[selectPaciente.selectedIndex];
    const nacimiento = opcionPaciente.getAttribute('data-nacimiento') || '';

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().slice(0, 5);
    const turno = obtenerTurno(hora);
    const enfermero = 'Dr. Roberto Ramírez';

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text('Hoja de consumo - Enfermería', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Nombre del paciente: ${paciente}`, 20, 40);
    pdf.text(`Fecha de nacimiento: ${nacimiento}`, 20, 50);
    pdf.text('Procedimiento: Aplicación de medicamento', 20, 60);
    pdf.text(`Medicamentos: ${medicamentosSeleccionados.join(', ')}`, 20, 70);
    pdf.text(`Fecha: ${fecha}`, 20, 80);
    pdf.text(`Hora: ${hora}`, 20, 90);
    pdf.text(`Turno: ${turno}`, 20, 100);
    pdf.text(`Nombre del enfermero: ${enfermero}`, 20, 110);

    const nombreArchivo = `hoja-consumo-medicamento-${paciente.replaceAll(' ', '-')}.pdf`;
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    agregarHojaConsumoTablaENF(paciente, nombreArchivo, pdfUrl);
    cerrarModalMedicamentoENF();

    mostrarToast('Hoja de consumo de medicamento generada.', 'success');
}

/* Tabla hojas de consumo ENF */

function agregarHojaConsumoTablaENF(paciente, nombreArchivo, pdfUrl) {
    const tabla = document.getElementById('tablaHojaConsumoENF');

    if (tabla.children.length === 1 && tabla.children[0].children[0].colSpan === 4) {
        tabla.innerHTML = '';
    }

    const idHoja = `ENF-${String(contadorHojaConsumoENF).padStart(3, '0')}`;
    contadorHojaConsumoENF++;

    const fila = document.createElement('tr');

    fila.innerHTML = `
        <td>${idHoja}</td>
        <td>${paciente}</td>
        <td>
            <a href="${pdfUrl}" target="_blank">${nombreArchivo}</a>
        </td>
        <td>
            <button class="btn btn-secondary" onclick="enviarHojaRecepcion()">
                Enviar a Recepción
            </button>
        </td>
    `;

    tabla.appendChild(fila);
}

function enviarHojaRecepcion() {
    mostrarToast('Hoja enviada a Recepción.', 'success');
}
/* CRM Ventas */
let prospectoSeleccionadoCRM = null;
let contadorCotizacionCRM = 1;
let cardArrastradaCRM = null;
let crmDragging = false;

function activarDragAndDropCRM() {
    document.querySelectorAll('.crm-card').forEach(card => {
        card.setAttribute('draggable', 'true');

        card.addEventListener('dragstart', () => {
            crmDragging = true;
            cardArrastradaCRM = card;
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            cardArrastradaCRM = null;
            actualizarContadoresCRM();

            setTimeout(() => {
                crmDragging = false;
            }, 50);
        });
    });

    document.querySelectorAll('.crm-stage').forEach(stage => {
        stage.addEventListener('dragover', event => {
            event.preventDefault();
            stage.classList.add('drag-over');
        });

        stage.addEventListener('dragleave', () => {
            stage.classList.remove('drag-over');
        });

        stage.addEventListener('drop', event => {
            event.preventDefault();
            stage.classList.remove('drag-over');

            if (!cardArrastradaCRM) {
                return;
            }

            const body = stage.querySelector('.crm-stage-body');
            const nuevaEtapa = stage.dataset.stage;

            body.appendChild(cardArrastradaCRM);
            cardArrastradaCRM.dataset.stage = nuevaEtapa;

            actualizarContadoresCRM();
            mostrarToast('Prospecto movido de etapa.', 'success');
        });
    });
}

function abrirModalProspecto(card) {
    if (crmDragging) {
        return;
    }

    prospectoSeleccionadoCRM = card;

    document.getElementById('crmNombre').value = card.dataset.nombre;
    document.getElementById('crmTelefono').value = card.dataset.telefono;
    document.getElementById('crmEmail').value = card.dataset.email;
    document.getElementById('crmServicio').value = card.dataset.servicio;
    document.getElementById('crmValorTrato').value = '';
    document.getElementById('crmArchivoCotizacion').innerHTML = 'Sin cotización generada';

    actualizarBarraEtapasCRM(card.dataset.stage);

    document.getElementById('modalProspectoCRM').style.display = 'flex';
}

function cerrarModalProspecto() {
    document.getElementById('modalProspectoCRM').style.display = 'none';
    prospectoSeleccionadoCRM = null;
}

function actualizarBarraEtapasCRM(etapaActiva) {
    document.querySelectorAll('.crm-stage-progress button').forEach(button => {
        button.classList.toggle('active', button.dataset.stage === etapaActiva);
    });
}

function moverProspectoAEtapa(etapa) {
    if (!prospectoSeleccionadoCRM) {
        return;
    }

    const etapaDestino = document.querySelector(`.crm-stage[data-stage="${etapa}"] .crm-stage-body`);

    if (!etapaDestino) {
        return;
    }

    etapaDestino.appendChild(prospectoSeleccionadoCRM);
    prospectoSeleccionadoCRM.dataset.stage = etapa;

    actualizarBarraEtapasCRM(etapa);
    actualizarContadoresCRM();

    mostrarToast('Prospecto movido de etapa.', 'success');
}

function actualizarContadoresCRM() {
    document.querySelectorAll('.crm-stage').forEach(stage => {
        const total = stage.querySelectorAll('.crm-card').length;
        const contador = stage.querySelector('.crm-stage-count');

        if (contador) {
            contador.textContent = total;
        }
    });
}

function generarCotizacionCRM() {
    const nombre = document.getElementById('crmNombre').value;
    const telefono = document.getElementById('crmTelefono').value;
    const email = document.getElementById('crmEmail').value;
    const servicio = document.getElementById('crmServicio').value;
    const valor = Number(document.getElementById('crmValorTrato').value);

    if (!nombre || !telefono || !email || !servicio) {
        mostrarToast('Completa los datos del prospecto.', 'warning');
        return;
    }

    if (!valor || valor <= 0) {
        mostrarToast('Ingresa el valor del trato.', 'warning');
        return;
    }

    const folio = `COT-${String(contadorCotizacionCRM).padStart(4, '0')}`;
    contadorCotizacionCRM++;

    const iva = valor * 0.16;
    const total = valor + iva;
    const fecha = new Date().toISOString().split('T')[0];

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text('Cotización de Membresía', 20, 20);

    pdf.setFontSize(11);
    pdf.text(`Folio: ${folio}`, 20, 32);
    pdf.text(`Fecha: ${fecha}`, 150, 32);

    pdf.setFontSize(12);
    pdf.text(`Nombre: ${nombre}`, 20, 50);
    pdf.text(`Teléfono: ${telefono}`, 20, 60);
    pdf.text(`Email: ${email}`, 20, 70);
    pdf.text(`Servicio cotizado: ${servicio}`, 20, 80);

    pdf.text(`Valor subtotal: $${valor.toFixed(2)}`, 20, 100);
    pdf.text(`IVA 16%: $${iva.toFixed(2)}`, 20, 110);
    pdf.text(`Total: $${total.toFixed(2)}`, 20, 120);

    pdf.setFontSize(10);
    pdf.text('Vigencia de cotización de 30 días.', 20, 145);

    const nombreArchivo = `${folio}-${nombre.replaceAll(' ', '-')}.pdf`;
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    document.getElementById('crmArchivoCotizacion').innerHTML = `
        <a href="${pdfUrl}" target="_blank">${nombreArchivo}</a>
    `;

    mostrarToast('Cotización generada correctamente.', 'success');
}

function marcarProspectoGanado() {
    if (prospectoSeleccionadoCRM) {
        prospectoSeleccionadoCRM.classList.add('crm-card-won');
    }

    cerrarModalProspecto();
    mostrarToast('Prospecto marcado como ganado.', 'success');
}

function marcarProspectoPerdido() {
    if (prospectoSeleccionadoCRM) {
        prospectoSeleccionadoCRM.remove();
        actualizarContadoresCRM();
    }

    cerrarModalProspecto();
    mostrarToast('Prospecto marcado como perdido.', 'warning');
}

document.addEventListener('DOMContentLoaded', () => {
    activarDragAndDropCRM();
    actualizarContadoresCRM();
});
 