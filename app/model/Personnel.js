Ext.define('My1stGeoExt3App.model.Personnel', {
    extend: 'Ext.data.Model',

    fields: [
        'id', 'name', 'email', 'phone'
    ],

    proxy: {
        type: 'direct',
        api: {
            create:  'Server.AppGeoExt3.PgPersonnel.create',
            read:    'Server.AppGeoExt3.PgPersonnel.read',
            update:  'Server.AppGeoExt3.PgPersonnel.update',
            destroy: 'Server.AppGeoExt3.PgPersonnel.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message' // mandatory if you want the framework to set message property content
        }
    }
});