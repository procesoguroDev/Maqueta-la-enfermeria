 // Navegación entre pestañas
function openSubTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add("active");
    selectedTab.style.display = "block"; // Asegurar visibilidad
    evt.currentTarget.classList.add("active");
}

// Inicializar la primera pestaña al cargar
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("tab-espera").style.display = "block";
    document.getElementById("tab-captura").style.display = "none";
    document.getElementById("tab-interpretacion").style.display = "none";
});

// Función que simula el llamado del paciente desde sala de espera
function llamarPaciente(folio) {

    try {

        // Actualizar datos
        document.getElementById('paciente-actual-rx').innerText =
            "Luis Alberto Mendoza (#" + folio + ")";

        // Formulario
        document.getElementById('cap-folio').value = folio;

        document.getElementById('cap-medico').value =
            "Dr. C. Ramírez (Urgencias)";

        document.getElementById('cap-indicaciones').value =
            "🔴 URGENCIA: Caída de propia altura.\n" +
            "♿ Condición: Paciente llega en silla de ruedas.\n" +
            "📋 Objetivo: Descartar fractura.";

        // CAMBIAR TAB
        const triggerEl =
            document.getElementById('xray-captura-tab');

        const tab =
            new bootstrap.Tab(triggerEl);

        tab.show();

    }
    catch (error) {

        console.error(error);

    }

}

// Abrir modal de la orden médica
function verOrdenMedica() {
    const modal = document.getElementById('mod-orden-medica');
    modal.style.display = 'flex';
    modal.classList.add('active');
}

// Finalizar el estudio y mostrar confirmación
function finalizarEstudio() {
    const modal = document.getElementById('mod-estudio-ok');
    modal.style.display = 'flex';
    modal.classList.add('active');
}

// Cerrar cualquier modal genérico
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById(modalId).classList.remove('active');

    // Si cerramos el modal de éxito, regresar a sala de espera
    if (modalId === 'mod-estudio-ok') {
        document.getElementById('btn-tab-espera').click();
        document.getElementById('paciente-actual-rx').innerText = "Ninguno";
        document.getElementById('cap-folio').value = "";
        document.getElementById('cap-medico').value = "";
        document.getElementById('cap-indicaciones').value = "";
        document.getElementById('cap-tecnico').value = "";
    }
}

// Simulación de buscador simple en tabla
function filterTable(input) {
    // Lógica futura para filtrar la tabla
    console.log("Buscando: " + input.value);
} 