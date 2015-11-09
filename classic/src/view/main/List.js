/**
 * This view is an example list of people.
 */
Ext.define('My1stGeoExt3App.view.main.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',

    requires: [
        'My1stGeoExt3App.store.Personnel'
    ],

    controller: 'list',
    viewModel: 'list',

    title: 'Personnel',

    //reference: 'bisneta',

    store: {
        type: 'personnel'
    },

    columns: [
        {
            text: 'Name',
            dataIndex: 'name',
            field: {
                xtype: 'textfield'
            }
        },
        {
            text: 'Email',
            dataIndex: 'email',
            flex: 1,
            field: {
                xtype: 'textfield'
            }
        },
        {
            text: 'Phone',
            dataIndex: 'phone',
            flex: 1,
            field: {
                xtype: 'textfield'
            }
        }
    ],

    //listeners: {
    //    select: 'onItemSelected'
    //},

    initComponent: function () {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            //listeners: {
            //    cancelEdit: function (rowEditing, context) {
            //        // Canceling editing of a locally added, unsaved record: remove it
            //        if (context.record.phantom) {
            //            store.remove(context.record);
            //        }
            //    }
            //}
        });
        this.plugins = [rowEditing];
        this.callParent(arguments);
    },

    dockedItems: [{
        xtype: 'toolbar',
        items: [{
            text: 'Add',
            iconCls: 'icon-add',
            //handler: 'onAdd'
            listeners : {
                click: 'onAdd'
            }
        }, '-', {
            itemId: 'delete',
            text: 'Delete',
            iconCls: 'icon-delete',
            disabled: false, // true
            handler: 'onDelete'
        }, '-', {
            itemId: 'sync',
            text: 'Sync',
            iconCls: 'icon-delete',
            disabled: false, // true
            handler: 'onSync'
        }]
    }]

});
