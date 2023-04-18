const sendNotification = (msg = 'Notificación', body = 'Tienes una nueva notificación.', url = `https://andarah.leadscenter.work/details/config`) => {
    Push.create(msg, {
        body,
        onClick: () => {
            window.location = url
        }
    });
}