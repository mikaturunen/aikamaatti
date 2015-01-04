"use strict";

import log = require("../log/log");
import database = require("../database/database");
import Q = require("q");

// for typing only..
import mongo = require("mongodb");

module Employees {
    "use strict";   
    var collection: mongo.Collection;

    export function init() {
        collection = database.getCollection("employees")();
    }

    export function add(employees: EmployeeModel[]) {
        var deferred = <Q.Deferred<EmployeeModel[]>> Q.defer();

        log.debug("Employees add");

        return deferred.promise;
    }
}

export = Employees;
