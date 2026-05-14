
const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

let contadorHojaConsumoENF = 1;

const multiselectBox =
        document.getElementById('multiselectBox');
const dropdown =
    document.getElementById('dropdown');

const options =
    document.querySelectorAll('.option');

const  options_items = [
    {
        value:"Paracetamol",
        id:"paracetamol",
    },
    {
        value:"Ambroxol",
        id:"aambroxol",
    },
    {
        value:"Amoxicilina",
        id:"amoxicicilina",
    },
    {
        value:"Complejo B",
        id:"complejo_b",
    }
]

function abrirModalMedicamentoENF() {
    document.getElementById('modalMedicamentoENF').style.display = 'flex';
}

function cerrarModalMedicamentoENF() {
    document.getElementById('modalMedicamentoENF').style.display = 'none';
    document.getElementById('pacienteMedicamentoENF').value = '';
}

function generarHojaConsumoPDFENF() {

    const pacienteData =
        obtenerDatosPaciente('pacienteConsumoENF');

    const curacion =
        document.getElementById('procedimientoConsumoENF').value;

    if (!pacienteData) {

        mostrarToast(
            'Selecciona un paciente.',
            'warning'
        );

        return;

    }

    if (!curacion) {

        mostrarToast(
            'Selecciona el tipo de curación.',
            'warning'
        );

        return;

    }

    const pdf = crearPDFConsumo({
        paciente: pacienteData.nombre,
        nacimiento: pacienteData.nacimiento,
        procedimiento: 'Curación',
        detalle: `Tipo de curación: ${curacion}`
    });

    const nombreArchivo =
        `hoja-consumo-curacion-${pacienteData.nombre.replaceAll(' ', '-')}.pdf`;

    const pdfData =
        descargarPDF(pdf, nombreArchivo);

    agregarHojaConsumoTablaENF({
        paciente: pacienteData.nombre,
        nombreArchivo: pdfData.nombreArchivo,
        pdfUrl: pdfData.pdfUrl
    });

    cerrarModal(
        'modalHojaConsumoENF',
        [
            'pacienteConsumoENF',
            'procedimientoConsumoENF'
        ]
    );

    mostrarToast(
        'Hoja de consumo de curación generada.',
        'success'
    );

}
function abrirModalHojaConsumoENF() {
    document.getElementById('modalHojaConsumoENF').style.display = 'flex';
}
function cerrarModalHojaConsumoENF() {
    document.getElementById('modalHojaConsumoENF').style.display = 'none';
    document.getElementById('pacienteConsumoENF').value = '';
    document.getElementById('procedimientoConsumoENF').value = '';
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
            <a href="${pdfUrl}" target="_blank" style="color: black !important;" >${nombreArchivo}</a>
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

function obtenerSeleccionados() {
    try {
            
        const selector =
            document.getElementById('dropdown')

        const valores =
            Array.from(selector.selectedOptions)
                .map(opcion => opcion.value)

        const selected = document.getElementById('resultado').innerHTML =
            valores.length > 0
                ? valores.join(', ')
                : 'Ninguna opción seleccionada'
    
        console.log(selected)

    return valores
    } 
    catch (error) {
        console.error(error);
    }
}

// Abrir/Cerrar dropdown
multiselectBox.addEventListener('click', () => {

    dropdown.classList.toggle('show')

})

// Actualizar tags
options.forEach(option => {

    option.addEventListener('change', actualizarSeleccion)

})

function actualizarSeleccion(){

    const seleccionados = []

    options.forEach(option => {

        if(option.checked){

            seleccionados.push(option.value)

        }

    })

    multiselectBox.innerHTML = ''

    if(seleccionados.length === 0){

        multiselectBox.innerHTML =
            '<span class="placeholder">Selecciona tecnologías</span>'

        return
    }

    seleccionados.forEach(valor => {

        multiselectBox.innerHTML +=
            `<span class="selected-tag">${valor}</span>`

    })

}

// Obtener valores
function obtenerValores(){

    const valores = []

    options.forEach(option => {

        if(option.checked){

            valores.push(option.value)

        }

    })

    console.log(valores)

    alert(JSON.stringify(valores))

}

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {

    if(
        !multiselectBox.contains(e.target) &&
        !dropdown.contains(e.target)
    ){

        dropdown.classList.remove('show')

    }

})


function renderSelectorMedicamentos() {

    dropdown.innerHTML = '';

    options_items.forEach(medicamento => {

        const container =
            document.createElement('div');

        container.className = 'form-check';

        const input =
            document.createElement('input');

        input.className =
            'form-check-input option';

        input.type = 'checkbox';

        input.value = medicamento.value;
        input.id = medicamento.id;

        input.addEventListener(
            'change',
            actualizarSeleccion
        );

        const label =
            document.createElement('label');

        label.className =
            'form-check-label';

        label.setAttribute('for', medicamento.id);

        label.textContent = medicamento.value;

        container.appendChild(input);
        container.appendChild(label);

        dropdown.appendChild(container);

    });

}

function obtenerMedicamentosSeleccionados() {

    return Array.from(
        document.querySelectorAll('.option:checked')
    ).map(option => option.value);

}

function actualizarMultiSeleccion() {

    const seleccionados =
        obtenerMedicamentosSeleccionados();

    multiselectBox.innerHTML = '';

    if (seleccionados.length === 0) {

        const placeholder =
            document.createElement('span');

        placeholder.className = 'placeholder';

        placeholder.textContent =
            'Selecciona medicamentos';

        multiselectBox.appendChild(placeholder);

        return;

    }

    seleccionados.forEach(valor => {

        const tag =
            document.createElement('span');

        tag.className = 'selected-tag';

        tag.textContent = valor;

        multiselectBox.appendChild(tag);

    });

}

function generarHojaMedicamentoPDFENF() {
    const selectPaciente = document.getElementById('pacienteMedicamentoENF');
    const paciente = selectPaciente.value;

    const medicamentosSeleccionados = obtenerSeleccionados();
    console.log(obtenerSeleccionados())
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


document.addEventListener('DOMContentLoaded',() => {
    renderSelectorMedicamentos()
    actualizarMultiSeleccion();
})
