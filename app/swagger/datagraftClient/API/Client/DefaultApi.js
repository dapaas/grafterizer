/// <reference path="api.d.ts" />
/* tslint:disable:no-unused-variable member-ordering */
var API;
(function (API) {
    var Client;
    (function (Client) {
        'use strict';
        var DefaultApi = (function () {
            function DefaultApi($http, $httpParamSerializer, basePath) {
                this.$http = $http;
                this.$httpParamSerializer = $httpParamSerializer;
                this.basePath = 'http://127.0.0.1:3000';
                this.defaultHeaders = {};
                if (basePath) {
                    this.basePath = basePath;
                }
            }
            DefaultApi.prototype.extendObj = function (objA, objB) {
                for (var key in objB) {
                    if (objB.hasOwnProperty(key)) {
                        objA[key] = objB[key];
                    }
                }
                return objA;
            };
            /**
             *
             * Get all of a user&#39;s API keys
             */
            DefaultApi.prototype.apiKeysGet = function (extraHttpRequestParams) {
                var path = this.basePath + '/api_keys';
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Create new API key
             * @param apiKey
             */
            DefaultApi.prototype.apiKeysPost = function (apiKey, extraHttpRequestParams) {
                var path = this.basePath + '/api_keys';
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'apiKey' is set
                if (!apiKey) {
                    throw new Error('Missing required parameter apiKey when calling apiKeysPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: apiKey,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Get the attributes of the API key
             * @param id ID of the API key to be deleted
             */
            DefaultApi.prototype.apiKeysIdGet = function (id, extraHttpRequestParams) {
                var path = this.basePath + '/api_keys/{id}'
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling apiKeysIdGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update an API key
             * @param id ID of the API key to be deleted
             */
            DefaultApi.prototype.apiKeysIdDelete = function (id, extraHttpRequestParams) {
                var path = this.basePath + '/api_keys/{id}'
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling apiKeysIdDelete');
                }
                var httpRequestParams = {
                    method: 'DELETE',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update an API key
             * @param id ID of the API key to be updated
             * @param apiKey
             */
            DefaultApi.prototype.apiKeysIdPatch = function (id, apiKey, extraHttpRequestParams) {
                var path = this.basePath + '/api_keys/{id}'
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling apiKeysIdPatch');
                }
                // verify required parameter 'apiKey' is set
                if (!apiKey) {
                    throw new Error('Missing required parameter apiKey when calling apiKeysIdPatch');
                }
                var httpRequestParams = {
                    method: 'PATCH',
                    url: path,
                    json: true,
                    data: apiKey,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Get a list of all browsable public assets
             */
            DefaultApi.prototype.exploreGet = function (extraHttpRequestParams) {
                var path = this.basePath + '/explore';
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Get information on the current quota of an authenticated user
             */
            DefaultApi.prototype.quotasGet = function (extraHttpRequestParams) {
                var path = this.basePath + '/quotas';
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Unstar the selected catalogue
             * @param user ID of the user for who to unstar the catalogue
             * @param id ID (slug) of the catalogue to be unstared
             */
            DefaultApi.prototype.userCatalogueIdUnstarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogue/{id}/unstar'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCatalogueIdUnstarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userCatalogueIdUnstarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain a list of all public catalogues for a user. If provided with an enabled API key for that user,   returns also the private catalogues.
             * @param user
             */
            DefaultApi.prototype.userCataloguesGet = function (user, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Creates a new catalogue for the given user
             * @param user ID of the user for whom to obtain the catalogue
             * @param catalogue
             */
            DefaultApi.prototype.userCataloguesPost = function (user, catalogue, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesPost');
                }
                // verify required parameter 'catalogue' is set
                if (!catalogue) {
                    throw new Error('Missing required parameter catalogue when calling userCataloguesPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: catalogue,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain the attributes of the catalogue
             * @param user User that the catalogue belongs to
             * @param id ID (slug) of the catalogue to retrieve
             */
            DefaultApi.prototype.userCataloguesIdGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesIdGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userCataloguesIdGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update a catalogue (replace the currently stored one with the one provided in this call)
             * @param user User that the catalogue belongs to
             * @param id ID (slug) of the catalogue to replace
             * @param catalogue
             */
            DefaultApi.prototype.userCataloguesIdPut = function (user, id, catalogue, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesIdPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userCataloguesIdPut');
                }
                // verify required parameter 'catalogue' is set
                if (!catalogue) {
                    throw new Error('Missing required parameter catalogue when calling userCataloguesIdPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: catalogue,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Delete a catalogue
             * @param user User that the catalogue belongs to*
             * @param id ID (slug) of the catalogue to delete
             */
            DefaultApi.prototype.userCataloguesIdDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesIdDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userCataloguesIdDelete');
                }
                var httpRequestParams = {
                    method: 'DELETE',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update a catalogue (only change the properties provided in the call)
             * @param user User that the catalogue belongs to
             * @param id ID (slug) of the catalogue to change
             * @param catalogue
             */
            DefaultApi.prototype.userCataloguesIdPatch = function (user, id, catalogue, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesIdPatch');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userCataloguesIdPatch');
                }
                // verify required parameter 'catalogue' is set
                if (!catalogue) {
                    throw new Error('Missing required parameter catalogue when calling userCataloguesIdPatch');
                }
                var httpRequestParams = {
                    method: 'PATCH',
                    url: path,
                    json: true,
                    data: catalogue,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Star the selected catalogue
             * @param user ID of the user for who to star the catalogue
             * @param id ID (slug) of the catalogue to be stared
             */
            DefaultApi.prototype.userCataloguesIdStarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/catalogues/{id}/star'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userCataloguesIdStarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userCataloguesIdStarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain a list of all public data distributions for a user. If provided with an enabled API key for that user, returns also the private data distributions.
             * @param user
             */
            DefaultApi.prototype.userDataDistributionsGet = function (user, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * TODO DUE TO SWAGGER BUG THIS NEEDS TO BE TESTED WITH THE AUTO-GENERATED CLIENTS! Create a new data distribution
             * @param user
             * @param _public
             * @param name
             * @param code
             * @param file
             */
            DefaultApi.prototype.userDataDistributionsPost = function (user, _public, name, code, file, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                var formParams = {};
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsPost');
                }
                headerParams['Content-Type'] = 'application/x-www-form-urlencoded';
                formParams['public'] = _public;
                formParams['name'] = name;
                formParams['code'] = code;
                formParams['file'] = file;
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: false,
                    data: this.$httpParamSerializer(formParams),
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain the attributes of a data distribution
             * @param user User that the data distribution belongs to
             * @param id ID (slug) of the data distribution to retrieve
             */
            DefaultApi.prototype.userDataDistributionsIdGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * TO BE IMPLEMENTED - USE PATCH! Update a data distribution (replace the currently stored one with the one provided in the call)
             * @param user User that the data distribution belongs to
             * @param id ID (slug) of the data distribution to change
             * @param _public
             * @param name
             * @param code
             * @param file
             */
            DefaultApi.prototype.userDataDistributionsIdPut = function (user, id, _public, name, code, file, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                var formParams = {};
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdPut');
                }
                // verify required parameter '_public' is set
                if (!_public) {
                    throw new Error('Missing required parameter _public when calling userDataDistributionsIdPut');
                }
                // verify required parameter 'name' is set
                if (!name) {
                    throw new Error('Missing required parameter name when calling userDataDistributionsIdPut');
                }
                // verify required parameter 'code' is set
                if (!code) {
                    throw new Error('Missing required parameter code when calling userDataDistributionsIdPut');
                }
                // verify required parameter 'file' is set
                if (!file) {
                    throw new Error('Missing required parameter file when calling userDataDistributionsIdPut');
                }
                headerParams['Content-Type'] = 'application/x-www-form-urlencoded';
                formParams['public'] = _public;
                formParams['name'] = name;
                formParams['code'] = code;
                formParams['file'] = file;
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: false,
                    data: this.$httpParamSerializer(formParams),
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Delete a data distribution
             * @param user User that the data distribution belongs to
             * @param id ID (slug) of the data distribution to delete
             */
            DefaultApi.prototype.userDataDistributionsIdDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdDelete');
                }
                var httpRequestParams = {
                    method: 'DELETE',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * TODO DUE TO SWAGGER BUG THIS NEEDS TO BE TESTED WITH THE AUTO-GENERATED CLIENTS! Update a data distribution (only change the properties provided in the call)
             * @param user Data distribution to change
             * @param id ID (slug) of the data distribution to change
             * @param _public
             * @param name
             * @param code
             * @param file
             */
            DefaultApi.prototype.userDataDistributionsIdPatch = function (user, id, _public, name, code, file, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                var formParams = {};
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdPatch');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdPatch');
                }
                // verify required parameter '_public' is set
                if (!_public) {
                    throw new Error('Missing required parameter _public when calling userDataDistributionsIdPatch');
                }
                headerParams['Content-Type'] = 'application/x-www-form-urlencoded';
                formParams['public'] = _public;
                formParams['name'] = name;
                formParams['code'] = code;
                formParams['file'] = file;
                var httpRequestParams = {
                    method: 'PATCH',
                    url: path,
                    json: false,
                    data: this.$httpParamSerializer(formParams),
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * (NOT TESTED) Star the selected data distribution
             * @param user ID of the user for who to star the data distribution
             * @param id ID (slug) of the data distribution to be stared
             */
            DefaultApi.prototype.userDataDistributionsIdStarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/star'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdStarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdStarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * (NOT TESTED) Unstar the selected data distribution
             * @param user ID of the user for who to unstar the data distribution
             * @param id ID (slug) of the data distribution to be unstared
             */
            DefaultApi.prototype.userDataDistributionsIdUnstarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/unstar'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdUnstarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdUnstarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain a list of all public queriable data for a user. If provided with an enabled API key for that user, returns also the private queriable data.¨
             * @param user ID of the user for whom to obtain the queriable data
             */
            DefaultApi.prototype.userQueriableDataStoresGet = function (user, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Create a new queriable data to be stored
             * @param user ID of the user for whom to obtain the quireable data
             * @param queriableDataStore
             */
            DefaultApi.prototype.userQueriableDataStoresPost = function (user, queriableDataStore, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresPost');
                }
                // verify required parameter 'queriableDataStore' is set
                if (!queriableDataStore) {
                    throw new Error('Missing required parameter queriableDataStore when calling userQueriableDataStoresPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: queriableDataStore,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain the attributes of the given queriable data
             * @param user ID of the user for who to obtain the queriable data
             * @param id ID (slug) of the queriable data to retrieve
             */
            DefaultApi.prototype.userQueriableDataStoresIdGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update a queriable data (replace the currently stored one with the one provided in the call)
             * @param user ID of the user for who to obtain the queriable data
             * @param id ID (slug) of the queriable data to retrieve
             * @param queriableDataStore
             */
            DefaultApi.prototype.userQueriableDataStoresIdPut = function (user, id, queriableDataStore, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdPut');
                }
                // verify required parameter 'queriableDataStore' is set
                if (!queriableDataStore) {
                    throw new Error('Missing required parameter queriableDataStore when calling userQueriableDataStoresIdPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: queriableDataStore,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Delete a queriable data
             * @param user ID of the user who wants to delete the queriable data
             * @param id ID (slug) of the queriable data to delete
             */
            DefaultApi.prototype.userQueriableDataStoresIdDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdDelete');
                }
                var httpRequestParams = {
                    method: 'DELETE',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update a queriable data (only change the properties provided in the call)
             * @param user ID of the user for who to obtain the queriable data
             * @param id ID (slug) of the queriable data to retrieve
             * @param queriableDataStore
             */
            DefaultApi.prototype.userQueriableDataStoresIdPatch = function (user, id, queriableDataStore, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdPatch');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdPatch');
                }
                // verify required parameter 'queriableDataStore' is set
                if (!queriableDataStore) {
                    throw new Error('Missing required parameter queriableDataStore when calling userQueriableDataStoresIdPatch');
                }
                var httpRequestParams = {
                    method: 'PATCH',
                    url: path,
                    json: true,
                    data: queriableDataStore,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * NOT IMPLEMENTED?? Doesn&#39;t work... (Retrieve the code for the queriable data for edit)
             * @param user ID of the user for who to edit the queriable data
             * @param id ID (slug) of the queriable data to be edited
             */
            DefaultApi.prototype.userQueriableDataStoresIdEditGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/edit'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdEditGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdEditGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Star the selected queriable data
             * @param user ID of the user for who to star the queriable data
             * @param id ID (slug) of the queriable data to be stared
             */
            DefaultApi.prototype.userQueriableDataStoresIdStarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/star'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdStarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdStarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Unstar the selected queriable data
             * @param user ID of the user for who to unstar the queriable data
             * @param id ID (slug) of the queriable data to be unstared
             */
            DefaultApi.prototype.userQueriableDataStoresIdUnstarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/unstar'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdUnstarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdUnstarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * INVALID! Is this implemented?? (Retrieve versions of the queriable data)
             * @param user ID of the user for who to obtain the queriable data
             * @param id ID (slug) of the queriable data to retrieve
             */
            DefaultApi.prototype.userQueriableDataStoresIdVersionsGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/versions'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdVersionsGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdVersionsGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain a list of all public transformations for a user. If provided with an enabled API key for that user, returns also the private transformations.
             * @param user ID of the user for whom to obtain the list
             */
            DefaultApi.prototype.userTransformationsGet = function (user, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Creates a new transformation for the given user.
             * @param user ID of the user for whom to obtain the list
             * @param transformation
             */
            DefaultApi.prototype.userTransformationsPost = function (user, transformation, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsPost');
                }
                // verify required parameter 'transformation' is set
                if (!transformation) {
                    throw new Error('Missing required parameter transformation when calling userTransformationsPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: transformation,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Obtain the attributes of a transformation
             * @param user User that the transformation belongs to
             * @param id ID (slug) of the transformation to retrieve
             */
            DefaultApi.prototype.userTransformationsIdGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdGet');
                }
                var httpRequestParams = {
                    method: 'GET',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * TO BE IMPLEMENTED - USE PATCH! Update a transformation (replace the currently stored one with the one provided in the call)
             * @param user User that the transformation belongs to
             * @param id ID (slug) of the transformation to change
             * @param transformation
             */
            DefaultApi.prototype.userTransformationsIdPut = function (user, id, transformation, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdPut');
                }
                // verify required parameter 'transformation' is set
                if (!transformation) {
                    throw new Error('Missing required parameter transformation when calling userTransformationsIdPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: transformation,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Delete a transformation
             * @param user User that the transformation belongs to
             * @param id ID (slug) of the transformation to delete
             */
            DefaultApi.prototype.userTransformationsIdDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdDelete');
                }
                var httpRequestParams = {
                    method: 'DELETE',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Update a transformation (only change the properties provided in the call)
             * @param user User that the transformation belongs to
             * @param id ID (slug) of the transformation to change
             * @param transformation
             */
            DefaultApi.prototype.userTransformationsIdPatch = function (user, id, transformation, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdPatch');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdPatch');
                }
                // verify required parameter 'transformation' is set
                if (!transformation) {
                    throw new Error('Missing required parameter transformation when calling userTransformationsIdPatch');
                }
                var httpRequestParams = {
                    method: 'PATCH',
                    url: path,
                    json: true,
                    data: transformation,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Star the selected transformation
             * @param user ID of the user for who to star the transformation
             * @param id ID (slug) of the transformation to be stared
             */
            DefaultApi.prototype.userTransformationsIdStarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/star'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdStarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdStarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            /**
             *
             * Unstar the selected transformation
             * @param user ID of the user for who to unstar the transformation
             * @param id ID (slug) of the transformation to be unstared
             */
            DefaultApi.prototype.userTransformationsIdUnstarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/unstar'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdUnstarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdUnstarPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    params: queryParameters,
                    headers: headerParams
                };
                if (extraHttpRequestParams) {
                    httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
                }
                return this.$http(httpRequestParams);
            };
            DefaultApi.$inject = ['$http', '$httpParamSerializer'];
            return DefaultApi;
        })();
        Client.DefaultApi = DefaultApi;
    })(Client = API.Client || (API.Client = {}));
})(API || (API = {}));
