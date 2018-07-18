/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojL10n!./resources/nls/common-crud-strings',
    'ojs/ojknockout', 'promise', 'ojs/ojtable', 'ojs/ojgauge', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojinputtext',
    'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojtoolbar', 'ojs/ojmenu', 'ojs/ojmessages'], 
    function (oj, ko, $) {

    
    function ExampleComponentModel(context) {
        var self = this;
        
        //At the start of your viewModel constructor
        var busyContext = oj.Context.getContext(context.element).getBusyContext();
        var options = {"description": "CCA Startup - Waiting for data"};
        self.busyResolve = busyContext.addBusyState(options);

        self.composite = context.element;

        //Example observable
        self.messageText = ko.observable('Hello from Example Component');

 

        self.pageSize = ko.observable(context.properties.pagesize);

        self.refreshButton = ko.observable("");
        self.createButton = ko.observable("");
        self.updateButton = ko.observable("");
        self.deleteButton = ko.observable("");

        for(var index in context.properties.roles){
            if(context.properties.roles[index] === "refresh"){
                self.refreshButton("refresh");
            }
            if(context.properties.roles[index] === "create"){
                self.createButton("create");
            }
            if(context.properties.roles[index] === "update"){
                self.updateButton("update");
            }
            if(context.properties.roles[index] === "delete"){
                self.deleteButton("delete");
            }
        }


        self.pagingDatasource = ko.observable();
        self.selectedItem = ko.observable();
        self.msg = ko.observable("");


        self.refreshMsg = function(event){
            // var params = {
            //     'bubbles': true,
            //     'detail': {'value': "refresh"}
            //   };
            // self.composite.dispatchEvent(new CustomEvent('refreshMsg', params));

            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(context.properties.datasource, {idAttribute: 'id'})));    
        };


        self.createClick = function(event){
            var params = {
                'bubbles': true,
                'detail': {'value': "create"}
            };
            self.composite.dispatchEvent(new CustomEvent('createClick', params));
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(context.properties.datasource, {idAttribute: 'id'})));    
        };

        self.updateClick = function(event){
            var params = {
                'bubbles': true,
                'detail': {'value': self.selectedItem()}
            };
            self.composite.dispatchEvent(new CustomEvent('updateClick', params));
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(context.properties.datasource, {idAttribute: 'id'})));    
        };

        self.deleteClick = function(event){
            var params = {
                'bubbles': true,
                'detail': {'value': self.selectedItem()}
            };
            self.composite.dispatchEvent(new CustomEvent('deleteClick', params));
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(context.properties.datasource, {idAttribute: 'id'})));    
        };

        self.deleteAllClick = function(event){
            // $.ajax({
            //     type:"delete",
            //     url:"http://localhost:8080/deleteAll",
            //     success: function(data){
                  
            //       self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(new Array(), {idAttribute: 'id'})));  
            //     }
            // });
        };


        self.beforeCurrentRowListener = function(event){
          var data = event.detail;
          self.selectedItem(data.currentRow.rowKey);
        };


////////////////////////////////////////////////////////////


        
        var baseDeptArray =  context.properties.datasource;
        function generateDeptArray(num) {
          var deptArray = [];
          var i, j, count = 0;
          for (i = 0; i < num; i++) {
            for (j = 0; j < baseDeptArray.length; j++) {
                deptArray[count] = $.extend({}, baseDeptArray[j]);
                deptArray[count].DepartmentId = deptArray[count].DepartmentId + count.toString();
                deptArray[count].DepartmentName = deptArray[count].DepartmentName + count.toString();
                count++;
            }
          }
          return deptArray;
        };

        self.deptArray = generateDeptArray(1);



        self.highlightChars = [];

        self.highlightingCellRenderer = function(context) 
        {
            var id = context.row.DepartmentId;
            var startIndex = null;
            var length = null;
            var field = null;
                                                                     
                                                                     
            if (context.columnIndex === 0)
            {
                field = 'id';
            }
            else if (context.columnIndex === 1)
            {
                field = 'username';
            }
            else if (context.columnIndex === 2)
            {
                field = 'password';
            }
            else if (context.columnIndex === 3)
            {    
                field = 'flag';
            }
                                                                     
             
            var data = "";
            if(context.row[field]){
                data = context.row[field].toString();
            }                                                  
                                                                     
            // var data = context.row[field].toString();
                                                                     
            if (self.highlightChars[id] != null &&
                self.highlightChars[id][field] != null)
            {
                startIndex = self.highlightChars[id][field].startIndex;
                length = self.highlightChars[id][field].length;
            }
            if (startIndex != null &&
                length != null)
            {
                var highlightedSegment = data.substr(startIndex, length);
                data = data.substr(0, startIndex) + '<b>' + highlightedSegment + '</b>' + data.substr(startIndex + length, data.length - 1);
            }
                                                                     
            $(context.cellContext.parentElement).append(data);
        };
       

        self.clearClick = function(event){
            // self.filter('');
            self.pagingDatasource(new oj.ArrayDataProvider(context.properties.datasource, {idAttribute: 'id'}));
            self.highlightChars = [];
            document.getElementById('filter').value = "";
            return true;
        }

        self.columnArray = [{headerText: 'Id', 
                         field: 'id'},
                        {headerText: 'User Name', 
                         field: 'username'},
                        {headerText: 'Password', 
                         field: 'password'},
                        {headerText: 'Flag', 
                         field: 'age'}];



///////////////////////////////////////////////////////////



        // Example for parsing context properties
        // if (context.properties.name) {
        //     parse the context properties here
        // }

        //Once all startup and async activities have finished, relocate if there are any async activities
        self.busyResolve();
    };
    
    //Lifecycle methods - uncomment and implement if necessary 
    //ExampleComponentModel.prototype.activated = function(context){
    //};

    ExampleComponentModel.prototype.attached = function(context){
        // self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(context.properties.datasource, {idAttribute: 'id'})));            
    };

    // ExampleComponentModel.prototype.bindingsApplied = function(context){
        // self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(context.properties.datasource, {idAttribute: 'id'})));    
    // };

    //ExampleComponentModel.prototype.detached = function(context){
    //};

    //ExampleComponentModel.prototype.propertyChanged = function(context){
    //};

    return ExampleComponentModel;
});