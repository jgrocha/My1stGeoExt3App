Ext.define("My1stGeoExt3App.view.main.Map",{
    extend: "GeoExt.component.Map",
    xtype: 'mappanel',
    requires: [
        "My1stGeoExt3App.view.main.MapController",
        "My1stGeoExt3App.view.main.MapModel"
    ],
    controller: "main-map",
    viewModel: {
        type: "main-map"
    },
    map: new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'watercolor'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'terrain-labels'
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat( [-8.751278, 40.611368] ),
            zoom: 12
        })
    })
});
