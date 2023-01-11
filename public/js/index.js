const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:8080'
            : 'https://andarahcontacts-production.up.railway.app')

const token = localStorage.getItem('auth-token') || null;

const table = document.querySelector('.table');
const form = document.querySelector('.form-edit');
const btnDelete = document.querySelector('.btn-delete');
const btnSave = document.querySelector('.btn-save');
const modal = document.querySelector('.modal');
const quitModal = document.querySelector('.bg-edit-modal');
const inpS = document.querySelector('.conS')

let socket = null;

const init = async() => {
    fetch(`${ url }/client/get`, {
        headers: {
            'tkn': token
        }
    })
    .then(resp => resp.json())
    .then(({ clients }) => {        
        createTable(clients)
    })
    .catch(error => {
        console.error(error)
        localStorage.removeItem('auth-token');
        window.location = url;
    })

}

const createTable = (clients) => {
    const tData = document.querySelectorAll('.table-row');

    let ir = 0;

    if ( !(tData.length < 1) ) {
        for (let i = 0; i < tData.length; i++) {
            table.removeChild(tData[i]);
        }
    }

    clients.forEach(client => {
        table.innerHTML += `
            <div class="table-row" onclick="editClient(${ client.id })">
                <span class="table-data">${ client.id             }</span>
                <span class="table-data">${ client.name           }</span>
                <span class="table-data">${ client.email          }</span>
                <span class="table-data">${ client.city           }</span>
                <span class="table-data">${ client.phone_number   }</span>
                <span class="table-data">${ client.reason         }</span>
                <span class="table-data">${ ((client.contact_status) === true ? '<p style="color: green;">Contactado</p>' : '<p style="color: red;">Pendiente</p>') }</span>
                <span class="table-data">${ client.date_contact   }</span>
                <span class="table-data">${ client.origin         }</span>
                <span class="table-data">${ client.pl             }</span>
                <span class="table-data">${ client.gr             }</span>
                <span class="table-data">${ ((client.staffId) != null ? client.Staff.name : 'Sin asignar') }</span>
                <span class="table-data">${ ((client.note) != null ? client.note : '---') }</span>
            </div>
        `;
    });


}

const editClient = (id) => {
    socket.emit('get-client-data', { id });
    modal.classList.toggle('hidden__true');
}

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'tkn': token
        }
    });

    socket.on('connect', () => console.log('Socket Online'));
    socket.on('disconnect', () => console.log('Socket Offline'));
    socket.on('client-sndd', ({ client }) => {
        for (const el of form.elements) {
            if (el.name) {
                el.value = client[el.name];
            }
        }
        inpS.value = (client.contact_status === true ? 1 : 0); 
    });
    socket.on('confirm-delete', ({ clients }) => {
        alert('Registro eliminado...');

        createTable(clients);
    })
}

quitModal.addEventListener('click', () => {
    modal.classList.toggle('hidden__true');
    for (const el of form.elements) {
        if (el.name) {
            el.value = '';
        }
    }
});

btnSave.addEventListener('click', () => {
    const formData = {};
    
    for (const inp of form.elements) {
        formData[inp.name] = inp.value;
    }

    fetch(`${ url }/client/update`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
            'tkn': token,
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(({ clients }) => {
        createTable(clients);
    })
    .catch(console.warn());
});

btnDelete.addEventListener('click', () => {
    const id = document.querySelector('.input').value;
    
    if( confirm('Eliminar?')) {
        socket.emit('delete-client', {id});
    }

    modal.classList.toggle('hidden__true');
    for (const el of form.elements) {
        if (el.name) {
            el.value = '';
        }
    }
});

const main = async() => {
    await init();
    await connectSocket();
}

main();