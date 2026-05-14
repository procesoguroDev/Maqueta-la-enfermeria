function showModule(id) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Mostrar la deseada
    document.getElementById(id).classList.add('active');
    
    // Actualizar Sidebar
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeItem = Array.from(document.querySelectorAll('.nav-item')).find(i => i.textContent.toLowerCase().includes(id.replace('rrhh','recursos').replace('recepcion','admisión')));
    if(activeItem) activeItem.classList.add('active');
    
    // Actualizar Título
    const titles = {
        dashboard: 'Dashboard General',
        recepcion: 'Admisión y Recepción de Pacientes',
        triage: 'Triage y Signos Vitales',
        consulta: 'Consulta Médica',
        laboratorio: 'Gestión de Laboratorio',
        paramedicos: 'Servicios Paramédicos (FRAP)',
        compras: 'Gestión de Compras',
        rrhh: 'Recursos Humanos',
        paciente: 'Vista del Paciente.',
        enfermeria: 'Vista de Enfermeria.',
        sistema: 'Configuración del Sistema'
    };
    document.getElementById('module-title').innerText = titles[id];
}

