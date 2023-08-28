sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox, exportLibrary, Spreadsheet,Fragment,Filter,FilterOperator) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("com.solvia.project2.controller.Main", {
            onInit: function () {
                var globalModel = this.getOwnerComponent().getModel("globalModel");
                var oDataModel = this.getOwnerComponent().getModel("myOdataModel");

                var Fakulteler=[  
                    {"key":"","text":"Bir Fakülte Seçiniz"},            
                    {"key":"Tıp","text":"Tıp Fakültesi"},
                    {"key":"Havacılık","text":"Havacılık Fakültesi"},
                    {"key":"Teknoloji","text":"Teknoloji Fakültesi"},
                    {"key":"Sağlık","text":"Sağlık Bilimleri Fakültesi"},
                    {"key":"İşletme","text":"İşletme Fakültesi"},
                    {"key":"Mühendislik","text":"Mühendislik Fakültesi"},
                    {"key":"Eğitim","text":"Eğitim Fakültesi"}
                ];
                globalModel.setProperty("/FakulteList",Fakulteler);
                this.onGetData();
            },
            onGetData: function (oEvent) {
                var oDataModel = this.getOwnerComponent().getModel("myOdataModel");
                var globalModel = this.getOwnerComponent().getModel("globalModel");
                //get entityset
                oDataModel.read("/ogrenciListSet", {
                    success: function (oData) {
                        debugger;
                        globalModel.setProperty("/List", oData.results);
                    },
                    error: function (oError) {
                        MessageToast("Error");
                    }
                });
            },
            onChange: function (oEvent) {
                var globalModel = this.getOwnerComponent().getModel("globalModel");
                var path = oEvent.getParameter("selectedItem").getBindingContext("globalModel").getPath();
                var line = globalModel.getProperty(path);
                var selectedControl = this.getView().byId("selectId");
                var selectedKey = selectedControl.getSelectedKey();
            },
            onRefresh: function () {
                this.getView().byId("idAd").setValue("");
                this.getView().byId("idSoyad").setValue("");
                this.getView().byId("idFakulte").setSelectedKey("");
                this.getView().byId("idBolum").setValue("");
                this.onRefreshValueState();
            },
            // onSave: function (oEvent) {
            //     var globalModel = this.getOwnerComponent().getModel("globalModel");
            //     var oDataModel = this.getOwnerComponent().getModel("myOdataModel");
            //     var that = this;

            //     var ad = this.getView().byId("idAd").getValue().trim();
            //     var soyad = this.getView().byId("idSoyad").getValue().trim();
            //     var fakulte = this.getView().byId("idFakulte")._getSelectedItemText();
            //     var fakulteKey = this.getView().byId("idFakulte").getSelectedKey();
            //     var bolum = this.getView().byId("idBolum").getValue().trim();

            //     if (ad === "" || soyad === "" || fakulteKey === "" || bolum === "") {
            //         MessageBox.warning("Zorunlu Alanları Doldurun!");
            //         if(ad===""){this.getView().byId("idAd").setValueState("Error");
            //         }if(soyad===""){ this.getView().byId("idSoyad").setValueState("Error");}
            //         if(fakulteKey===""){ this.getView().byId("idFakulte").setValueState("Error");}
            //         if(bolum===""){ this.getView().byId("idBolum").setValueState("Error");}
            //     } else {
            //         var oEntry = {};

            //         oEntry.Isim = ad;
            //         oEntry.Soyisim = soyad;
            //         oEntry.Fakulte = fakulte;
            //         oEntry.Bolum = bolum;

            //         oDataModel.create("/ogrenciListSet", oEntry, {
            //             success: function (oData) {

            //                 var type = oData.Type;
            //                 if (type === "S")
            //                     debugger;
            //                 MessageToast.show("Başarıyla Kaydedildi");
            //                 that.onRefresh();
            //                 that.onGetData();

            //             },
            //             error: function (oEvent) {
            //                 debugger;
            //             }
            //         })};            
            //     },
                onDeleteFinal(){
                var oSelected = this.byId("idStudents").getSelectedItem();
                if(oSelected!==null){
                    this.onMessageBox();
                }else{
                    MessageToast.show("Bir Veri Seçiniz!!");
                }
            },
            onMessageBox() {
                debugger;
                var that = this;
                MessageBox.warning("Silmek İstediğinize Emin Misiniz?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === 'OK') {
                            that.onDelete();
                            MessageToast.show("Seçilen Kişi Silindi ");
                        }
                    }
                });

            },

            onDelete: function (oEvent) {
                var that = this;
                var oSelected = this.byId("idStudents").getSelectedItem();
                var oEntry = oSelected.getBindingContext("globalModel").getObject();
                var oDataModel = this.getOwnerComponent().getModel("myOdataModel");
                oDataModel.remove("/ogrenciListSet('" + oEntry.OgrNo + "')", {
                    method: "DELETE",
                    success: function (data) {
                        that.onGetData();
                    },
                    error: function (e) {                       
                    }
                });
            },
            onRefreshValueState:function(oEvent){
                this.getView().byId("idAd").setValueState("None");
                this.getView().byId("idSoyad").setValueState("None");
                this.getView().byId("idFakulte").setValueState("None");
                this.getView().byId("idBolum").setValueState("None");
            },
            createColumnConfig: function() {
                var aCols = [];    
                aCols.push({
                    label: 'Öğrenci No',
                    property: ['OgrNo'],
                    type: EdmType.Number,
                });    
                aCols.push({
                    label: 'İsim',                    
                    property: 'Isim',
                    type: EdmType.String
                });    
                aCols.push({
                    label:'Soyisim',
                    property: 'Soyisim',
                    type: EdmType.String
                });
                    aCols.push({
                    label:'Fakülte',
                    property: 'Fakulte',
                    type: EdmType.String
                });    
                    aCols.push({
                    label:'Bölüm',
                    property: 'Bolum',
                    type: EdmType.String,
                    width: 23                  
                });    
                return aCols;
                },    
            onExport: function() {
                var aCols, oRowBinding, oSettings, oSheet, oTable;    
                if (!this._oTable) {
                    this._oTable = this.byId('idStudents');
                }
       
                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();
    
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export sample.xlsx',
                    worker: false
                };   
                oSheet = new Spreadsheet(oSettings);

                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
            }, 
            onOpenDialog : function () {
                var path;
                var model;
                var selectedLine;
                var oSelected = this.byId("idStudents").getSelectedItem();
                if(oSelected!==null){
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name:"com.solvia.project2.view.edit",controller: this });
                } 
                this.pDialog.then(function(oDialog) {
                    oDialog.open();
                    path=this.byId('idStudents').getSelectedItem().getBindingContext("globalModel").getPath();
                    model= this.byId('idStudents').getSelectedItem().getBindingContext("globalModel").getModel();
                    selectedLine=model.getProperty(path);
                    selectedLine=JSON.parse(JSON.stringify(selectedLine));
                    model.setProperty("/selectedLine",selectedLine);
                    oDialog.setModel(model,"globalModel");
                    this.oDialog=oDialog;
                    debugger;
                }.bind(this));}
                else{
                    MessageToast.show("Lütfen Bir Seçim Yapınız!");}                
            },
            onCloseDialog : function () {
                this.oDialog.close();
              },
            onUpdateDialog : function(){
                debugger;
                var globalModel = this.getOwnerComponent().getModel("globalModel");
                var oDataModel = this.getOwnerComponent().getModel("myOdataModel");

                var ad = sap.ui.getCore().byId("idAdEdit").mProperties.value.trim(); 
                var soyad = sap.ui.getCore().byId("idSoyadEdit").mProperties.value.trim();
                var fakulteKey = sap.ui.getCore().byId("idFakulteEdit").getSelectedKey();
                var bolum = sap.ui.getCore().byId("idBolumEdit").mProperties.value.trim();
                var no = sap.ui.getCore().byId("idNoEdit").mProperties.value.trim();

                if (ad === "" || soyad === "" || fakulteKey === "" || bolum === "") {
                    MessageBox.warning("Zorunlu Alanları Doldurun!");
                    if(ad===""){ sap.ui.getCore().byId("idAdEdit").setValueState("Error");
                    }if(soyad===""){  sap.ui.getCore().byId("idSoyadEdit").setValueState("Error");}
                    if(fakulteKey===""){  sap.ui.getCore().byId("idFakulteEdit").setValueState("Error");}
                    if(bolum===""){  sap.ui.getCore().byId("idBolumEdit").setValueState("Error");}
                } else {
                    var kEntry = {};

                    kEntry.Isim = ad;
                    kEntry.Soyisim = soyad;
                    kEntry.Fakulte = fakulteKey;
                    kEntry.Bolum = bolum;
                    kEntry.OgrNo=no;

                    var that=this;
                    var oSelected =this.byId("idStudents").getSelectedItem();
                    var kRow = oSelected.getBindingContext("globalModel").getObject();
                    kEntry.OgrNo=kRow.OgrNo;                    
                    var oDataModel = this.getOwnerComponent().getModel("myOdataModel");
                    oDataModel.update("/ogrenciListSet('"+kEntry.OgrNo+"')",kEntry, {
                       method:"PUT",
                        success: function (data) {
                            MessageToast.show("Başarıyla Kaydedildi");
                            that.onRefreshEdit();
                            that.onGetData();
                            that.onCloseDialog();
                        },
                        error: function (e) {
                            debugger;
                        }
                    })};
            },
            onOpenDialogNewButton : function () {
                var model;
                this.getView().byId("idStudents").removeSelections();
                if (!this.aDialog) {
                    this.aDialog = Fragment.load({
                        name:"com.solvia.project2.view.new",controller: this });
                } 
                this.aDialog.then(function(oDialog) {
                    oDialog.open();
                var globalModel = this.getOwnerComponent().getModel("globalModel");
                    oDialog.setModel(globalModel);
                    this.oDialog=oDialog;
                    debugger;
                }.bind(this));           
            },
            onSaveInsideButtonNew: function (oEvent) {
                var globalModel = this.getOwnerComponent().getModel("globalModel");
                var oDataModel = this.getOwnerComponent().getModel("myOdataModel");
                var that = this;

                var ad = sap.ui.getCore().byId("idAd").mProperties.value.trim();
                var soyad = sap.ui.getCore().byId("idSoyad").mProperties.value.trim();
                var fakulteKey = sap.ui.getCore().byId("idFakulte").getSelectedKey();
                var bolum = sap.ui.getCore().byId("idBolum").mProperties.value.trim();

                if (ad === "" || soyad === "" || fakulteKey === "" || bolum === "") {
                    MessageBox.warning("Zorunlu Alanları Doldurun!");
                    if(ad===""){sap.ui.getCore().byId("idAd").setValueState("Error");
                    }if(soyad===""){sap.ui.getCore().byId("idSoyad").setValueState("Error");}
                    if(fakulteKey===""){ sap.ui.getCore().byId("idFakulte").setValueState("Error");}
                    if(bolum===""){ sap.ui.getCore().byId("idBolum").setValueState("Error");}
                } else {
                    var oEntry = {};

                    oEntry.Isim = ad;
                    oEntry.Soyisim = soyad;
                    oEntry.Fakulte = fakulteKey;
                    oEntry.Bolum = bolum;

                    oDataModel.create("/ogrenciListSet", oEntry, {
                        success: function (oData) {

                            var type = oData.Type;
                            if (type === "S")
                                debugger;
                            MessageToast.show("Başarıyla Kaydedildi");
                            that.onRefreshNew();
                            that.onRefreshValueStateNew();
                            that.onGetData();
                            that.onCloseDialogButtonNew();

                        },
                        error: function (oEvent) {
                            debugger;
                        }
                    })};            
                },
            onCloseDialogButtonNew : function () {
                var that=this;
                that.onRefreshNew();
                this.oDialog.close();
              },
              onRefreshNew: function () {
                var that=this;
                sap.ui.getCore().byId("idAd").setValue("");
                sap.ui.getCore().byId("idSoyad").setValue("");
                sap.ui.getCore().byId("idFakulte").setSelectedKey("");
                sap.ui.getCore().byId("idBolum").setValue("");
               // this.onRefreshValueState();
               that.onRefreshValueStateNew();

              },
              onRefreshValueStateNew:function(oEvent){
                sap.ui.getCore().byId("idAd").setValueState("None");
                sap.ui.getCore().byId("idSoyad").setValueState("None");
                sap.ui.getCore().byId("idFakulte").setValueState("None");
                sap.ui.getCore().byId("idBolum").setValueState("None");
              },
              fnApplyFiltersAndOrdering: function (oEvent){
                var aFilters = []
                if (this.sSearchQuery) {       
                    var oFilter = new Filter("Isim", FilterOperator.Contains, this.sSearchQuery);
                    aFilters.push(oFilter);
                }       
                this.byId("idStudents").getBinding("items").filter(aFilters).sort(aSorters);
              },
              onFilter: function (oEvent) {
                this.sSearchQuery = oEvent.getSource().getValue();
                this.fnApplyFiltersAndOrdering();
              },
              onRefreshEdit: function () {
                var that=this;
                sap.ui.getCore().byId("idAdEdit").setValue("");
                sap.ui.getCore().byId("idSoyadEdit").setValue("");
                sap.ui.getCore().byId("idFakulteEdit").setSelectedKey("");
                sap.ui.getCore().byId("idBolumEdit").setValue("");
               // this.onRefreshValueState();
               that.onRefreshValueStateEdit();

              },
              onRefreshValueStateEdit:function(oEvent){
                sap.ui.getCore().byId("idAdEdit").setValueState("None");
                sap.ui.getCore().byId("idSoyadEdit").setValueState("None");
                sap.ui.getCore().byId("idFakulteEdit").setValueState("None");
                sap.ui.getCore().byId("idBolumEdit").setValueState("None");
              }
        });
    });