const patientArray = [
  {
    name: "Pedro Infante Cruz",
    curp: "IACP171118HSLNRD03",
    age: 45,
    gender: "Masculino",
    status: "Activo",
  },
];

const paciente = {
  datos_generales: {
    nombre: "Pedro Infante Cruz",
    edad: 45,
    sexo: "Masculino",
    curp: "IACP171118HSLNRD03",
    address:'Cruz 2, Centro, 82040 Mazatlán, Sin.',
    blood:' O+'
  },

  ultimas_visitas: [
    {
      fecha: "2026-05-01",
      motivo: "Dolor de cabeza",
      diagnostico: "Migraña",
    },
    {
      fecha: "2026-03-15",
      motivo: "Dolor abdominal",
      diagnostico: "Gastritis",
    },
  ],

  medicamentos: ["Paracetamol 500mg", "Omeprazol 20mg", "Ibuprofeno 400mg"],

  historial_clinico: [
    {
      fecha: "2025-11-20",
      descripcion: "Hipertensión arterial diagnosticada",
    },
    {
      fecha: "2024-08-10",
      descripcion: "Cirugía de apéndice",
    },
  ],

  antecedentes_heredofamiliares: [
    "Padre con Diabetes Mellitus",
    "Madre con Hipertensión",
    "Abuelo con Alzheimer",
  ],
};

/* =========================================
   CARGAR DATOS GENERALES
========================================= */

function loadPatient() {
  try {
    document.getElementById("nombrePaciente").textContent =
      paciente.datos_generales.nombre;

    document.getElementById("edadPaciente").textContent =
      paciente.datos_generales.edad + " años";

    document.getElementById("sexoPaciente").textContent =
      paciente.datos_generales.sexo;

    document.getElementById("curpPaciente").textContent =
      paciente.datos_generales.curp;
      
    document.getElementById("addressPaciente").textContent =
      paciente.datos_generales.address;
    
    document.getElementById("bloodType").textContent =
      paciente.datos_generales.blood;

    const visitasContainer = document.getElementById("visitasContainer");

    paciente.ultimas_visitas.forEach((visita) => {
      visitasContainer.innerHTML += `
    
        <div class="card mb-3 border-0 shadow-sm">
            <div class="card-body">

                <div class="d-flex justify-content-between">
                    <h6 class="fw-bold">${visita.motivo}</h6>
                    <span class="badge bg-primary">
                        ${visita.fecha}
                    </span>
                </div>

                <p class="mb-0">
                    Diagnóstico: ${visita.diagnostico}
                </p>

            </div>
        </div>

    `;
    });

    /* =========================================
   MEDICAMENTOS
========================================= */

    const medicamentosContainer = document.getElementById(
      "medicamentosContainer",
    );

    paciente.medicamentos.forEach((medicamento) => {
      medicamentosContainer.innerHTML += `
    
        <li class="list-group-item">
            ${medicamento}
        </li>

    `;
    });

    /* =========================================
   HISTORIAL CLINICO
========================================= */

    const historialContainer = document.getElementById("historialContainer");

    paciente.historial_clinico.forEach((item) => {
      historialContainer.innerHTML += `
    
        <div class="border-start border-4 border-primary ps-3 mb-4">

            <h6 class="fw-bold">
                ${item.fecha}
            </h6>

            <p class="mb-0">
                ${item.descripcion}
            </p>

        </div>

    `;
    });

    /* =========================================
   ANTECEDENTES
========================================= */

    const antecedentesContainer = document.getElementById(
      "antecedentesContainer",
    );

    paciente.antecedentes_heredofamiliares.forEach((item) => {
      antecedentesContainer.innerHTML += `
    
        <li class="list-group-item">
            ${item}
        </li>

    `;
    });
  } catch (error) {
    console.error("esto es error", error);
  }
}

function selectedPatient() {
  try {
    document.getElementById("patient_table").style.display = "none";
    document.getElementById("patient_information").style.display = "grid";
  } catch (error) {
    console.error(error);
  }
}

function renderTablePatient() {
  try {
    const tbody = document.querySelector("#patient_table tbody");
    tbody.innerHTML = patientArray
      .map(
        (item, index) => `
        <tr onclick="selectedPatient()">
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.curp}</td>
            <td>${item.age}</td>
            <td>${item.gender}</td>
            <td>${item.status}</td>
        </tr>
        `,
      )
      .join("");
  } catch (error) {
    console.log("Server error", error);
  }
}

document.addEventListener("DOMContentLoaded", renderTablePatient);
document.addEventListener("DOMContentLoaded", loadPatient);
