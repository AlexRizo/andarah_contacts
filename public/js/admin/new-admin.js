const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'http://localhost:3000')

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
        if (inp.name != 'repeatPass') {
            if (inp.name === 'password' && inp.value.length < 6 ) {
                pStatus = false;
                status = false;
            } else if (inp.value.length < 1) {
                fields[inp.name] = { name: inp.name, value: null };
                status = false;
            }
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

    socket.on('notification', ({ id, msg }) => {
        sendNotification('Nuevo Lead', msg);
    });
}

const main = async() => {
    await init();
}

main();

// TODO:...
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const { status, fields, pStatus } = checkFields();

    if (!status) {
        divErrors.innerHTML = inputsForStaff(fields, pStatus);
        return false;
    }

    fetch(`${ url }/details/create-new`, {
        method: 'POST',
        headers: {
            tkn: token,
            urle: localStorage.getItem('ur'), 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getfieldsData())
    })
    .then(response => response.json())
    .then(({ response, error }) => {
        if (error) {
            alert(response);
            return console.error(error);
        }

        alert(response)
        return window.location = `${ url }/details/config`
    })
    .catch(console.error);
});