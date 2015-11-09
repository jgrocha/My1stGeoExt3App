//Ext.define('My1stGeoExt3App.store.Personnel', {
//    extend: 'Ext.data.Store',
//
//    alias: 'store.personnel',
//
//    fields: [
//        'name', 'email', 'phone'
//    ],
//
//    data: { items: [
//        { name: 'Jean Luc', email: "jeanluc.picard@enterprise.com", phone: "555-111-1111" },
//        { name: 'Worf',     email: "worf.moghsson@enterprise.com",  phone: "555-222-2222" },
//        { name: 'Deanna',   email: "deanna.troi@enterprise.com",    phone: "555-333-3333" },
//        { name: 'Data',     email: "mr.data@enterprise.com",        phone: "555-444-4444" }
//    ]},
//
//    proxy: {
//        type: 'memory',
//        reader: {
//            type: 'json',
//            rootProperty: 'items'
//        }
//    }
//});

Ext.define('My1stGeoExt3App.store.Personnel', {
    extend: 'Ext.data.Store',
    alias: 'store.personnel',
    requires: [
        'My1stGeoExt3App.model.Personnel'
    ],
    model: 'My1stGeoExt3App.model.Personnel',
    autoLoad: true, // important to set autoLoad to false. If there is an error on the backend, Ext will still try to resolve Direct method names and crash the app.
    autoSync: false, // true,

    remoteSort: true, //enable remote filter
    remoteFilter:true, //enable remote sorting
    pageSize: 5
    //autoSync: true, // if operating on model directly this will make double POSTs!
});