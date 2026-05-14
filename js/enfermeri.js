/* =========================================================
   CONFIGURACIÓN
========================================================= */

let contadorHojaConsumoENF = 1;

const MEDICAMENTOS = [
    {
        value: 'Paracetamol',
        id: 'paracetamol',
    },
    {
        value: 'Ambroxol',
        id: 'ambroxol',
    },
    {
        value: 'Amoxicilina',
        id: 'amoxicilina',
    },
    {
        value: 'Complejo B',
        id: 'complejo_b',
    }
];

/* =========================================================
   ELEMENTOS DOM
========================================================= */

const multiselectBox =
    document.getElementById('multiselectBox');

const dropdown =
    document.getElementById('dropdown');

const tablaHojaConsumo =
    document.getElementById('tablaHojaConsumoENF');

/* =========================================================
   MODALES
========================================================= */

function abrirModal(idModal) {

    const modal = document.getElementById(idModal);

    if (modal) {
        modal.style.display = 'flex';
    }

}

function cerrarModal(idModal, campos = []) {

    const modal = document.getElementById(idModal);

    if (modal) {
        modal.style.display = 'none';
    }

    campos.forEach(idCampo => {

        const campo =
            document.getElementById(idCampo);

        if (campo) {
            campo.value = '';
        }

    });

}

/* =========================================================
   PACIENTE
========================================================= */

function obtenerDatosPaciente(idSelect) {

    const select =
        document.getElementById(idSelect);

    if (!select || !select.value) {
        return null;
    }

    const opcion =
        select.options[select.selectedIndex];

    return {
        nombre: select.value,
        nacimiento:
            opcion.getAttribute('data-nacimiento') || ''
    };

}

/* =========================================================
   FECHA Y TURNO
========================================================= */

function obtenerFechaHoraActual() {

    const ahora = new Date();

    return {
        fecha: ahora.toISOString().split('T')[0],
        hora: ahora.toTimeString().slice(0, 5)
    };

}

function obtenerTurno(hora) {

    const [horas] =
        hora.split(':').map(Number);

    if (horas >= 7 && horas < 14) {
        return 'Matutino';
    }

    if (horas >= 14 && horas < 21) {
        return 'Vespertino';
    }

    return 'Nocturno';

}

/* =========================================================
   PDF
========================================================= */

function crearPDFConsumo() {
    const data= {
    paciente: 'Pedro Infante',
    nacimiento: '',
    procedimiento:'Limpieza y aseo',
    detalle: 'Ninguno',
    responsable :'Lic. Roberto Ramírez'
}
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const { fecha, hora } =
        obtenerFechaHoraActual();

    const turno =
        obtenerTurno(hora);

    pdf.setFontSize(18);

    pdf.text(
        'Hoja de consumo - Enfermería',
        20,
        20
    );

    pdf.setFontSize(12);

    const contenido = [
        `Nombre del paciente: ${data.paciente}`,
        `Fecha de nacimiento: ${data.nacimiento}`,
        `Procedimiento: ${data.procedimiento}`,
        `detalle: ${data.detalle}`,
        `Fecha: ${fecha}`,
        `Hora: ${hora}`,
        `Turno: ${turno}`,
        `Responsable: ${data.responsable}`
    ];

    let posicionY = 40;

    contenido.forEach(linea => {

        pdf.text(linea, 20, posicionY);

        posicionY += 10;

    });

    return pdf;

}

function generarURLPDF(pdf) {

    const blob = pdf.output('blob');

    return URL.createObjectURL(blob);

}

/* =========================================================
   TABLA
========================================================= */

function agregarHojaConsumoTabla({
    paciente,
    nombreArchivo,
    pdfUrl
}) {

    if (
        tablaHojaConsumo.children.length === 1 &&
        tablaHojaConsumo.children[0].children[0].colSpan === 4
    ) {

        tablaHojaConsumo.innerHTML = '';

    }

    const idHoja =
        `ENF-${String(contadorHojaConsumoENF).padStart(3, '0')}`;

    contadorHojaConsumoENF++;

    const fila = document.createElement('tr');

    /* ID */

    const tdId =
        document.createElement('td');

    tdId.textContent = idHoja;

    /* PACIENTE */

    const tdPaciente =
        document.createElement('td');

    tdPaciente.textContent = paciente;

    /* PDF */

    const tdArchivo =
        document.createElement('td');

    const enlace =
        document.createElement('a');

    enlace.href = pdfUrl;
    enlace.target = '_blank';
    enlace.textContent = nombreArchivo;

    enlace.style.color = 'black';

    tdArchivo.appendChild(enlace);

    /* BOTÓN */

    const tdBoton =
        document.createElement('td');

    const boton =
        document.createElement('button');

    boton.className =
        'btn btn-secondary';

    boton.textContent =
        'Enviar a Recepción';

    boton.addEventListener('click', () => {

        mostrarToast(
            'Hoja enviada a Recepción.',
            'success'
        );

    });

    tdBoton.appendChild(boton);

    /* APPEND */

    fila.appendChild(tdId);
    fila.appendChild(tdPaciente);
    fila.appendChild(tdArchivo);
    fila.appendChild(tdBoton);

    tablaHojaConsumo.appendChild(fila);

}

/* =========================================================
   MULTISELECT
========================================================= */

function renderSelectorMedicamentos() {

    dropdown.innerHTML = '';

    MEDICAMENTOS.forEach(medicamento => {

        const container =
            document.createElement('div');

        container.className = 'form-check';

        const input =
            document.createElement('input');

        input.type = 'checkbox';

        input.className =
            'form-check-input option';

        input.id = medicamento.id;

        input.value = medicamento.value;

        input.addEventListener(
            'change',
            actualizarMultiselect
        );

        const label =
            document.createElement('label');

        label.className =
            'form-check-label';

        label.setAttribute(
            'for',
            medicamento.id
        );

        label.textContent =
            medicamento.value;

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

function actualizarMultiselect() {

    const seleccionados =
        obtenerMedicamentosSeleccionados();

    multiselectBox.innerHTML = '';

    if (seleccionados.length === 0) {

        const placeholder =
            document.createElement('span');

        placeholder.className =
            'placeholder';

        placeholder.textContent =
            'Selecciona medicamentos';

        multiselectBox.appendChild(placeholder);

        return;

    }

    seleccionados.forEach(valor => {

        const tag =
            document.createElement('span');

        tag.className =
            'selected-tag';

        tag.textContent = valor;

        multiselectBox.appendChild(tag);

    });

}

/* =========================================================
   GENERAR PDF CURACIÓN
========================================================= */

function generarHojaCuracionPDFENF() {

    const pacienteData =
        obtenerDatosPaciente('pacienteConsumoENF');

    const curacion =
        document.getElementById(
            'procedimientoConsumoENF'
        ).value;

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

    const pdf =
        crearPDFConsumo({
            paciente: 'Pedro Infante',
            nacimiento: pacienteData.nacimiento,
            procedimiento: 'Curación',
            detalle:
                `Tipo de curación: ${curacion}`
        });

    const nombreArchivo =
        `hoja-consumo-curacion-${pacienteData.nombre.replaceAll(' ', '-')}.pdf`;

    const pdfUrl =
        generarURLPDF(pdf);

    agregarHojaConsumoTabla({
        paciente: pacienteData.nombre,
        nombreArchivo,
        pdfUrl
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

/* =========================================================
   GENERAR PDF MEDICAMENTOS
========================================================= */

function generarHojaMedicamentoPDFENF() {

    const pacienteData =
        obtenerDatosPaciente(
            'pacienteMedicamentoENF'
        );

    const medicamentos =
        obtenerMedicamentosSeleccionados();

    if (!pacienteData) {

        mostrarToast(
            'Selecciona un paciente.',
            'warning'
        );

        return;

    }

    if (medicamentos.length === 0) {

        mostrarToast(
            'Selecciona al menos un medicamento.',
            'warning'
        );

        return;

    }

    const pdf =
        crearPDFConsumo({
            paciente: 'Pedro Infante',
            nacimiento: pacienteData.nacimiento,
            procedimiento:
                'Aplicación de medicamento',
            detalle:
                `Medicamentos: ${medicamentos.join(', ')}`
        });

    const nombreArchivo =
        `hoja-consumo-medicamento-${pacienteData.nombre.replaceAll(' ', '-')}.pdf`;

    const pdfUrl =
        generarURLPDF(pdf);

    agregarHojaConsumoTabla({
        paciente: pacienteData.nombre,
        nombreArchivo,
        pdfUrl
    });

    cerrarModal(
        'modalMedicamentoENF',
        ['pacienteMedicamentoENF']
    );

    mostrarToast(
        'Hoja de consumo de medicamento generada.',
        'success'
    );

}

/* =========================================================
   EVENTOS
========================================================= */

multiselectBox.addEventListener('click', () => {

    dropdown.classList.toggle('show');

});

document.addEventListener('click', (e) => {

    if (
        !multiselectBox.contains(e.target) &&
        !dropdown.contains(e.target)
    ) {

        dropdown.classList.remove('show');

    }

});

document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderSelectorMedicamentos();

        actualizarMultiselect();

    }
);

