const navItems = document.querySelectorAll('.nav_item');

const logout = document.querySelector('.logout');

logout.addEventListener('click', () => {
    localStorage.removeItem('auth-token');
    location.reload();
})