const $url = (window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://andarah.leadscenter.work')

const $token = localStorage.getItem('auth-token') || null;

const $init = async() => {
    const userId = /^(\w+):\/\/([^\/]+)([^]+)$/.exec(window.location.href);
    console.log(userId);
    // fetch(`${ url }/details/config/`)
}

const $main = async() => {
    await $init();
}

$main();