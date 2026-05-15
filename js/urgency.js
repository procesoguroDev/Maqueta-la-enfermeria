
    function openModal(id) { document.getElementById(id).style.display = 'flex'; }
    function cerrarModalUrgency(idModal, campos = []) {

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

    // Función universal para agregar a la línea de tiempo
    function addNote(titulo, texto) {
        try {
            const timeline = document.getElementById('timeline-patient');
            const ahora = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `<b>${ahora} - ${titulo}:</b> ${texto}`;
            timeline.prepend(item);
            document.getElementById('vital-sign-note-ta').value =' ';
            document.getElementById('type-sign').value =' ';
        } 
        catch (error) {
            console.error('error',error)    
        }
        
    }

    function guardarEvolucion() {
        const nota = document.getElementById('txt-nota').value;
        if(!nota) return alert("Escriba la nota");
        addNote('EVOLUCIÓN', nota);
        document.getElementById('txt-nota').value = '';
        cerrarModalUrgency('mod-nota');
        closeModal();
    }

    function guardarInsumo() {
        const insumo = document.getElementById('sel-insumo').value;
        const qty = document.getElementById('qty-insumo').value;
        addNote('INSUMO', `Se cargó ${qty} unidad(es) de ${insumo}.`);
        cerrarModalUrgency('mod-insumos');
        closeModal();
    }

    function guardarEstudio() {
        const tipo = document.getElementById('sel-estudio').value;
        const res = document.getElementById('res-estudio').value;
        
        if(res) {
            // Si hay resultado, lo ponemos en la vista de estudios
            const container = document.getElementById('estudios-pedro');
            const box = document.createElement('div');
            box.className = 'study-view';
            box.innerHTML = `<b>${tipo.toUpperCase()}</b>${res}`;
            container.appendChild(box);
            addNote('ESTUDIO', `${tipo} realizado con resultado cargado.`);
        } else {
            addNote('ESTUDIO', `Se solicitó orden de ${tipo} a departamento.`);
        }
        document.getElementById('res-estudio').value = '';
        cerrarModalUrgency('mod-estudios');

        
    }

    function finalizarTodo() {
        alert("Paciente derivado a Recepción. Cuenta procesada.");
        location.reload();
    }

    window.onclick = function(e) { if(e.target.className === 'modal-overlay') closeModal(); }