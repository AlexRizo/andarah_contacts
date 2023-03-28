const sendNotification = (msg = 'Notificación', body = 'Tienes una nueva notificación.', url) => {
    Push.create(msg, {
        body,
        onClick: () => {
            
        }
    });
} 