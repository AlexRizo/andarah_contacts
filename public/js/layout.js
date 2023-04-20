const navItems = document.querySelectorAll('.nav_item');

const logout = document.querySelector('.logout');
const btnMenu = document.querySelector('.mobile-menu');
const btnQuit = document.querySelector('.quit');
const menu = document.querySelector('.nav')

logout.addEventListener('click', () => {
    localStorage.removeItem('auth-token');
    location.reload();
});

btnMenu.addEventListener('click', () => {
    menu.classList.toggle('nav-on');
});

btnQuit.addEventListener('click', () => {
    menu.classList.toggle('nav-on');
});