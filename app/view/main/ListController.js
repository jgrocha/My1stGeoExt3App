/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('My1stGeoExt3App.view.main.ListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.list',

    init : function() {
        var grid = this.getView();
        var store = this.getView().getStore();

        store.addListener("write", this.onStoreWrite, this);
        store.proxy.addListener("exception", this.onStoreException, this);
        // onStoreLoad is not called when loaded by auto
        store.proxy.addListener("load", this.onStoreLoad, this);
    },

    onStoreWrite: function(store, operation, eOpts) {
        console.log(operation);
    },

    onStoreException: function(proxy, request, operation, eOpts) {
        //console.log(request);
        //console.log(request.method);
        //console.log(request.message.text);
        Ext.Msg.show({
            title : 'Error on ' + request.method,
            msg : request.message.text + '<br/><i>' + request.message.detail + '</i>',
            icon : Ext.Msg.ERROR,
            buttons : Ext.Msg.OK
        });
        var store = this.getView().getStore();
        store.rejectChanges();
    },

    onStoreLoad : function(proxy, records, successful, eOpts) {
        if (!successful) {
            Ext.MessageBox.show({
                title : 'Data Load Error',
                msg : 'The data encountered a load error, please try again in a few minutes.'
            });
        } else {
            console.log(records.length + ' records returned');
        }
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    //https://www.sencha.com/forum/showthread.php?287232-What-is-the-best-way-for-accessing-to-components-from-viewController
    onAdd: function (button) {
        var grid = this.getView();
        var store = this.getView().getStore();

        var record = Ext.create('My1stGeoExt3App.model.Personnel', {
            //'id', 'name', 'email', 'phone'
            name: 'Adelaide',
            email: 'adele@gmail.com',
            phone: '234360101'
        });

        //record.save();
        store.add(record);

    },

    onDelete: function (button) {
        //Ext.Msg.confirm('Delete', 'Are you sure?', 'onConfirm', this);
        var grid = this.getView();
        var store = this.getView().getStore();

        var sm = grid.getSelectionModel();
        var selection = sm.getSelection();

        if (selection.length === 1) {
            // selection[0].data.id
            store.remove(selection);
        }

    },

    onSync: function (button) {
        //Ext.Msg.confirm('Delete', 'Are you sure?', 'onConfirm', this);
        var grid = this.getView();
        var store = this.getView().getStore();
        store.sync();
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }

});
