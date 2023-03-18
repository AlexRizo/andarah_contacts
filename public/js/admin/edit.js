const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

let socket;

const form = document.querySelector('.form-data');
const inputs = document.querySelectorAll('input');
const selects = document.querySelectorAll('select');

const getfieldsData = () => {
    let formData = {}

    for (const inp of inputs) {
        formData[inp.name] = inp.value;
    }

    for (const sel of selects) {
        formData[sel.name] = sel.value;
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
    
    socket.emit('send-admin-data', { formData: getfieldsData() });
})