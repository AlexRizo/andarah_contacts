const sendNotification = (msg = 'Notificación', body = 'Tienes una nueva notificación.', url = `http://localhost:3000/details/config`) => {
    Push.create(msg, {
        body,
        onClick: () => {
            window.location = url
        }
    });
}