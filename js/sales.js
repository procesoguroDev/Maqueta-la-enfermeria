
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

function actualizarContadoresCRM() {
    document.querySelectorAll('.crm-stage').forEach(stage => {
        const total = stage.querySelectorAll('.crm-card').length;
        const contador = stage.querySelector('.crm-stage-count');

        if (contador) {
            contador.textContent = total;
        }
    });
}

function actualizarBarraEtapasCRM(etapaActiva) {
    document.querySelectorAll('.crm-stage-progress button').forEach(button => {
        button.classList.toggle('active', button.dataset.stage === etapaActiva);
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
