
const  vital_signs= [
  {
    time:'2026-01-05 10:30 pm',
    fr: 100,
    fc: 120,
    tad: 10,
    tas: 80,
    oxigen:80,
    tem: 35,
    gluicose: 100,
    capilar: 0
  }
]


const steps = document.querySelectorAll(".step");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentStepText = document.getElementById("currentStep");

let currentStep = 0;

// =============================


function showStep(index) {

    steps.forEach((step, i) => {

        if (i === index) {
            step.classList.add("active");
        }
        else {
            step.classList.remove("active");
        }

    });

    currentStepText.textContent = index + 1;

    // Ocultar botón anterior
    prevBtn.style.display =
        index === 0
        ? "none"
        : "inline-block";

    if (index === steps.length - 1) {
        nextBtn.textContent = "Finalizar";
    }
    else {
        nextBtn.textContent = "Siguiente";
    }
}


nextBtn.addEventListener("click", () => {

    // Si NO es el último paso
    if (currentStep < steps.length - 1) {

        currentStep++;

        showStep(currentStep);

    }
    else {

        alert("Wizard terminado");

    }

});


prevBtn.addEventListener("click", () => {

    if (currentStep > 0) {

        currentStep--;

        showStep(currentStep);

    }

});


function watcherGlassgow() {

    const ocular =
        parseInt(document.getElementById('glasgow_ocular').value) || 0;

    const verbal =
        parseInt(document.getElementById('glasgow_verbal').value) || 0;

    const motor =
        parseInt(document.getElementById('glasgow_motor').value) || 0;

    const total = ocular + verbal + motor;

    console.log("Glasgow Total:", total);

}

function  renderTableVitalSigns() {
    try {
        const tbody= document.getElementById('vital-signs-table');
        tbody.innerHTML= vital_signs.map(
            (item) => 
            `
              <tr>
                <td>${item.time}</td>
                <td>${item.fc}</td>
                <td>${item.fr}</td>
                <td>${item.tad}</td>
                <td>${item.tas}</td>
                <td>${item.oxigen}</td>
                <td >${item.tem}</td> 
                <td >${item.gluicose}</td> 
                <td >${item.capilar}</td> 
              </tr>
            `  
        );
    }
    catch (error) {
        console.error('error',error)    
    }
}


document.addEventListener("DOMContentLoaded", () => {

    // Mostrar paso inicial
    showStep(currentStep);
    renderTableVitalSigns();
    // Checkbox afiliado
    const followerCheck =
        document.getElementById('followerCheck');

    if (followerCheck) {
        followerCheck.checked = false;
    }

});
