let medicament = []

const  consultation_data = {
    "fullName":'',
    "gender":'',
    "age": 20 ,
    "birthday": "",
    "CURP":'XXXXXXXXXXXXXX',
    "address":'XXXXXXXXXX',
    "phone":443255789,
    "state":"soltero",
    "ocupation":"oficinista",
    "tutor": '',
    "dateAdmission":' 2026-04-30',
    "dateAtession": '2026-04-30'
}

// Accordion toggle
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const parent = this.parentElement;
      parent.classList.toggle('active');
    });
  });

});

let background = []

// JSON base
const data = {
  antecedentes: {
    heredofamiliares: {
      diabetes: true,
      hipertension: false,
      cancer: true,
      otros: "Abuelo con Alzheimer"
    },
    no_patologicos: {
      tabaquismo: "no",
      alcohol: "ocasional",
      actividad_fisica: "sedentario",
      notas: ""
    },
    patologicos: {
      enfermedades: ["diabetes_tipo_2"],
      descripcion: "Controlado con metformina desde hace 5 años"
    }
  }
};

// Cargar datos al form
function cargarDatos() {
  // Heredofamiliares
  document.getElementById('ahf_diabetes').checked = data.antecedentes.heredofamiliares.diabetes;
  document.getElementById('ahf_hipertension').checked = data.antecedentes.heredofamiliares.hipertension;
  document.getElementById('ahf_cancer').checked = data.antecedentes.heredofamiliares.cancer;
  document.getElementById('ahf_otros').value = data.antecedentes.heredofamiliares.otros;

  // No patológicos
  document.getElementById('apnp_tabaquismo').value = data.antecedentes.no_patologicos.tabaquismo;
  document.getElementById('apnp_alcohol').value = data.antecedentes.no_patologicos.alcohol;
  document.getElementById('apnp_actividad').value = data.antecedentes.no_patologicos.actividad_fisica;
  document.getElementById('apnp_notas').value = data.antecedentes.no_patologicos.notas;

  // Patológicos
  const enfermedadesSelect = document.getElementById('app_enfermedades');
  const enfermedades = data.antecedentes.patologicos.enfermedades;

  for (let option of enfermedadesSelect.options) {
    option.selected = enfermedades.includes(option.value);
  }

  document.getElementById('app_descripcion').value = data.antecedentes.patologicos.descripcion;
}

function seleccionarConsulta() {
   // ocultar tabla
    document.getElementById('tableConsultationPatient').style.display = 'none';

    // mostrar formulario
    document.getElementById('patientConsultForm').style.display = 'grid';

    // ocultar nav tabs
    document.getElementById('consultationTabs').style.display = 'none';
}


function render() {
  const tbody = document.querySelector('#backgound_list tbody');
  tbody.innerHTML = background.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <select>
          <option value="">--Seleccione una opcion--</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Abuelo">Abuelo</option>
          <option value="Abuela">Abuela</option>
          <option value="Hermano">Hermano</option>
          <option value="Hermana">Hermana</option>
          <option value="Tio">Tio</option>
          <option value="Tia">Tia</option>
        </select>
      </td>
      <td>
        <input type="text" 
          value="${item.pariente}" 
          onchange="background[${index}].pariente = this.value">
      </td>
      <td>
        <label>
          <input type="checkbox" 
            ${item.diabetes ? 'checked' : ''} 
            onchange="background[${index}].diabetes = this.checked">
          Diabetes
        </label>

        <label>
          <input type="checkbox" 
            ${item.hipertension ? 'checked' : ''} 
            onchange="background[${index}].hipertension = this.checked">
          Hipertensión
        </label>

        <label>
          <input type="checkbox" 
            ${item.cancer ? 'checked' : ''} 
            onchange="background[${index}].cancer = this.checked">
          Cáncer
        </label>

        <input type="text" 
          placeholder="Otros"
          value="${item.otros}"
          onchange="background[${index}].otros = this.value">
      </td>
    </tr>
  `).join('');
}


function renderTableMedicament(){
  try{
    const tbody = document.querySelector('#mediament_table tbody');

    medicament.push({
      name: document.getElementById('name_medication').value,
      dose: document.getElementById('dose_input').value,
      frecuency: document.getElementById('frecuency').value,
      duration: document.getElementById('duration').value,
    })

    if (!tbody) {
      console.error('No se encontró #mediament_table tbody');
      return;
    }

    if (!medicament.length) {
      tbody.innerHTML = `<tr><td colspan="4">Sin datos</td></tr>`;
      return;
    }

    tbody.innerHTML = medicament.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.dose}</td>
        <td>${item.frecuency}</td>
        <td>${item.duration}</td>
      </tr>
    `).join('');

  } 
  catch (error) {
    console.error('server error', error)
  }
}

function agregarAntecedente() {
  background.push({
    pariente: '',
    diabetes: false,
    hipertension: false,
    cancer: false,
    otros: ''
  });

  render();
}


function finishAttention(){
  location.reload()
}

function  showModalMedicaments(){
  try {
      const modalContainer = document.createElement('div')
      modalContainer.innerHTML = `     
        <div class="modal fade" id="dynamicModal" tabindex="-1">

            <div class="modal-dialog modal-dialog-centered modal-lg">

                <div class="modal-content">

                    <!-- HEADER -->
                    <div class="modal-header">

                        <h5 class="modal-title">
                            Agregar Medicamento
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal">
                        </button>

                    </div>

                    <!-- FORM -->
                    <form id="medicationForm">

                        <!-- BODY -->
                        <div class="modal-body">

                            <div class="row">

                                <div class="col-md-6 mb-3">
                                    <label class="form-label">
                                        Nombre Medicamento
                                    </label>

                                    <input
                                        type="text"
                                        id="name_medication"
                                        class="form-control">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label">
                                        Dosis
                                    </label>

                                    <input
                                        type="text"
                                        id="dose_input"
                                        class="form-control">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label">
                                        Frecuencia
                                    </label>

                                    <select
                                        id="frecuency"
                                        class="form-select"
                                      >

                                        <option value="2 horas">2 horas</option>
                                        <option value="4 horas">4 horas</option>
                                        <option value="8 horas">8 horas</option>
                                        <option value="12 horas">12 horas</option>
                                        <option value="24 horas">24 horas</option>
                                        <option value="48 horas">48 horas</option>

                                    </select>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label">
                                        Duración
                                    </label>

                                    <input
                                        type="text"
                                        id="duration"
                                        class="form-control">
                                </div>

                                <div class="col-md-12 mb-3">

                                    <label class="form-label">
                                        Vía de administración
                                    </label>

                                    <select
                                        id="administration"
                                        class="form-select">

                                        <option value="Oral">Oral</option>
                                        <option value="Subcutánea">Subcutánea</option>
                                        <option value="Intravenosa">Intravenosa</option>

                                    </select>

                                </div>

                            </div>

                        </div>

                        <!-- FOOTER -->
                        <div class="modal-footer">

                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal">

                                Cancelar

                            </button>

                            <button
                              type="button"
                              class="btn btn-primary"
                              onclick="renderTableMedicament()"
                              data-bs-dismiss="modal"
                          >

                                Guardar

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
      `
      document.body.appendChild(modalContainer)
      const modalElement = document.getElementById('dynamicModal')
      const modal = new bootstrap.Modal(modalElement)
      modal.show()
      modalElement.addEventListener('hidden.bs.modal', () => {
          modalContainer.remove()
      })
  } catch (error) {
    console.error(error)
  }
}

function showModalFinishConsultation(){
  try {
    // 1. Crear contenedor
      const modalContainer = document.createElement('div')

      // 2. HTML del modal
      modalContainer.innerHTML = `     
        <div class="modal fade" id="dynamicModal" tabindex="-1">

            <div class="modal-dialog modal-dialog-centered modal-lg">

                <div class="modal-content">

                    <!-- HEADER -->
                    <div class="modal-header">

                        <h5 class="modal-title">
                          Atencion
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal">
                        </button>
                    </div>
                    <div class="message-container">
                      <p>Estas apunto de  finaliza la consulta estas seguro</p>
                      <div class="button-container">
                        <button class="btn btn-danger" data-bs-dismiss="modal">cancelar </button>
                        <button class="btn btn-primary" data-bs-dismiss="modal" onclick="finishAttention()">Aceptar</button>
                      </div>
                    </div>
                </div>

            </div>

        </div>
      `

      // 3. Insertar al body
      document.body.appendChild(modalContainer)

      // 4. Obtener modal
      const modalElement = document.getElementById('dynamicModal')

      // 5. Inicializar Bootstrap
      const modal = new bootstrap.Modal(modalElement)

      // 6. Mostrar
      modal.show()

      // 7. Limpiar al cerrar
      modalElement.addEventListener('hidden.bs.modal', () => {
          modalContainer.remove()
      })
  } 
  catch (error) {
    console.error('error show modal medicament', error)  
  }
}


function etnicalGroup(){
  const checkbox = document.getElementById('eticalGroupCheckbox');
  const target = document.getElementById('etnical-group');

  if (checkbox.checked) {
    target.style.display = 'block';
    console.log('Está marcado (true)');
  } else {
    target.style.display = 'none';
    console.log('No está marcado (false)');
  }

}
function regresarConsulta(){

    document.getElementById('tableConsultationPatient').style.display = 'grid';

    document.getElementById('patientConsultForm').style.display = 'none';

    document.getElementById('consultationTabs').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('etnicalGroupCheckbox');
    const target = document.getElementById('etnical-group');
    const resultado = document.getElementById('result');

    checkbox.addEventListener('change', () => {
        const valor = checkbox.checked ? 'Sí' : 'No';

        // Mostrar en pantalla
        resultado.textContent = valor;

        // Mostrar/ocultar textarea
        target.style.display = checkbox.checked ? 'block' : 'none';
    });
});