const steps = document.querySelectorAll(".wizard-step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const currentStepText = document.getElementById("currentStep");

let currentStep = 0;

function updateWizard() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  currentStepText.innerText = currentStep + 1;

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";

  nextBtn.innerText =
    currentStep === steps.length - 1 ? "Finalizar" : "Siguiente";
}

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateWizard();
  } else {
    alert("Formulario finalizado");
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateWizard();
  }
});

updateWizard();
