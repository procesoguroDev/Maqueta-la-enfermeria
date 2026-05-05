class Modal{
    constructor() {
        this.create();
        this.bindEvents();
    }

    create() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay hidden';

        this.overlay.innerHTML = `
            <div class="modal">
              <div class="modal-header">
              <h3 class="modal-title"></h3>
              <button class="modal-close">&times;</button>
              </div>
              <div class="modal-body"></div>
              <div class="modal-footer"></div>
            </div>
            `;
        document.body.appendChild(this.overlay);
        this.title = this.overlay.querySelector('.modal-title');
        this.body = this.overlay.querySelector('.modal-body');
        this.footer = this.overlay.querySelector('.modal-footer');
        this.closeBtn = this.overlay.querySelector('.modal-close');
    }

    close() {
        this.overlay.classList.add('hidden');
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.close());

        this.overlay.addEventListener('click', (e) => {
            if(e.target === this.overlay) this.close();
        });
    }

    open({ title='', content= '', actions=[]}){
      this.title.textContent = title;
      this.body.innerHTML = content;
      this.footer.innerHTML = '';

      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.textContent = action.label;
        btn.className = action.class || '';

        btn.addEventListener('click', () => {
            action.onClick?.();
            this.close();
        });

        this.footer.appendChild(btn);
      });
      this.overlay.classList.remove('hidden');
    }

}

const modal = new Modal();

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
  document.getElementById('tableConsultationPatient').style.display = 'none';
  document.getElementById('patientConsultForm').style.display = 'grid';
  console.log("consultation_data",consultation_data)
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

function  showModalMedicaments(){
  try {
     modal.open({
      title:'Agregar Medicamento',
      content:`
        <div class="modal-content-class">
            <label>Nombre Medicamento</label>
            <input type="text" id="name_medication">
            <label>Dosis</label>
            <input type="text" id="dose_input">
        </div>
        <div class="modal-content-class">
            <label>Frecuencia</label>
            <select id="frecuency">
                <option value="2 horas">2 horas</option>
                <option value="4 horas">4 horas</option>
                <option value="8 horas">8 horas</option>
                <option value="12 horas">12 horas</option>
                <option value="24 horas">24 horas</option>
                <option value="48 horas">48 horas</option>
            </select>
            <label>Duracion</label>
            <input type="text" id="duration">
        </div>
        <div class="modal-content-class">
            <label>Via de admiinstracion:</label>
            <select id="administration">
                <option value="Oral">Oral</option>
                <option value="Suplementaria">Suplementaria</option>
                <option value="Intravenosa">Intravenosa</option>
            </select>
        </div>
      `,
      actions: [
        {
          label:'Cancelar',
          class: 'btn btn-red'
        },
        {
          label: 'Aceptar',
          class: 'btn btn-primary',
          onClick: () => renderTableMedicament()
        }
      ]
    })
  } catch (error) {
    console.error(error)
  }
}

function showModalFinishConsultation(){
  try {
    modal.open({
      title:'Finalizar consulta',
      content:`
        <div class="modal-content-class">
          <span> estas seguro de finalizar la consulta. </span>
        </div>
      `,
      actions: [
        {
          label:'Cancelar',
          class: 'btn btn-red'
        },
        {
          label: 'Aceptar',
          class: 'btn btn-primary',
          onClick: () => console.log('hola')
        }
      ]
    })
  } 
  catch (error) {
    console.error('error show modal medicament', error)  
  }
}