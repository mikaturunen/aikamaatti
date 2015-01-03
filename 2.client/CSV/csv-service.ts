/** 
 * PapaParse browserify/node style module for parsing CSV files. Simply written into a more node-like style
 * as oppose to Angular service.
 * Rationale: AngularJS might get replaced by something. Aiming to write the future modules in a manner that I get 
 * most ouf of them even when I swap out Angular.
 */

"use strict";

import Log = require("../log/log-service");
import Employees = require("../employees/employees-service");
import Q = require("q");

module Csv {
    "use stritct";
    // ambient declaration for PapaParse 
    declare var Papa: any;

    export interface Service {
        importEmployees:  ($files: any) => void;
        importTreatments: ($files: any) => void;
    }

    // TODO write mapping tools for both the employee and treatments csv imports

    /** 
     * Takes care of the error handling in error cases.
     * @params error {any} Error object.
     * @params log {Log.Service} Log service.
     */ 
    var errorHandler = (error: any, log: Log.Service) => {
        log.error("Somethign went wrong parsing the given file for Employees", { error: error });
    };

    /** 
     * Called when PapaParse has read the CSV file compeltely.
     * @params content {any} Results object.
     * @params log {Log.Service} Log service.
     * @params rowHandler {any} Row handling function. employeesHandler or treatmentsHandler.
     */ 
    var convertRowsToModels = (
            content: { results: any; file: string; }, 
            log: Log.Service, 
            rowHandler: (rows: any, log: Log.Service) => any
        ) => {
        
        var file = content.file;
        var results = content.results;
        // TODO type the deferred
        var deferred: any = Q.defer();

        if (results.errors && results.errors.length > 0) {
            deferred.reject({ message: "Something went wrong parsing file.", file: file, errors: results.errors });
            return deferred.promise;
        } else if (results.data.length === 0) {
            deferred.reject({ message: "No rows found from CSV file.", file: file });
            return deferred.promise;
        }

        log.info("Rows read from file.", { file: file, rows: results.data.length });

        rowHandler(results.data, log)
            .then(deferred.resolve)
            .catch(deferred.reject);

        return deferred.promise;
    };

    /** 
     * Transforms the PapaParse produced rows into EmployeeModels.
     * @params rows {any} Rows from CSV
     * @params log {Log.Service} Log service.
     */
    var employeeTransofmer = (rows: any, log: Log.Service) => {
        // Even though this function is synchronous we use Q to allow the us to use the function inside a promise chain
        var deferred = <Q.Deferred<EmployeeModel[]>> Q.defer();

        // TODO replace completely with a proper mapping instead of hard-coded values,
        //      this is here just to move the development and prototyping along faster so we can
        //      actually test the programs idea instead of get stuck on details like this...
        var employees: EmployeeModel[] = rows.map((row: any) => {
            return <EmployeeModel> {
                first_name: row[0],
                last_name: row[1],
                treatment_ids: [ ]
            };
        });

        log.debug("Imported employees.", { employeesCount: employees.length, employees: employees });
        deferred.resolve(employees);

        return deferred.promise;
    };

    /** 
     * Transforms the PapaParse produced rows into TreatmentModels.
     * @params rows {any} Rows from CSV
     * @params log {Log.Service} Log service.
     */
    var treatmentsTransofmer = (rows: any, log: Log.Service) => {
        // TODO replace completely with a proper mapping instead of hard-coded values,
        //      this is here just to move the development and prototyping along faster so we can
        //      actually test the programs idea instead of get stuck on details like this...
        var employees: TreatmentModel[] = rows.map((row: any) => { return <TreatmentModel> { name: row[0] }; });
    };

    var parseFile = ($files: any) => {
        // TODO type the deferred
        var deferred = <Q.Deferred<{ results: any; file: string; }>> Q.defer();

        Papa.parse($files[0], { 
            // TODO read header info? -> preview?
            headers: false,
            worker: true,
            skipEmptyLines: true,
            complete: (results: any, file: string) => deferred.resolve({ results: results, file: file }),
            error: (error: any) => deferred.reject(error)
        });

        return deferred.promise;
    };

    /** 
     * Factory service function we push out from CSV services.
     * @params log {Log.Service} Log service.
     * @params employeesService {Employees.Service} Employees service.
     */ 
    var factory = (log: Log.Service, employeesService: Employees.Service) => {
        /** 
         * Imports Employees from a CSV file.
         * @params $files {any} List of files from HTML5 file api that the user selected.
         */ 
        var importEmployees = ($files: any) => {  
            // TODO type the deferred
            var deferred = <Q.Deferred<EmployeeModel[]>> Q.defer();

            // read file content, convert them to employees, send them to server and resolve promise on reply

            parseFile($files)
                .then((content: { results: any; file: string; }) => convertRowsToModels(content, log, employeeTransofmer))
                .then((employees: EmployeeModel[]) => employeesService.add(employees))
                .then(deferred.resolve)
                .catch(deferred.reject)
                .done();

            return deferred.promise;
        };

        /** 
         * Imports Treatments from a CSV file.
         * @params $files {any} List of files from HTML5 file api that the user selected.
         */ 
        var importTreatments = ($files: any) => {
            /*
            Papa.parse($files[0], { 
                // TODO read header info? -> preview?
                headers: false,
                worker: true,
                skipEmptyLines: true,
                complete: (results: any, file: string) => completionHandler(results, file, log, treatmentsHandler),
                error: (error: any) => errorHandler(error, log)
            });
            */
        };

        return {
            importEmployees: importEmployees,
            importTreatments: importTreatments
        };
    };

    export var meta: MetaModule = {
        moduleName: "aikamaatti.csv-service",
        serviceName: "csv",
        serviceFunction: factory
    };
};

angular
    .module(Csv.meta.moduleName, [ ])
    .factory(Csv.meta.serviceName, [
        "log", "employees-service",
        Csv.meta.serviceFunction
    ])

export = Csv;
