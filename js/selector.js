const multiselectBox = document.getElementById("multiselectBox");

const dropdown = document.getElementById("dropdown");

const options = document.querySelectorAll(".option");

// Abrir/Cerrar dropdown
multiselectBox.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

// Actualizar tags
options.forEach((option) => {
  option.addEventListener("change", actualizarSeleccion);
});

function actualizarSeleccion() {
  const seleccionados = [];

  options.forEach((option) => {
    if (option.checked) {
      seleccionados.push(option.value);
    }
  });

  multiselectBox.innerHTML = "";

  if (seleccionados.length === 0) {
    multiselectBox.innerHTML =
      '<span class="placeholder">Selecciona tecnologías</span>';

    return;
  }

  seleccionados.forEach((valor) => {
    multiselectBox.innerHTML += `<span class="selected-tag">${valor}</span>`;
  });
}

// Obtener valores
function obtenerValores() {
  const valores = [];

  options.forEach((option) => {
    if (option.checked) {
      valores.push(option.value);
    }
  });

  console.log(valores);

  alert(JSON.stringify(valores));
}

// Cerrar al hacer click fuera
document.addEventListener("click", (e) => {
  if (!multiselectBox.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});
