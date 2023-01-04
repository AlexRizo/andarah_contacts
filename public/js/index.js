const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:8080'
            : 'https://andarahcontacts-production.up.railway.app')

const token = localStorage.getItem('auth-token') || null;

if (!token) {
    console.log('object');
}

const table = document.querySelector('.table');

let ir = 0;

fetch(`${ url }/client/get`, {
    headers: {
        'tkn': token
    }
})
.then(resp => resp.json())
.then(({ clients }) => {

    console.log(clients);
    
    clients.forEach(client => {
        table.innerHTML += `
            <div class="table-row">
                <span class="table-data">${ client.id             }</span>
                <span class="table-data">${ client.name           }</span>
                <span class="table-data">${ client.email          }</span>
                <span class="table-data">${ client.city           }</span>
                <span class="table-data">${ client.phone_number   }</span>
                <span class="table-data">${ client.reason         }</span>
                <span class="table-data">${ ((client.contact_status) === true ? 'Contactado' : 'Pendiente') }</span>
                <span class="table-data">${ client.date_contact   }</span>
                <span class="table-data">${ client.origin         }</span>
                <span class="table-data">${ client.pl             }</span>
                <span class="table-data">${ client.gr             }</span>
                <span class="table-data">${ ((client.staffId) != null ? client.Staff.name : 'Sin asignar') }</span>
                <span class="table-data">${ ((client.note) != null ? client.note : '---') }</span>
            </div>
        `;
    });

    const tableRow = document.querySelectorAll('.table-row');
    for (const row of tableRow) {
        ir++;
    
        if ((ir % 2) === 0) {
            row.style.background = '#EEEEEE';
        }
    }
})
.catch(error => {
    console.error(error)
    localStorage.removeItem('auth-token');
    window.location = url;
})
