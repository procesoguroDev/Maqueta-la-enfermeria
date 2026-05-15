const CONFIG_MEM = {
        'ACUDE': { color: '#0d9488', bg: '#f0fdfa', ben: ['Consulta $200', 'Triage preferente', 'Farmacia 15%'] },
        'VITAL ADULTOS': { color: '#6366f1', bg: '#f5f3ff', ben: ['Check-up anual', '2 consultas gratis', 'Laboratorio 20%'] },
        'FAMILIAR VITAL PLUS': { color: '#db2777', bg: '#fdf2f8', ben: ['Consultas ilimitadas', 'Ambulancia gratis', 'Rayos X 50%'] }
    };

    const pacientesDirectorio = [
        { 
            nom: 'Luis Alberto', pat: 'Mendoza', mat: 'Arriaga', curp: 'MEAL900512HDFRRS01', fec: '1990-05-12', tel: '4421234567', correo: 'luis@example.com', mem: 'ACUDE', 
            visitas: [
                { fecha: '18 Abr 2026', motivo: 'Consulta Médica - Control Crónico', medico: 'Dra. Elena Ruiz' },
                { fecha: '05 Mar 2026', motivo: 'Laboratorio - Química Sanguínea', medico: 'Dra. Elena Ruiz' }
            ] 
        },
        { 
            nom: 'Ana María', pat: 'García', mat: 'Ruiz', curp: 'GARA850315MDFRZN08', fec: '1985-03-15', tel: '4429876543', correo: 'ana@example.com', mem: 'FAMILIAR VITAL PLUS', 
            visitas: [
                { fecha: '29 Abr 2026', motivo: 'Rayos X - Tele de Tórax', medico: 'Dr. Roberto Ortiz' }
            ] 
        },
        { 
            nom: 'Roberto', pat: 'Sánchez', mat: 'Pérez', curp: 'SAPR721120HDFNRB04', fec: '1972-11-20', tel: '4421112233', correo: 'roberto@example.com', mem: 'VITAL ADULTOS', 
            visitas: [
                { fecha: '30 Mar 2026', motivo: 'Urgencias - Contusión', medico: 'Dr. Luis Hernández' }
            ] 
        },
        { 
            nom: 'Elena', pat: 'Reyes', mat: 'Mora', curp: 'REME950805MDFYRL09', fec: '1995-08-05', tel: '4425556677', correo: 'elena@example.com', mem: null, 
            visitas: []
        }
    ];

    let nFolio = Number(localStorage.getItem('erp_folio')) || 5020;
    let pacientesActivos = JSON.parse(localStorage.getItem('erp_pacientes_activos') || '[]');
    let pacientesFinalizados = Number(localStorage.getItem('erp_finalizados')) || 0;
    let editIndex = null; 
    let consentimientoFirmado = false; // Variable global para la firma

    window.onload = () => { renderDirectorio(); renderAtencion(); updateStats(); inicializarCanvas(); };

    function handleCURP(val) {
        val = val.toUpperCase();
        document.getElementById('adm-curp').value = val;
        
        if (val.length >= 10) {
            let año = val.substring(4, 6);
            let mes = val.substring(6, 8);
            let dia = val.substring(8, 10);
            
            let siglo = Number(año) <= 26 ? '20' : '19';
            let fecha = `${siglo}${año}-${mes}-${dia}`;
            document.getElementById('adm-fec').value = fecha;
            calcEdad(fecha);
        }
    }

    function calcEdad(fec) {
        if(!fec) return;
        const nac = new Date(fec + 'T00:00:00');
        const hoy = new Date();
        let edad = hoy.getFullYear() - nac.getFullYear();
        if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
        document.getElementById('adm-edad').value = edad + ' años';
    }

    function openSubTab(e, id) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if(e) e.currentTarget.classList.add('active');
    }

    function toggleExtra(v) {
        document.getElementById('extra-consulta').style.display = (v === 'consulta' || v === 'urgencias') ? 'block' : 'none';
        /* document.getElementById('extra-rx').style.display = (v === 'rx') ? 'block' : 'none';
        document.getElementById('extra-lab').style.display = (v === 'laboratorio') ? 'block' : 'none';
        document.getElementById('extra-enfermeria').style.display = (v === 'enfermeria') ? 'block' : 'none'; */
    }

    // --- CANVAS DE FIRMA ---
    let canvas, ctx, isDrawing = false;
    
    function inicializarCanvas() {
        canvas = document.getElementById('canvas-firma');
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0f172a';

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
        canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
        canvas.addEventListener('touchend', stopDrawing);
    }

    function startDrawing(e) { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); }
    function draw(e) { if (!isDrawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }
    function stopDrawing() { isDrawing = false; }

    function handleTouchStart(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        ctx.stroke();
    }

    function abrirFirma() {

        const modal = new bootstrap.Modal(
            document.getElementById('modFirma')
        );

        modal.show();

        setTimeout(() => {

            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width;
            canvas.height = rect.height;

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

        }, 300);
    }

    function limpiarCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        consentimientoFirmado = false;
        /* const btn = document.getElementById('btn-firma');
        btn.className = 'btn btn-outline';
        btn.innerHTML = '✍️ Recabar Consentimiento'; */
    }

    function guardarFirma() {
        consentimientoFirmado = true;
        const btn = document.getElementById('btn-firma');
        btn.className = 'btn btn-success'; 
        btn.innerHTML = '✅ Consentimiento Firmado';
        bootstrap.Modal
    .getInstance(document.getElementById('modFirma'))
    .hide();
    }

    // --- HISTORIAL CLÍNICO ---
    function verHistorial(curp) {
        const p = pacientesDirectorio.find(pac => pac.curp === curp);
        if(!p) return;

        document.getElementById('hist-paciente-info').innerHTML = `
            <strong>Paciente:</strong> ${p.nom} ${p.pat} ${p.mat || ''}<br>
            <strong>CURP:</strong> ${p.curp}<br>
            <strong>Teléfono:</strong> ${p.tel}<br>
            <strong>Afiliación:</strong> ${p.mem ? p.mem : 'Paciente Particular'}
        `;

        const contenedorVisitas = document.getElementById('hist-visitas');
        if (p.visitas && p.visitas.length > 0) {
            contenedorVisitas.innerHTML = p.visitas.slice(0, 3).map(v => `
                <div class="timeline-item">
                    <div style="font-size:11px; font-weight:800; color:var(--primary);">${v.fecha}</div>
                    <div style="font-size:14px; font-weight:600;">${v.motivo}</div>
                    <div style="font-size:12px; color:var(--text-muted);">Atendió: ${v.medico}</div>
                </div>
            `).join('');
        } else {
            contenedorVisitas.innerHTML = `<div style="font-size:13px; color:var(--text-muted); font-style:italic;">No hay registros de visitas previas.</div>`;
        }

        const btnAdmision = document.getElementById('btn-hist-admision');
        btnAdmision.onclick = function() {
            bootstrap.Modal
            .getInstance(document.getElementById('modHistorial'))
            .hide();
            quickAdm(p.curp);
        };

        new bootstrap.Modal(
            document.getElementById('modHistorial')
        ).show();
    }

    // --- ADMISIÓN RÁPIDA ---
    function quickAdm(curp) {
        try {
            limpiarForm(); 
            const p = pacientesDirectorio.find(pac => pac.curp === curp);
            if(!p) return;
            
            document.getElementById('adm-nom').value = p.nom;
            document.getElementById('adm-pat').value = p.pat;
            document.getElementById('adm-mat').value = p.mat || '';
            document.getElementById('adm-curp').value = p.curp;
            document.getElementById('adm-tel').value = p.tel;
            document.getElementById('adm-correo').value = p.correo || '';
            
            handleCURP(p.curp);
            document.getElementById('adm-tipo-paciente').value = p.mem ? 'Membresía' : 'Particular';
            mostrarMembresia(p.mem);
            const triggerEl = document.getElementById('btn-tab-admision');
            const tab = new bootstrap.Tab(triggerEl);
            tab.show();
        } 
        catch (error) {
            console.error('error', error)    
        }
    }

    function mostrarMembresia(mem) {
        const panel = document.getElementById('panel-membresia');
        if(!mem) { panel.style.display = 'none'; return; }
        
        const c = CONFIG_MEM[mem];
        panel.style.display = 'block';
        panel.style.borderColor = c.color;
        panel.style.background = c.bg;
        document.getElementById('mem-titulo').innerText = 'MEMBRESÍA ACTIVA: ' + mem;
        document.getElementById('mem-titulo').style.color = c.color;
        document.getElementById('mem-lista').innerHTML = c.ben.map(b => `<div class="ben-tag">✅ ${b}</div>`).join('');
    }

    function checkMembresiaManual(v) { 
        if(v !== 'Membresía') document.getElementById('panel-membresia').style.display = 'none'; 
    }

    function openUrgencia() {
        if(!confirm("🚨 ¿Desea generar un folio inmediato para ingreso a Urgencias?")) return;
        
        const folio = `URG-${nFolio++}`;
        const pac = {
            folio,
            nombre: `Paciente No Identificado`,
            servicio: 'urgencias',
            prioridad: 'Crítico',
            cubiculo: 'No asignado',
            hora: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        };

        pacientesActivos.unshift(pac);
        guardarYSincronizar();
        
        document.getElementById('fol-num').innerText = folio;
        new bootstrap.Modal(
            document.getElementById('modFolio')
        ).show();
    }

    function completarDatos(i) {
        try {
            editIndex = i;
            const p = pacientesActivos[i];
            
            limpiarForm();
            
           /*  document.getElementById('adm-serv').value = p.servicio;
            document.getElementById('adm-prio').value = p.prioridad;
            document.getElementById('adm-sucursal').value = 'Urgencias'; 
            
            if(p.cubiculo !== 'No asignado') {
                document.getElementById('adm-cubiculo').value = p.cubiculo;
            }*/

            toggleExtra(p.servicio);
            openSubTab(null, 'tab-admision');
            
            document.getElementById('btn-guardar-adm').innerText = "Actualizar Datos y Cubículo";
            document.getElementById('main-scroll').scrollTop = 0;
            
            alert("📝 Complete el nombre, CURP y asigne el cubículo de observación para este paciente.");
        } 
        catch (error) {
            console.error('seerver error', error)    
        }
    }

    function finalizarNormal() {
        const nom = document.getElementById('adm-nom').value.trim();
        const pat = document.getElementById('adm-pat').value.trim();
        const curp = document.getElementById('adm-curp').value.trim();
        const serv = document.getElementById('adm-serv').value;
        // const cub = document.getElementById('adm-cubiculo').value;
        // const prio = document.getElementById('adm-prio').value;
        
        if(!nom || !pat || !curp || !serv) {
            return alert("Por favor complete los campos obligatorios marcados con (*)");
        }
        if(curp.length < 18) {
            return alert("La CURP debe tener 18 caracteres.");
        }

        // VALIDACIÓN DE FIRMA PARA ENFERMERÍA
        if(serv === 'enfermeria' && !consentimientoFirmado) {
            return alert("⚠️ Es obligatorio recabar la firma de consentimiento para procedimientos de enfermería.");
        }

        if (editIndex !== null) {
            pacientesActivos[editIndex].nombre = `${nom} ${pat}`;
            pacientesActivos[editIndex].servicio = serv;
            
            guardarYSincronizar();
            alert("✅ Datos del paciente actualizados correctamente.");
            limpiarForm();
            document.getElementById('btn-tab-atencion').click();
            return; 
        }
        const folio = `ADM-${nFolio++}`;
        
        const pac = {
            folio,
            nombre: `${nom} ${pat}`,
            servicio: serv,
            hora: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        };

        pacientesActivos.unshift(pac);
        guardarYSincronizar();
        
        document.getElementById('fol-num').innerText = folio;
        new bootstrap.Modal(
            document.getElementById('modFolio')
        ).show();
        limpiarForm();
    }

    function renderAtencion() {
        const lista = document.getElementById('lista-atencion');
        if (pacientesActivos.length === 0) {
            lista.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted); border: 1px dashed var(--border); border-radius: 12px;">
                    No hay pacientes activos por el momento.
                </div>
            `;
            return;
        }
        lista.innerHTML = pacientesActivos.map((p, i) => {
            const esGenerico = p.nombre === 'Paciente No Identificado';
            
            const btnHtml = esGenerico 
                ? `<div style="display:flex; gap:8px;">
                       <button class="btn btn-warning" style="flex:1; border-radius:8px;" onclick="completarDatos(${i})">✏️ Completar</button>
                       <button class="btn btn-outline" style="flex:1; border-radius:8px;" onclick="alta(${i})">Alta</button>
                   </div>`
                : `<button class="btn btn-outline" style="width:100%; border-radius:8px;" onclick="alta(${i})">Finalizar Atención</button>`;

            return `
            <div class="card" style="border-left:5px solid ${p.prioridad === 'Crítico' ? 'var(--danger)' : p.prioridad === 'Urgente' ? 'var(--warning)' : 'var(--primary)'}; margin-bottom: 0;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
                    <span class="badge ${p.prioridad === 'Crítico' ? 'badge-critico' : p.prioridad === 'Urgente' ? 'badge-urgente' : 'badge-normal'}">${p.prioridad}</span>
                    <span class="badge badge-info">${p.folio}</span>
                </div>
                <h4 style="margin:5px 0 12px 0; font-size:15px; color:${esGenerico ? 'var(--danger)' : 'var(--sidebar)'}">${p.nombre}</h4>
                <div style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:15px;">
                    <strong>Servicio:</strong> ${p.servicio.toUpperCase()}<br>
                    <strong>Cubículo:</strong> ${p.cubiculo || 'No asignado'}<br>
                    <strong>Ingreso:</strong> ${p.hora}
                </div>
                ${btnHtml}
            </div>
            `;
        }).join('');
    }

    function alta(i) {
        if(!confirm("¿Desea finalizar la atención de este paciente?")) return;
        pacientesActivos.splice(i, 1);
        pacientesFinalizados++;
        guardarYSincronizar();
    }

    function limpiarAtencion() {
        if (!confirm('Esto eliminará los pacientes activos guardados. ¿Continuar?')) return;
        pacientesActivos = [];
        guardarYSincronizar();
    }

    function guardarYSincronizar() {
        localStorage.setItem('erp_pacientes_activos', JSON.stringify(pacientesActivos));
        localStorage.setItem('erp_folio', nFolio);
        localStorage.setItem('erp_finalizados', pacientesFinalizados);
        renderAtencion();
        updateStats();
    }

    function updateStats() {
        document.getElementById('stat-activos').innerText = pacientesActivos.length;
        document.getElementById('stat-urgencias').innerText = pacientesActivos.filter(p => p.prioridad === 'Crítico').length;
        document.getElementById('stat-finalizados').innerText = pacientesFinalizados;
        document.getElementById('stat-espera').innerText = pacientesActivos.filter(p => p.prioridad === 'Normal').length;
    }

    function renderDirectorio() {
        document.getElementById('lista-directorio').innerHTML = pacientesDirectorio.map(p => {
            const badgeMem = p.mem 
                ? `<span class="badge" style="background:${CONFIG_MEM[p.mem].bg}; color:${CONFIG_MEM[p.mem].color}">${p.mem}</span>` 
                : `<span class="badge badge-muted">Particular</span>`;

            return `
            <tr>
                <td><strong>${p.pat} ${p.mat}</strong>, ${p.nom}<br><small style="color:var(--text-muted);">${p.correo}</small></td>
                <td style="font-family:monospace;">${p.curp}</td>
                <td>${p.tel}</td>
                <td>${badgeMem}</td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-outline" style="padding:6px 12px;" onclick="verHistorial('${p.curp}')">Historial</button>
                        <button class="btn btn-primary" style="padding:6px 12px;" onclick="quickAdm('${p.curp}')">Admisión</button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
    }

    function filterTable(input) {
        let val = input.value.toUpperCase();
        document.querySelectorAll('#lista-directorio tr').forEach(tr => {
            tr.style.display = tr.innerText.toUpperCase().includes(val) ? '' : 'none';
        });
    }

    function limpiarForm() {
        editIndex = null;
        document.getElementById('btn-guardar-adm').innerText = "Confirmar Ingreso a Atención";

        document.querySelectorAll('#tab-admision input').forEach(el => el.value = '');
        document.querySelectorAll('#tab-admision textarea').forEach(el => el.value = '');
        
        document.getElementById('adm-sexo').value = '';
        document.getElementById('adm-serv').value = '';
        /* 
        document.getElementById('adm-prio').value = 'Normal';
        document.getElementById('adm-tipo-paciente').value = 'Particular';
        document.getElementById('adm-pago').value = 'Efectivo';
        document.getElementById('adm-sucursal').value = 'Clínica Principal';
        document.getElementById('adm-cubiculo').value = 'No asignado'; 
        */
        document.getElementById('adm-motivo-sel').value = '';
        
        limpiarCanvas(); // IMPORTANTE: Reseteamos la firma
        
        document.getElementById('panel-membresia').style.display = 'none';
        toggleExtra('');
    }