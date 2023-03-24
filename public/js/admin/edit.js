const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

let socket;

const form = document.querySelector('.form-data');
const inputs = document.querySelectorAll('.inputs');
const divErrors = document.querySelector('.divErrors');

const checkFields = () => {
    const fields = {};
    let pStatus = true;
    let status = true;

    for (const inp of inputs) {
        if (inp.name === 'password' && inp.value.length < 6 ) {
            if (inp.value.length != 0) {
                fields[inp.name] = { valid: false};
                pStatus = false;
                status = false;
            }
        } else if (inp.value.length < 1) {
            fields[inp.name] = { name: inp.name, value: null };
            status = false;
        }
    }

    return { status, fields, pStatus };
}

const getfieldsData = () => { 
    let formData = {}

    for (const inp of inputs) {
        formData[inp.name] = inp.value;
    }

    return formData
}

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

    socket.on('staff-update-response', ({ response, stat }) => {
        alert(response);
        if (stat) {
            window.location = `${ url }/details/config`;
        }
    })

    socket.on('notification', ({ id, msg }) => {
        Push.create(msg);
    });
}

const main = async() => {
    await init();
}

main();

// TODO: ...
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const { status, fields, pStatus } = checkFields();

    if (!status) {
        divErrors.innerHTML = inputsForStaff(fields, pStatus);
        return false;
    }
    
    socket.emit('send-admin-data', { formData: getfieldsData() });
})