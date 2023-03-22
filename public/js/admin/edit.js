const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

let socket;

const form = document.querySelector('.form-data');
const inputs = document.querySelectorAll('.inputs');

const checkFields = () => {
    const fields = {};
    let status = true;

    for (const inp of inputs) {
        if (inp.name === 'password' && inp.value < 6 || inp.value > 1) {
            fields[inp.name] = { valid: false };
            status = false;
        } else if (inp.name.lenght < 1) {
            fields[inp.name] = { name: inp.name, value: null };
            status = false;
        }
    }

    // FIXME: select and inputs
    for (const sel of selects) {
        if (!sel.value) {
            if (sel.name != 'staffId') {
                fields[sel.name] = { name: sel.name, value: null };
                status = false;
            }
        }
    }

    return { status, fields };
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
            window.location = `${ url }/details/config`
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
    
    console.log(getfieldsData());
    console.log(checkFields());
    // socket.emit('send-admin-data', { formData: getfieldsData() });
})