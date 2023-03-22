const userTableFields = {
    name: 'Nombre',
    email: 'Correo',
    city: 'Ciudad',
    phone_number: 'Teléfono',
    reason: 'Motivo',
    contact_status: 'Contactado',
    date_contact: 'Fecha de Envío',
    origin: 'Origen',
    pl: 'Plataforma',
    gr: 'Grupo',
    note: 'Nota',
    staffId: 'Asignado a'
};

const staffTableFields = {
    name: 'Nombre',
    email: 'Correo',
    password: 'Contraseña',
    status: 'Estado',
    roleId: 'Rol'
};

const inputsForClientsTable = (object) => {
    let errors = '';
    let names = [];

    const keys = Object.keys(object);

    for (const index of keys) {
        names.push(userTableFields[index])
    }

    
    for (let i = 0; i < names.length; i++) {
        errors += `<span>* El campo ${ names[i] } es obligatorio.</span>`;
    }

    return errors;
}

const inputsForStaff = (object) => {
    let errors = '';
    let names = [];

    const keys = Object.keys(object);

    for (const index of keys) {
        names.push(staffTableFields[index]);
    }

    
    for (let i = 0; i < names.length; i++) {
        errors += `<span>* El campo ${ names[i] } es obligatorio.</span>`;
    }

    return errors;
}