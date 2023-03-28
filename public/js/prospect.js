const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

const edit = document.querySelector('#edit');
const inputs = document.querySelectorAll('input');
const selects = document.querySelectorAll('select');
const textarea = document.querySelector('textarea');
const btnSave = document.querySelector('button');
const form = document.querySelector('form');
const divErrors = document.querySelector('.errors');

let socket;

const toggleInputs = () => {
    if (edit.checked) {
        for (const inp of inputs) {
            if (inp.name != 'edit') {
                inp.toggleAttribute('disabled');
            }
        }
        selects[0].toggleAttribute('disabled');
        selects[1].toggleAttribute('disabled');
        textarea.toggleAttribute('disabled');
        btnSave.toggleAttribute('disabled');
        btnSave.classList.toggle('btnOff');
    } else {
        for (const inp of inputs) {
            if (inp.name != 'edit') {
                inp.toggleAttribute('disabled');
            }
        }
        selects[0].toggleAttribute('disabled');
        selects[1].toggleAttribute('disabled');
        textarea.toggleAttribute('disabled');
        btnSave.toggleAttribute('disabled');
        btnSave.classList.toggle('btnOff');
    }
}

edit.addEventListener('click', () => {
    toggleInputs();
});

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

form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = {};

    if (edit.checked) {
        for (const inp of inputs) {
            if (inp.name != 'edit') {
                formData[inp.name] = inp.value;
            }
        }
        formData[selects[0].name] = selects[0].value;
        formData[selects[1].name] = selects[1].value;
        formData[textarea.name] = textarea.value;

        const { status, fields } = checkFields();
        
        if (!status) {
            divErrors.innerHTML = inputsForClientsTable(fields);
            return false;
        }

        fetch(`${ url }/client/update`, {
            body: JSON.stringify(formData),
            method: 'PUT',
            headers: {
                'tkn' : token,
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then(({ error, response }) => {
            if (error) {
                alert('Ha ocurrido un error.');
                console.log(error);
                return false;
            }

            alert(response);
            socket.emit('send-notification', { id: formData.staffId })
        })
        .catch(console.error);
    }
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
        Push.create(msg);
    });

    socket.on('updating-complete', ({ stat }) => {
        location.reload();
    })
}

const main = async() => {
    await init();
}

main();