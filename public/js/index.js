const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'http://localhost:3000')

const token = localStorage.getItem('auth-token') || null;

const table = document.querySelector('.table');

let socket;

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
    });
}

const createTable = (clients) => {
    const tData = document.querySelectorAll('.table-row');

    if ( !(tData.length < 1) ) {
        for (let i = 0; i < tData.length; i++) {
            table.removeChild(tData[i]);
        }
    }
    
    clients.forEach(client => {
        table.innerHTML += `
            <a href="${ url }/client/view/${ client.id }?tkn=${ token }" class="table-row ${ ((client.contact_status) != true ? 'row-pending' : '') }">
                <span class="table-data">${ client.name           }</span>
                <span class="table-data">${ client.email          }</span>
                <span class="table-data">${ client.city           }</span>
                <span class="table-data">${ client.phone_number   }</span>
                <span class="table-data">${ client.reason         }</span>
                <span class="table-data">${ client.date_contact   }</span>
                <span class="table-data">${ client.Origin.name    }</span>
                <span class="table-data">${ ((client.staffId) != null ? client.Staff.name : 'Sin asignar') }</span>
                <span class="table-data">${ ((client.note) != null ? client.note : '---') }</span>
                <span class="table-data">${ ((client.contact_status) === true ? 'Contactado' : 'Pendiente') }</span>
            </a>
        `;
    });
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
    });

    socket.on('notification', ({ id, msg }) => {
        sendNotification('Nuevo Lead', msg);
    });
    
    socket.on('update-table', ({ clients }) => {
        createTable(clients);
    });
}

const orderTableByOrigin = (origin = 0) => {
    socket.emit('update-table-by', { origin })
}

const main = async() => {
    await init();
    await connectSocket();
}

main();