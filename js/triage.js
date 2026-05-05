
function watcherGlassgow(){
    const ocular = parseInt(document.getElementById('glasgow_ocular').value) || 0
    const verbal = parseInt(document.getElementById('glasgow_verbal').value) || 0
    const motor  = parseInt(document.getElementById('glasgow_motor').value) || 0

    const total = ocular + verbal + motor

    let result = ''

    if (total >= 13){ 
        result =  'Leve'
    }
    else if (total >= 9){ 
        result =  'Moderado'
    } else {
        result = 'severo'
    }
    document.getElementById('glassgowTotal').textContent = `${total}/15`
    document.getElementById('glasgow_result').textContent = result
}

function setError(input, message) {
    input.classList.add('error')

    const errorText = input.parentElement.querySelector('.error-message')
    errorText.textContent = message
    errorText.classList.add('active') // 👈 mostrar
}

function clearError(input) {
    input.classList.remove('error')

    const errorText = input.parentElement.querySelector('.error-message')
    errorText.textContent = ''
    errorText.classList.remove('active') // 👈 ocultar
}
function validateField(id, min, max, required = true) {
    const input = document.getElementById(id)
    const value = input.value.trim()

    clearError(input)

    if (required && value === '') {
        setError(input, 'Este campo es obligatorio')
        return null
    }

    const num = parseFloat(value)

    if (isNaN(num)) {
        setError(input, 'Debe ser un número válido')
        return null
    }

    if (num < min || num > max) {
        setError(input, `Rango permitido: ${min} - ${max}`)
        return null
    }

    return num
}


function classifyTriage(data) {

    const {
        sistolicTension,
        distolicTension,
        CardiacFrequency,
        respiratory,
        temperature,
        oxygen,
        glucose
    } = data

    // 🔴 CRÍTICO
    if (
        oxygen < 85 ||
        sistolicTension < 80 ||
        CardiacFrequency > 150 ||
        CardiacFrequency < 40 ||
        respiratory > 35 ||
        temperature > 41 ||
        glucose < 50
    ) {
        return { level: 'ROJO', message: 'Atención inmediata' }
    }

    /*  
    // 🟠 URGENTE
    if (
        oxygen < 90 ||
        sistolicTension < 90 ||
        sistolicTension > 180 ||
        CardiacFrequency > 120 ||
        respiratory > 25 ||
        temperature > 39 ||
        glucose > 300
    ) {
        return { level: 'NARANJA', message: 'Urgente' }
    } 
    */

    // 🟡 PRIORITARIO
    if (
        oxygen < 94 ||
        sistolicTension > 140 ||
        CardiacFrequency > 100 ||
        temperature > 37.5
    ) {
        return { level: 'AMARILLO', message: 'Prioritario' }
    }

    // 🟢 NORMAL
    return { level: 'VERDE', message: 'No urgente' }
}

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Forzar render antes de animar
  setTimeout(() => toast.classList.add('show'), 10);

  // Ocultar después del tiempo
  setTimeout(() => {
    toast.classList.remove('show');
    
    setTimeout(() => {
      toast.remove();
    }, 400);
    
  }, duration);
}

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
        sistema: 'Configuración del Sistema'
    };
    document.getElementById('module-title').innerText = titles[id];
}


function finishTriageService() {

    const sistolicTension = validateField('sistolica', 70, 250)
    const distolicTension = validateField('diastolica', 40, 150)
    const CardiacFrequency = validateField('lpm', 30, 220)
    const respiratory = validateField('respiratory', 5, 60)
    const temperature = validateField('temperature', 30, 45)
    const oxygen = validateField('oxygen', 50, 100)
    const wiegth = validateField('wiegth', 2, 300)
    const height = validateField('height', 30, 250)
    const glucose = validateField('glucose', 20, 600)

   
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input)
        })
    })

    if (
        sistolicTension === null ||
        distolicTension === null ||
        CardiacFrequency === null ||
        respiratory === null ||
        temperature === null ||
        oxygen === null ||
        wiegth === null ||
        height === null ||
        glucose === null
    ) {
        return
    }

    const triage = classifyTriage({
        sistolicTension,
        distolicTension,
        CardiacFrequency,
        respiratory,
        temperature,
        oxygen,
        glucose
    })

        console.log({
            sistolicTension,
            distolicTension,
            CardiacFrequency,
            respiratory,
            temperature,
            oxygen,
            wiegth,
            height,
            glucose,
            triage
        })



        // 👇 Mostrar en pantalla
    if (triage.level === 'AMARILLO'){
        document.getElementById('selector-2').removeAttribute('disabled')
        document.getElementById('selector-2').checked = true
    }

    if (triage.level === 'VERDE'){
        document.getElementById('selector-3').removeAttribute('disabled')
        document.getElementById('selector-3').checked = true
    }

    if (triage.level === 'ROJO'){
        document.getElementById('selector-1').removeAttribute('disabled')
        document.getElementById('selector-1').checked = true
    }
    showToast('Guardado correctamente', 'success')

      
   /*  setTimeout(() => {
        location.reload()
    }, 1000);  */
   
}




function seleccionarPaciente() {
    document.querySelector('.grid-6').style.display = 'none';
    document.getElementById('contenedorForm').style.display = 'grid';
}


