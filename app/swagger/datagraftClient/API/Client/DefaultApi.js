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
             * Retrieve configuration for the chosen data distribution
             * @param user ID of the user for who to obtain the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to retrieve the configuration
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationGet');
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
             * Update configuration for the chosen data distribution
             * @param user ID of the user for who to update the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to update the configuration
             * @param configuration
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationPut = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userDataDistributionsIdConfigurationPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create configuration for the chosen data distribution
             * @param user ID of the user for who to create the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to create the configuration
             * @param configuration
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationPost = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userDataDistributionsIdConfigurationPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete configuration for the chosen data distribution
             * @param user ID of the user for who to delete the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to delete the configuration
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationDelete');
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
             * Retrieve configuration according to the given key for the chosen data distribution
             * @param user ID of the user for who to obtain the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to retrieve the configuration
             * @param key The key of the configuration field to obtain
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdConfigurationKeyGet');
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
             * Update a configuration field for the chosen data distribution
             * @param user ID of the user for who to update the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to update the configuration
             * @param key The key of the configuration field to update
             * @param configuration
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationKeyPut = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdConfigurationKeyPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userDataDistributionsIdConfigurationKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create a configuration field for the chosen data distribution
             * @param user ID of the user for who to create the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to create the configuration
             * @param key Key of the configuration to create
             * @param configuration
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationKeyPost = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdConfigurationKeyPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userDataDistributionsIdConfigurationKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete a configuration field for the chosen data distribution
             * @param user ID of the user for who to delete the configuration for the data distribution
             * @param id ID (slug) of the data distribution for which to delete the configuration
             * @param key The key of the configuration field to delete
             */
            DefaultApi.prototype.userDataDistributionsIdConfigurationKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdConfigurationKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdConfigurationKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdConfigurationKeyDelete');
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
             * Retrieve meta data for the chosen data distribution
             * @param user ID of the user for who to obtain the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to retrieve the meta data
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataGet');
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
             * Update meta data for the chosen data distribution
             * @param user ID of the user for who to update the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to update the meta data
             * @param metadata
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataPut = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userDataDistributionsIdMetadataPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create meta data for the chosen data distribution
             * @param user ID of the user for who to create the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to create the meta data
             * @param metadata
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataPost = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userDataDistributionsIdMetadataPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete meta data for the chosen data distribution
             * @param user ID of the user for who to delete the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to delete the meta data
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataDelete');
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
             * Retrieve meta data according to the given key for the chosen data distribution
             * @param user ID of the user for who to obtain the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to retrieve the meta data
             * @param key The key of the meta data field to obtain
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdMetadataKeyGet');
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
             * Update a meta data field for the chosen data distribution
             * @param user ID of the user for who to update the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to update the meta data
             * @param key The key of the meta data field to update
             * @param metadata
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataKeyPut = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdMetadataKeyPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userDataDistributionsIdMetadataKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create a meta data field for the chosen data distribution
             * @param user ID of the user for who to create the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to create the meta data
             * @param key Key of the metadata to create
             * @param metadata
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataKeyPost = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdMetadataKeyPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userDataDistributionsIdMetadataKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete a metadata field for the chosen data distribution
             * @param user ID of the user for who to delete the meta data for the data distribution
             * @param id ID (slug) of the data distribution for which to delete the meta data
             * @param key The key of the meta data field to delete
             */
            DefaultApi.prototype.userDataDistributionsIdMetadataKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/data_distributions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userDataDistributionsIdMetadataKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userDataDistributionsIdMetadataKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userDataDistributionsIdMetadataKeyDelete');
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
             * Obtain a list of all public queriable data for a user. If provided with an enabled API key for that user, returns also the private queriable data.
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
             * Retrieve configuration for the chosen queriable data store
             * @param user ID of the user for who to obtain the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to retrieve the configuration
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationGet');
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
             * Update configuration for the chosen queriable data store
             * @param user ID of the user for who to update the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to update the configuration
             * @param configuration
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationPut = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userQueriableDataStoresIdConfigurationPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create configuration for the chosen queriable data store
             * @param user ID of the user for who to create the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to create the configuration
             * @param configuration
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationPost = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userQueriableDataStoresIdConfigurationPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete configuration for the chosen queriable data store
             * @param user ID of the user for who to delete the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to delete the configuration
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationDelete');
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
             * Retrieve configuration according to the given key for the chosen queriable data store
             * @param user ID of the user for who to obtain the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to retrieve the configuration
             * @param key The key of the configuration field to obtain
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdConfigurationKeyGet');
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
             * Update a configuration field for the chosen queriable data store
             * @param user ID of the user for who to update the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to update the configuration
             * @param key The key of the configuration field to update
             * @param configuration
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationKeyPut = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdConfigurationKeyPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userQueriableDataStoresIdConfigurationKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create a configuration field for the chosen queriable data store
             * @param user ID of the user for who to create the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to create the configuration
             * @param key Key of the configuration to create
             * @param configuration
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationKeyPost = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdConfigurationKeyPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userQueriableDataStoresIdConfigurationKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete a configuration field for the chosen queriable data store
             * @param user ID of the user for who to delete the configuration for the queriable data store
             * @param id ID (slug) of the queriable data store for which to delete the configuration
             * @param key The key of the configuration field to delete
             */
            DefaultApi.prototype.userQueriableDataStoresIdConfigurationKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdConfigurationKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdConfigurationKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdConfigurationKeyDelete');
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
             * Retrieve meta data for the chosen queriable data store
             * @param user ID of the user for who to obtain the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to retrieve the meta data
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataGet');
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
             * Update meta data for the chosen queriable data store
             * @param user ID of the user for who to update the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to update the meta data
             * @param metadata
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataPut = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userQueriableDataStoresIdMetadataPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create meta data for the chosen queriable data store
             * @param user ID of the user for who to create the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to create the meta data
             * @param metadata
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataPost = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userQueriableDataStoresIdMetadataPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete meta data for the chosen queriable data store
             * @param user ID of the user for who to delete the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to delete the meta data
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataDelete');
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
             * Retrieve meta data according to the given key for the chosen queriable data store
             * @param user ID of the user for who to obtain the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to retrieve the meta data
             * @param key The key of the meta data field to obtain
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdMetadataKeyGet');
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
             * Update a meta data field for the chosen queriable data store
             * @param user ID of the user for who to update the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to update the meta data
             * @param key The key of the meta data field to update
             * @param metadata
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataKeyPut = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdMetadataKeyPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userQueriableDataStoresIdMetadataKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create a meta data field for the chosen queriable data store
             * @param user ID of the user for who to create the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to create the meta data
             * @param key Key of the metadata to create
             * @param metadata
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataKeyPost = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdMetadataKeyPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userQueriableDataStoresIdMetadataKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete a metadata field for the chosen queriable data store
             * @param user ID of the user for who to delete the meta data for the queriable data store
             * @param id ID (slug) of the queriable data store for which to delete the meta data
             * @param key The key of the meta data field to delete
             */
            DefaultApi.prototype.userQueriableDataStoresIdMetadataKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/queriable_data_stores/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userQueriableDataStoresIdMetadataKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userQueriableDataStoresIdMetadataKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userQueriableDataStoresIdMetadataKeyDelete');
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
             * Retrieve configuration for the chosen transformation
             * @param user ID of the user for who to obtain the configuration for the transformation
             * @param id ID (slug) of the transformation for which to retrieve the configuration
             */
            DefaultApi.prototype.userTransformationsIdConfigurationGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationGet');
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
             * Update configuration for the chosen transformation
             * @param user ID of the user for who to update the configuration for the transformation
             * @param id ID (slug) of the transformation for which to update the configuration
             * @param configuration
             */
            DefaultApi.prototype.userTransformationsIdConfigurationPut = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userTransformationsIdConfigurationPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create configuration for the chosen transformation
             * @param user ID of the user for who to create the configuration for the transformation
             * @param id ID (slug) of the transformation for which to create the configuration
             * @param configuration
             */
            DefaultApi.prototype.userTransformationsIdConfigurationPost = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userTransformationsIdConfigurationPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete configuration for the chosen transformation
             * @param user ID of the user for who to delete the configuration for the transformation
             * @param id ID (slug) of the transformation for which to delete the configuration
             */
            DefaultApi.prototype.userTransformationsIdConfigurationDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationDelete');
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
             * Retrieve configuration according to the given key for the chosen transformation
             * @param user ID of the user for who to obtain the configuration for the transformation
             * @param id ID (slug) of the transformation for which to retrieve the configuration
             * @param key The key of the configuration field to obtain
             */
            DefaultApi.prototype.userTransformationsIdConfigurationKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdConfigurationKeyGet');
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
             * Update a configuration field for the chosen transformation
             * @param user ID of the user for who to update the configuration for the transformation
             * @param id ID (slug) of the transformation for which to update the configuration
             * @param key The key of the configuration field to update
             * @param configuration
             */
            DefaultApi.prototype.userTransformationsIdConfigurationKeyPut = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdConfigurationKeyPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userTransformationsIdConfigurationKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create a configuration field for the chosen transformation
             * @param user ID of the user for who to create the configuration for the transformation
             * @param id ID (slug) of the transformation for which to create the configuration
             * @param key Key of the configuration to create
             * @param configuration
             */
            DefaultApi.prototype.userTransformationsIdConfigurationKeyPost = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdConfigurationKeyPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userTransformationsIdConfigurationKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete a configuration field for the chosen transformation
             * @param user ID of the user for who to delete the configuration for the transformation
             * @param id ID (slug) of the transformation for which to delete the configuration
             * @param key The key of the configuration field to delete
             */
            DefaultApi.prototype.userTransformationsIdConfigurationKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdConfigurationKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdConfigurationKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdConfigurationKeyDelete');
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
             * Retrieve meta data for the chosen transformation
             * @param user ID of the user for who to obtain the meta data for the transformation
             * @param id ID (slug) of the transformation for which to retrieve the meta data
             */
            DefaultApi.prototype.userTransformationsIdMetadataGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataGet');
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
             * Update meta data for the chosen transformation
             * @param user ID of the user for who to update the meta data for the transformation
             * @param id ID (slug) of the transformation for which to update the meta data
             * @param metadata
             */
            DefaultApi.prototype.userTransformationsIdMetadataPut = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userTransformationsIdMetadataPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create meta data for the chosen transformation
             * @param user ID of the user for who to create the meta data for the transformation
             * @param id ID (slug) of the transformation for which to create the meta data
             * @param metadata
             */
            DefaultApi.prototype.userTransformationsIdMetadataPost = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userTransformationsIdMetadataPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete meta data for the chosen transformation
             * @param user ID of the user for who to delete the meta data for the transformation
             * @param id ID (slug) of the transformation for which to delete the meta data
             */
            DefaultApi.prototype.userTransformationsIdMetadataDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataDelete');
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
             * Retrieve meta data according to the given key for the chosen transformation
             * @param user ID of the user for who to obtain the meta data for the transformation
             * @param id ID (slug) of the transformation for which to retrieve the meta data
             * @param key The key of the meta data field to obtain
             */
            DefaultApi.prototype.userTransformationsIdMetadataKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdMetadataKeyGet');
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
             * Update a meta data field for the chosen transformation
             * @param user ID of the user for who to update the meta data for the transformation
             * @param id ID (slug) of the transformation for which to update the meta data
             * @param key The key of the meta data field to update
             * @param metadata
             */
            DefaultApi.prototype.userTransformationsIdMetadataKeyPut = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdMetadataKeyPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userTransformationsIdMetadataKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create a meta data field for the chosen transformation
             * @param user ID of the user for who to create the meta data for the transformation
             * @param id ID (slug) of the transformation for which to create the meta data
             * @param key Key of the metadata to create
             * @param metadata
             */
            DefaultApi.prototype.userTransformationsIdMetadataKeyPost = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdMetadataKeyPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userTransformationsIdMetadataKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete a metadata field for the chosen transformation
             * @param user ID of the user for who to delete the meta data for the transformation
             * @param id ID (slug) of the transformation for which to delete the meta data
             * @param key The key of the meta data field to delete
             */
            DefaultApi.prototype.userTransformationsIdMetadataKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userTransformationsIdMetadataKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userTransformationsIdMetadataKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userTransformationsIdMetadataKeyDelete');
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
            /**
             *
             * Obtain a list of all public utility functions for a user. If provided with an enabled API key for that user, returns also the private utility functions.
             * @param user ID of the user for whom to obtain the utility functions
             */
            DefaultApi.prototype.userUtilityFunctionsGet = function (user, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsGet');
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
             * Create a new utility function
             * @param user ID of the user for whom to create the utility function
             * @param utilityFunction
             */
            DefaultApi.prototype.userUtilityFunctionsPost = function (user, utilityFunction, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions'
                    .replace('{' + 'user' + '}', String(user));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsPost');
                }
                // verify required parameter 'utilityFunction' is set
                if (!utilityFunction) {
                    throw new Error('Missing required parameter utilityFunction when calling userUtilityFunctionsPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: utilityFunction,
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
             * Obtain the attributes of the given utility function.
             * @param user ID of the user for who to obtain the utility function
             * @param id ID (slug) of the utility function to retrieve
             */
            DefaultApi.prototype.userUtilityFunctionsIdGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdGet');
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
             * Update a utility function by replacing the currently stored one with the one provided in this request
             * @param user ID of the user for who to update the utility function
             * @param id ID (slug) of the utility function to be updated
             * @param utilityFunction
             */
            DefaultApi.prototype.userUtilityFunctionsIdPut = function (user, id, utilityFunction, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdPut');
                }
                // verify required parameter 'utilityFunction' is set
                if (!utilityFunction) {
                    throw new Error('Missing required parameter utilityFunction when calling userUtilityFunctionsIdPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: utilityFunction,
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
             * Delete the given utility function
             * @param user ID of the user for who to delete the utility function
             * @param id ID (slug) of the utility function to delete
             */
            DefaultApi.prototype.userUtilityFunctionsIdDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdDelete');
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
             * Update a utility function by replacing only the parts provided in this request
             * @param user ID of the user for who to update the utility function
             * @param id ID (slug) of the utility function to be updated
             * @param utilityFunction
             */
            DefaultApi.prototype.userUtilityFunctionsIdPatch = function (user, id, utilityFunction, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdPatch');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdPatch');
                }
                // verify required parameter 'utilityFunction' is set
                if (!utilityFunction) {
                    throw new Error('Missing required parameter utilityFunction when calling userUtilityFunctionsIdPatch');
                }
                var httpRequestParams = {
                    method: 'PATCH',
                    url: path,
                    json: true,
                    data: utilityFunction,
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
             * Retrieve configuration for the chosen utility function
             * @param user ID of the user for who to obtain the configuration for the utility function
             * @param id ID (slug) of the utility function for which to retrieve the configuration
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationGet');
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
             * Update configuration for the chosen utility function
             * @param user ID of the user for who to update the configuration for the utility function
             * @param id ID (slug) of the utility function for which to update the configuration
             * @param configuration
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationPut = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userUtilityFunctionsIdConfigurationPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create configuration for the chosen utility function
             * @param user ID of the user for who to create the configuration for the utility function
             * @param id ID (slug) of the utility function for which to create the configuration
             * @param configuration
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationPost = function (user, id, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userUtilityFunctionsIdConfigurationPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete configuration for the chosen utility function
             * @param user ID of the user for who to delete the configuration for the utility function
             * @param id ID (slug) of the utility function for which to delete the configuration
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationDelete');
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
             * Retrieve configuration according to the given key for the chosen utility function
             * @param user ID of the user for who to obtain the configuration for the utility function
             * @param id ID (slug) of the utility function for which to retrieve the configuration
             * @param key The key of the configuration field to obtain
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdConfigurationKeyGet');
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
             * Update a configuration field for the chosen utility function
             * @param user ID of the user for who to update the configuration for the utility function
             * @param id ID (slug) of the utility function for which to update the configuration
             * @param key The key of the configuration field to update
             * @param configuration
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationKeyPut = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdConfigurationKeyPut');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userUtilityFunctionsIdConfigurationKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Create a configuration field for the chosen utility function
             * @param user ID of the user for who to create the configuration for the utility function
             * @param id ID (slug) of the utility function for which to create the configuration
             * @param key Key of the configuration to create
             * @param configuration
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationKeyPost = function (user, id, key, configuration, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdConfigurationKeyPost');
                }
                // verify required parameter 'configuration' is set
                if (!configuration) {
                    throw new Error('Missing required parameter configuration when calling userUtilityFunctionsIdConfigurationKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: configuration,
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
             * Delete a configuration field for the chosen utility function
             * @param user ID of the user for who to delete the configuration for the utility function
             * @param id ID (slug) of the utility function for which to delete the configuration
             * @param key The key of the configuration field to delete
             */
            DefaultApi.prototype.userUtilityFunctionsIdConfigurationKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/configuration/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdConfigurationKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdConfigurationKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdConfigurationKeyDelete');
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
             * Retrieve meta data for the chosen utility function
             * @param user ID of the user for who to obtain the meta data for the utility function
             * @param id ID (slug) of the utility function for which to retrieve the meta data
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataGet = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataGet');
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
             * Update meta data for the chosen utility function
             * @param user ID of the user for who to update the meta data for the utility function
             * @param id ID (slug) of the utility function for which to update the meta data
             * @param metadata
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataPut = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userUtilityFunctionsIdMetadataPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create meta data for the chosen utility function
             * @param user ID of the user for who to create the meta data for the utility function
             * @param id ID (slug) of the utility function for which to create the meta data
             * @param metadata
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataPost = function (user, id, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userUtilityFunctionsIdMetadataPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete meta data for the chosen utility function
             * @param user ID of the user for who to delete the meta data for the utility function
             * @param id ID (slug) of the utility function for which to delete the meta data
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataDelete = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataDelete');
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
             * Retrieve meta data according to the given key for the chosen utility function
             * @param user ID of the user for who to obtain the meta data for the utility function
             * @param id ID (slug) of the utility function for which to retrieve the meta data
             * @param key The key of the meta data field to obtain
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataKeyGet = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataKeyGet');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataKeyGet');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdMetadataKeyGet');
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
             * Update a meta data field for the chosen utility function
             * @param user ID of the user for who to update the meta data for the utility function
             * @param id ID (slug) of the utility function for which to update the meta data
             * @param key The key of the meta data field to update
             * @param metadata
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataKeyPut = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataKeyPut');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataKeyPut');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdMetadataKeyPut');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userUtilityFunctionsIdMetadataKeyPut');
                }
                var httpRequestParams = {
                    method: 'PUT',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Create a meta data field for the chosen utility function
             * @param user ID of the user for who to create the meta data for the utility function
             * @param id ID (slug) of the utility function for which to create the meta data
             * @param key Key of the metadata to create
             * @param metadata
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataKeyPost = function (user, id, key, metadata, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataKeyPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataKeyPost');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdMetadataKeyPost');
                }
                // verify required parameter 'metadata' is set
                if (!metadata) {
                    throw new Error('Missing required parameter metadata when calling userUtilityFunctionsIdMetadataKeyPost');
                }
                var httpRequestParams = {
                    method: 'POST',
                    url: path,
                    json: true,
                    data: metadata,
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
             * Delete a metadata field for the chosen utility function
             * @param user ID of the user for who to delete the meta data for the utility function
             * @param id ID (slug) of the utility function for which to delete the meta data
             * @param key The key of the meta data field to delete
             */
            DefaultApi.prototype.userUtilityFunctionsIdMetadataKeyDelete = function (user, id, key, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/metadata/{key}'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id))
                    .replace('{' + 'key' + '}', String(key));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataKeyDelete');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataKeyDelete');
                }
                // verify required parameter 'key' is set
                if (!key) {
                    throw new Error('Missing required parameter key when calling userUtilityFunctionsIdMetadataKeyDelete');
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
             * Star the selected utility function
             * @param user ID of the user for who to star the utility function
             * @param id ID (slug) of the utility function to be stared
             */
            DefaultApi.prototype.userUtilityFunctionsIdStarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/star'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdStarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdStarPost');
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
             * Unstar the selected utility function
             * @param user ID of the user for who to unstar the utility function
             * @param id ID (slut) of the utility function to be unstared
             */
            DefaultApi.prototype.userUtilityFunctionsIdUnstarPost = function (user, id, extraHttpRequestParams) {
                var path = this.basePath + '/{user}/utility_functions/{id}/unstar'
                    .replace('{' + 'user' + '}', String(user))
                    .replace('{' + 'id' + '}', String(id));
                var queryParameters = {};
                var headerParams = this.extendObj({}, this.defaultHeaders);
                // verify required parameter 'user' is set
                if (!user) {
                    throw new Error('Missing required parameter user when calling userUtilityFunctionsIdUnstarPost');
                }
                // verify required parameter 'id' is set
                if (!id) {
                    throw new Error('Missing required parameter id when calling userUtilityFunctionsIdUnstarPost');
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
