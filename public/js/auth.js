const url = (window.location.hostname.includes('localhost')
            ? 'https://andarah.leadscenter.work'
            : 'https://andarah.leadscenter.work');

const _tkn = localStorage.getItem('auth-token') || '';
if (_tkn && _tkn.length > 10) {
    window.location = url + '/home';
}

const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
const divErrors = document.querySelector('#errors');
const formData = {};

form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    for (let input of inputs) {
        formData[input.name] = input.value;
    }

    fetch(url + '/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(({ error, tkn }) => {
        if (!inputs[0].value || !inputs[1].value) {
            divErrors.innerHTML = `
                <label for="error" class="lbl-error">* Llena los campos.</label>
            `;

            return false;
        }
        
        if (error) {
            divErrors.innerHTML = `
                <label for="error" class="lbl-error">* ${ error }</label>
            `;
            return false;
        }

        localStorage.setItem('auth-token', tkn);
        window.location = url + '/home';
    })
    .catch(error => {
        console.log(error);
    });
})