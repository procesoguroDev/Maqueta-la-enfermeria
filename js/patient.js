const patientArray = [
    {
        name:'Pedro Infante Cruz',
        curp:' IACP171118HSLNRD03',
        age:10,
        gender: 'Hombre',
        status:'Activo'
    }
]


function selectedPatient(){
    try {
        document.getElementById('patient_table').style.display = 'none';
        document.getElementById('patient_information').style.display = 'grid';
    } 
    catch (error) {
        console.error(error);
    }
}


function  renderTablePatient(){
    try {
        const tbody = document.querySelector('#patient_table tbody');
        tbody.innerHTML = patientArray.map((item,index) => `
        <tr onclick="selectedPatient()">
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.curp}</td>
            <td>${item.age}</td>
            <td>${item.gender}</td>
            <td>${item.status}</td>
        </tr>
        `).join('');

    } catch (error) {
        console.log('Server error', error);
    }
}



document.addEventListener('DOMContentLoaded', renderTablePatient)