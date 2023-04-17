const $url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'http://localhost:3000')

const $token = localStorage.getItem('auth-token') || null;

const $init = async() => {
    const urlQuery = window.location.href.split('/');
    const userData = { id: urlQuery[urlQuery.length - 1] }

    await fetch(`${ $url }/details/validate-role`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'tkn': $token,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then(({ status }) => {
        if (!status) {
            return window.location = `${ $url }/401`;
        }
    })
    .catch(console.error);
}

const $main = async() => {
    await $init();
}

$main();