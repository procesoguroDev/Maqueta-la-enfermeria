const  service =  [
    {
        service:'Toma de signos',
        paramedics:' Alejandro , Luz',
        address:'Boeing 35-43, La Purísima, 76146 La Purísima, Qro.',
        unit: 'AMB-01',
        outBase:'2026-05-01 10:30 am',
        inBase:'2026-05-01 15:30 pm',
        status:'Completo'
    },
    {
        service:'Toma de signos',
        paramedics:' Alejandro , Luz',
        address:'Boeing 35-43, La Purísima, 76146 La Purísima, Qro.',
        unit: 'AMB-01',
        outBase:'2026-05-01 10:30 am',
        inBase:'2026-05-01 15:30 pm',
        status:'Completo'
    },
    {
        service:'Toma de signos',
        paramedics:' Alejandro , Luz',
        address:'Boeing 35-43, La Purísima, 76146 La Purísima, Qro.',
        unit: 'AMB-01',
        outBase:'2026-05-01 10:30 am',
        inBase:'2026-05-01 15:30 pm',
        status:'Completo'
    }
]

function selectedServiceFrap() {
    try {
        console.log('hola click')
    }
    catch (error) {
        console.error(error)    
    }
}

function pushService(){
    try {

        const signsType = document.getElementById('signsService').value;
        const unit = document.getElementById('unitSelector').value;
        const outBase = document.getElementById('outTime').value;
        const address = document.getElementById('address').value;

        service.push({
            service:signsType,
            unit,
            outBase:outBase,
            paramedics:'Luis y Adriana',
            inBase:'--------',
            address,
            status:'Por completar'
        })

        renderService();
    } 
    catch (error) {
        console.error('error push', error);    
    }
}

function renderService(){
    try {
        const tbodyActive= document.getElementById('service-paramedic-active');
        const tbody= document.getElementById('service-paramedic');
        tbodyActive.innerHTML= service.map(
            (item,index) =>{
                if (item.status  === 'Completo'){
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.service}</td>
                            <td>${item.unit}</td>
                            <td>${item.address}</td>
                            <td>${item.paramedics}</td>
                            <td>${item.outBase}</td>
                            <td>${item.inBase}</td>
                            <td class="badge  text-bg-success">${item.status}</td>
                        </tr>
                    `
                }
            }
        );

        tbody.innerHTML= service.map(
            (item,index) => {
                if (item.status === 'Activo'  || item.status === 'Por completar'){
                    return `
                        <tr onclick="selectedServiceFrap()">
                            <td>${index + 1}</td>
                            <td>${item.service}</td>
                            <td>${item.unit}</td>
                            <td>${item.address}</td>
                            <td>${item.paramedics}</td>
                            <td>${item.outBase}</td>
                            <td >${item.inBase}</td> 
                            <td class="badge  text-bg-primary">${item.status}</td>
                            <td><input type="file" placeholder="Adjuntar evidencia"></td>
                        </tr>
                    `
                }
            }
        );
    }
    catch (error) {
        console.error('error',error)    
    }
}

function createNewService(){
    try {
        const today = new Date().toISOString().slice(0,16)

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
                                Registro de Evento FRAP
                            </h5>

                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal">
                            </button>
                        </div>
                        <div class="message-container"
                            <div class="grid grid-3">
                             <div class="form-group">
                                    <label> Tipo de servicio</label>
                                    <select  id="signsService">
                                        <option>Toma de signos</option>
                                        <option>Eventos</option>
                                        <option>Transbordo</option>
                                        <option>Urgencia</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Unidad</label>
                                    <select id="unitSelector">
                                        <option>AMB-01</option>
                                        <option>AMB-02</option>
                                        <option>AMB-03</option>
                                        <option>AMB-04</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Salida</label>
                                    <input
                                        id="outTime"
                                        type="datetime-local"
                                        min=${today}    
                                    >
                                </div>
                                <div class="form-group">
                                    <label>Paciente</label>
                                    <select id="unitSelector">
                                        <option>Pedro infante</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Direccion del lugar.</label>
                                <input type="text" id="address" placeholder="escribe la direccion."></input>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar

                                </button>
                                <button
                                    type="button"
                                    class="btn btn-success"
                                    onclick="pushService()"
                                    data-bs-dismiss="modal"
                                >

                                    Crear

                                </button>

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
        console.error('error', error)
    }
}


document.addEventListener("DOMContentLoaded", renderService);