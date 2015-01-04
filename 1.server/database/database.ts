"use strict";

import log = require("../log/log");
import Q = require("q");

import mongo = require("mongodb");
var MongoServer = mongo.Server;
var MongoClient = mongo.MongoClient;

// TODO create proper databases instead of using the default mongodb ones for testing
var databaseName: string = "test";

/**
 * @class Database.
 * Used to communicate to MongoDb.
 */
module Database {
    "use strict";

    /** 
     * Centralized communication client to MongoDb.
     */ 
    var client: mongo.MongoClient;

    /** 
     * Mongo database in use
     */
    var database: mongo.Db;

    /** 
     * Initializes the connection to the mongodb
     */
    export function init() {
        // TODO configuration + production vs development implementation -- now we'll just leave the default localhost mongodb
        //      here to move development forward faster
        log.debug("Attempting to connect to Mongo database.");

        // TODO fix mongodb definitely typed reference and do a PR -> remove <any> cast after that
        client = new MongoClient(
                new MongoServer("localhost", 27017)
            );

        var deferred = <Q.Deferred<any>> Q.defer();

        Q.ninvoke(client, "open")
            .then((resultingClient: mongo.MongoClient) => {
                client = resultingClient;
                // TODO remove test db and build a proper system around it
                // TODO fix mongodb.d.ts
                database = (<any>client).db(databaseName);
                deferred.resolve(true);
            })
            .catch(deferred.reject)
            .done();

        return deferred.promise;
    }

    /** 
     * Returns a collection to the given module that requested it for easier manipulation of context.
     * @params collection {string} Name of the collection.
     */ 
    export function getCollection(collection: string) {
        if (database) {
            return () => {
                log.debug("Returning requested collection.", { collection: collection });
                return database.collection(collection);
            };
        } 

        // We should never hit here but this is here just in case. We allow it to operate but at the same time
        // capture potential cases that we've missed.
        log.warn("Database not in place. Check connection and error cases.");

        return () => {
            database = (<any>client).db(databaseName);
            return database.collection(collection);
        };
    }
}

export = Database;
