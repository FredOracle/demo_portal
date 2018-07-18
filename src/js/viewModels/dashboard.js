/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery',  'ojs/ojknockout', 'promise',
   'jet-composites/common-crud/loader', 'ojs/ojmessages'],
 function(oj, ko, $) {
  

   var crud = document.getElementById('myCommonCrud');

    function DashboardViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.



        self.isCloseAffordanceDefault = ko.observable(true);
        self.isAutoTimeoutDefault = ko.observable(true);
        self.isSoundDefault = ko.observable(false);
        self.isTimestampDefault = ko.observable(false);
        self.selectedMessages = ko.observableArray(["info", "error", "warning"]);

        self.computedCloseAffordance = ko.computed(function() {
          return self.isCloseAffordanceDefault() ? "defaults" : "none";
        });
        self.computedAutoTimeout = ko.computed(function() {
          return self.isAutoTimeoutDefault() ? 0 : -1;
        });
        
        self.computedSound = ko.computed(function() {
          return self.isSoundDefault() ? "defaults" : "none";
        });
        
        self.computedTimestamp = ko.computed(function() {
          return self.isTimestampDefault() ? oj.IntlConverterUtils.dateToLocalIso(new Date()) : "";
        });

        self.selectedPositionOption = ko.observable("top-page");
        self.messagePositions =
        {
          "top-page":       {"my": {"vertical" :"top", "horizontal": "center"},
                             "at": {"vertical": "bottom", "horizontal": "center"},
                             "of": "#pageHeader"
                            },
          "top-window":     {"my": {"vertical" :"top", "horizontal": "center"},
                             "at": {"vertical": "top", "horizontal": "center"},
                             "of": "window"
                            },
          "bottom-window":  {"my":{"vertical" :"bottom", "horizontal": "center"},
                             "at": {"vertical": "bottom", "horizontal": "center"},
                             "of": "window"
                            }
        };
        
        self.messagePosition = ko.computed(function() {
          return self.messagePositions[self.selectedPositionOption()];
        });

        self.createMessage = function(severity) {
          var initCapSeverity = severity.charAt(0).toUpperCase() + severity.slice(1);
          return {
            severity: severity,
            summary: initCapSeverity + " message summary",
            detail: initCapSeverity + " message detail",
            closeAffordance: self.computedCloseAffordance(),
            autoTimeout: self.computedAutoTimeout(),
            sound: self.computedSound(),
            timestamp: self.computedTimestamp()
          };
        };
        
        // Initially display error and warning messages
        self.applicationMessages = ko.observableArray([]);

        self.closeMessageHandler = function(event)
        {
          // Remove from bound observable array
          self.applicationMessages.remove(event.detail.message);
          
          // When message is closed due to auto-tmeout, or user chosing to close all, 
          //  selectedMessages will need explicit update
          self.selectedMessages.remove(function(severity) {
            return severity === event.detail.message.severity
          });
        };

        self.infoMessage = function(summary, detail){
            return {
                severity: "info",
                summary: summary,
                detail: detail,
                closeAffordance: self.computedCloseAffordance(),
                autoTimeout: self.computedAutoTimeout(),
                sound: self.computedSound(),
                timestamp: self.computedTimestamp()
              };
        };
        self.warningMessage = function(summary, detail){
            return {
                severity: "warning",
                summary: summary,
                detail: detail,
                closeAffordance: self.computedCloseAffordance(),
                autoTimeout: self.computedAutoTimeout(),
                sound: self.computedSound(),
                timestamp: self.computedTimestamp()
              };
        };
        self.errorMessage = function(summary, detail){
            return {
                severity: "error",
                summary: summary,
                detail: detail,
                closeAffordance: self.computedCloseAffordance(),
                autoTimeout: self.computedAutoTimeout(),
                sound: self.computedSound(),
                timestamp: self.computedTimestamp()
              };
        };

      ///////////////////////////////////////////////////////////////////


      self.buttons = ko.observable("message,create");

      self.datasource = ko.observableArray();
      self.roles = ko.observableArray(["refresh","create","update","delete"]);
      self.pagesize = ko.observable(5);
      self.fieldHeader = ko.observable();


      self.demoRefresh = function(event){
          $.ajax({
            type: "GET",
            url: "http://localhost:8080/",
            success: function(data){
              self.datasource(data);    
            }
          });
      };


      self.demoCreate = function(event){
        $.ajax({
            type:"POST",
            url:"http://localhost:8080/",
            success: function(data){
              self.list();
              self.applicationMessages.push(self.infoMessage("Create Success", data.id));
            }
          });
      };

      self.demoUpdate = function(event){
        if(event.detail.value){
          $.ajax({
          type:"PUT",
          url:"http://localhost:8080/" + event.detail.value,
          success: function(data){
            self.list();
            self.applicationMessages.push(self.infoMessage("Update Success", data.id));
          }
        });
        }
      };

      self.demoDelete = function(event){
        if(event.detail.value){
          $.ajax({
              type:"DELETE",
              url:"http://localhost:8080/" + event.detail.value,
              success: function(data){
                self.list();
                self.applicationMessages.push(self.infoMessage("Delete Success", data));
              }
          });
        }
      };

      self.list = function(){
          $.ajax({
            type: "GET",
            url: "http://localhost:8080/",
            success: function(data){
              self.datasource(data);    
            }
          });
      };
     

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/",
            success: function(data){
              self.datasource(data);    
            }
          });
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
