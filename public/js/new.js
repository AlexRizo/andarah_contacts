const url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const token = localStorage.getItem('auth-token') || null;

const form = document.querySelector('form');
const inputs = document.querySelectorAll('.input');

const divErrors = document.createElement('div');

let socket;

const formData = {};

form.addEventListener('submit', (event) => {
    event.preventDefault();

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
    .then(({errors, response}) => {
        if (errors) {
            divErrors.innerHTML = `<p style="color: red; margin-top: 20px;">* Hay campos obligatorios vacíos.</p>`;
            console.log(errors.errors);
            return form.appendChild(divErrors);
        }

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
}

const main = async() => {
    await init();
}

main();