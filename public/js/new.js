const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

const form = document.querySelector('form');
const inputs = document.querySelectorAll('.input-add');
const selects = document.querySelectorAll('select');
const textarea = document.querySelector('textarea');
const btnAdd = document.querySelector('.btn-add');
const divErrors = document.querySelector('.errors');

let socket;

const formData = {};

const checkFields = () => {
    const fields = {};
    let status = true;

    for (const inp of inputs) {
        if (!inp.value) {
            fields[inp.name] = { name: inp.name, value: null };
            status = false;
        }
    }

    for (const sel of selects) {
        if (!sel.value) {
            if (sel.name != 'staffId') {
                fields[sel.name] = { name: sel.name, value: null };
                status = false;
            }
        }
    }

    if (!textarea.value) {
        fields[textarea.name] = { name: textarea.name, value: null };
        status = false;
    }

    return { status, fields };
}

btnAdd.addEventListener('click', (event) => {
    const { status, fields } = checkFields();

    if (!status) {
        divErrors.innerHTML = inputsForClientsTable(fields);
        return false;
    }
    
    for (const input of inputs) {
        formData[input.name] = input.value;
    }

    fetch(`${ url }/client/create`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
            'tkn': token
        }
    })
    .then(res => res.json())
    .then(({response, error}) => {
        if (error) {
            alert('Ha ocurrido un error.');
            console.log(error);
            return false;
        }

        socket.emit('new-client', { status: true });
        alert(response);
        window.location = `${ url }/home`
    })
    .catch(console.error);
});

const init = async() => {
    // TODO: ...
    
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

    socket.on('notification', ({ id, msg }) => {
        Push.create(msg)
    });
}

const main = async() => {
    await init();
}

main();