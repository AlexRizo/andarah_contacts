const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

const addUser = document.querySelector('.btn-add-user');
const inputPass = document.querySelector('.inp-pass');
const staffTableBody = document.querySelector('.colabs');
const prospectTableBody = document.querySelector('.prospects');
const title = document.querySelector('.t-section-title');
const errors = document.querySelector('.errors');
const $inputs = document.querySelectorAll('input');
const usersSection = document.querySelector('.users-section');
const page = document.querySelector('section');
const pendings = document.querySelector('.pending');
const total = document.querySelector('.total');
const clinetsAsigned = document.querySelector('.t-clients-section-title');

let socket;
let Urole;

const init = async() => {
    fetch(`${ url }/details/get-salers`, {
        method: 'GET',
        headers: {
            'tkn': token
        }
    })
    .then((response) => response.json())
    .then(({ salers, role }) => {
        createStaffTable(salers);
        Urole = role;
        if (role != 1) {
            title.innerText = 'Usuarios';
            clinetsAsigned.innerText = "Pendientes por asignar"
        } else {
            title.innerText = 'Vendedores';
            clinetsAsigned.innerText = "Pendientes por contactar"
        }
        
        if (role != 1) {
            usersSection.removeAttribute('hidden');
        } else {
            page.removeChild(usersSection);
        }
    })
    .catch(console.error);
    
    await connectSocket();
}

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'tkn': token
        }
    });

    socket.on('connect', () => console.log('Socket Online'));
    
    socket.on('disconnect', () => {
        console.log('Socket Offline');
        localStorage.removeItem('tkn');
        window.location = url;
    });

    socket.on('get-staff-data', ({ salers }) => {
        createStaffTable(salers);
    });
    
    socket.on('notification', ({ id, msg }) => {
        sendNotification('Nuevo Lead', msg);
    });
    
    socket.emit('get-prospects-asigned', { token });
    
    socket.on('prospects-asigned', ({ prospects, admin }) => {
        pendings.innerText = `${ prospects.count }`;
        createProspectsTable(prospects.rows);
    });

    socket.on('prospects-modified', ({ status }) => {
        socket.emit('get-new-prospects', { token });
    });
}

const main = async() => {
    await init();
}

main();

const generatePass = () => {
    let pass = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
                'abcdefghijklmnopqrstuvwxyz0123456789@#$';
      
    for (let i = 1; i <= 10; i++) {
        const char = Math.floor(Math.random() * str.length + 1);

        pass += str.charAt(char);
    }

    return pass;
}

addUser.addEventListener('click', () => {
    window.location = `${ url }/details/new-staff?tkn=${ token }`;
});

const createStaffTable = (users) => {
    const tData = document.querySelectorAll('.config-table-body');

    if ( !(tData.length < 1) ) {
        for (let i = 0; i < tData.length; i++) {
            staffTableBody.removeChild(tData[i]);
        }
    }

    users.forEach(user => {
        staffTableBody.innerHTML += `
        <a href="${ url }/details/view/user/${ user.id }" class="config-table-body selected">
            <span class="t-b">${ user.name }</span>
            <span class="t-b">${ user.email }</span>
            <span class="t-b">${ user.Role.name}</span>
            <span class="t-b">${ ((user.status === true) ? '<p style="color: #20dc5f">Activo</p>' : '<p style="color: #dc3545">Inactivo</p>') }</span>
        </a>
        `;
    });
}

const createProspectsTable = (users) => {
    const tData = document.querySelectorAll('.prospect-table-body');

    if ( !(tData.length < 1) ) {
        for (let i = 0; i < tData.length; i++) {
            prospectTableBody.removeChild(tData[i]);
        }
    }

    if (users.length === 0) {
        prospectTableBody.innerHTML = `
        <div class="void-table">
            <span class="t-b">Sin prospectos pendientes</span>
        </div>
        `;
    } else {
        users.forEach(user => {
            prospectTableBody.innerHTML += `
            <a href="${ url }/client/view/${ user.id }" class="prospect-table-body selected">
                <span class="t-b">${ user.name }</span>
                <span class="t-b">${ user.email }</span>
                <span class="t-b">${ user.phone_number}</span>
                <span class="t-b">Pendiente</span>
            </a>
            `;
        });
    }
}