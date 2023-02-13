const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

const addUser = document.querySelector('.btn-add-user');
const modal = document.querySelector('.modal-vendedor');
const bgModal = document.querySelector('.bg-modal-vendedor');
const form = document.querySelector('.modal-form');
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

let socket;
let Urole;

const generatePass = () => {
    let pass = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
                'abcdefghijklmnopqrstuvwxyz0123456789@#$';
      
    for (let i = 1; i <= 10; i++) {
        const char = Math.floor(Math.random()
                    * str.length + 1);
          
        pass += str.charAt(char)
    }
      
    return pass;
}

addUser.addEventListener('click', () => {
    modal.classList.toggle('hidden__true');
    for (const input of $inputs) {
        input.value = '';
    }
    inputPass.value = generatePass();
    errors.innerText = '';
});

bgModal.addEventListener('click', () => modal.classList.toggle('hidden__true'));

form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = {};
    const inputs = {};

    for (const el of form.elements) {
        if(el.name) {
            formData[el.name] = el.value;
            inputs[el.name] = el;
        }
    }

    fetch(`${ url }/details/create-new`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'tkn': token,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then(({ response, error }) => {
        let isVoid;

        for (const el of form.elements) {
            if (el.name) {
                if (!el.value) {
                    errors.innerText = '* Completa los campos.';
                    isVoid = true;
                    break;
                }
            }
        }

        if (error || isVoid) {
            if (!error) {
                return false;
            } else if (!error.parent){
                errors.innerText = '* Correo inválido.';
                return false;       
            } else if (error.parent.errno === 1062){
                errors.innerText = '* El correo ya existe.';
                return false;
            }else {
                errors.innerText = '* Ha ocurrido un error.';
                console.error(error);
                return false;
            }
        }
        
        if (response) {
            console.log(response);
        }

        socket.emit('get-users', { Urole });
        modal.classList.toggle('hidden__true');
    })
    .catch(console.warn);
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
        <div class="config-table-body">
            <span class="t-b">${ user.name }</span>
            <span class="t-b">${ user.email }</span>
            <span class="t-b">${ ((user.status === true) ? '<p style="color: #35dc5f">Activo</p>' : '<p style="color: #dc3545">Inactivo</p>') }</span>
            <span class="t-b"><i class="fa-regular fa-pen-to-square" onclick(editModal(${ user.id }))></i></span>
        </div>
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

    users.forEach(user => {
        prospectTableBody.innerHTML += `
        <div class="prospect-table-body">
            <span class="t-b">${ user.name }</span>
            <span class="t-b">${ user.email }</span>
            <span class="t-b">${ user.phone_number}</span>
            <span class="t-b">${ user.city}</span>
        </div>
        `;
    });
}

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
            title.innerText = 'Vendedores'
        } else {
            title.innerText = 'Usuarios'
        }
        
        if (role != 3) {
            usersSection.removeAttribute('hidden')
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
        Push.create(msg)
    });
    
    socket.emit('get-prospects-asigned', { token });
    
    socket.on('prospects-asigned', ({ prospects }) => {
        pendings.innerText = `${ prospects.count }`
        createProspectsTable(prospects.rows);
    });

    socket.on('prospects-modified', ({ status }) => {
        socket.emit('get-new-prospects', { token });
    });

    socket.emit('get-all-prospects', { token });

    socket.on('all-prospects', ({ prospects }) => {
        total.innerText = prospects.count;
    })
}

const main = async() => {
    await init();
}

main();