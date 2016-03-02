/// <reference path="api.d.ts" />

/* tslint:disable:no-unused-variable member-ordering */

namespace API.Client {
    'use strict';

    export class DefaultApi {
        protected basePath = 'http://127.0.0.1:3000';
        public defaultHeaders : any = {};

        static $inject: string[] = ['$http', '$httpParamSerializer'];

        constructor(protected $http: ng.IHttpService, protected $httpParamSerializer?: (d: any) => any, basePath?: string) {
            if (basePath) {
                this.basePath = basePath;
            }
        }

        private extendObj<T1,T2>(objA: T1, objB: T2) {
            for(let key in objB){
                if(objB.hasOwnProperty(key)){
                    objA[key] = objB[key];
                }
            }
            return <T1&T2>objA;
        }

        /**
         * 
         * Get all of a user&#39;s API keys
         */
        public apiKeysGet (extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/api_keys';

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Create new API key
         * @param apiKey 
         */
        public apiKeysPost (apiKey: APIKey, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/api_keys';

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'apiKey' is set
            if (!apiKey) {
                throw new Error('Missing required parameter apiKey when calling apiKeysPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Get the attributes of the API key
         * @param id ID of the API key to be deleted
         */
        public apiKeysIdGet (id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/api_keys/{id}'
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling apiKeysIdGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update an API key
         * @param id ID of the API key to be deleted
         */
        public apiKeysIdDelete (id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/api_keys/{id}'
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling apiKeysIdDelete');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update an API key
         * @param id ID of the API key to be updated
         * @param apiKey 
         */
        public apiKeysIdPatch (id: string, apiKey: APIKeyPatch, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/api_keys/{id}'
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling apiKeysIdPatch');
            }
            // verify required parameter 'apiKey' is set
            if (!apiKey) {
                throw new Error('Missing required parameter apiKey when calling apiKeysIdPatch');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Get a list of all browsable public assets
         */
        public exploreGet (extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/explore';

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Get information on the current quota of an authenticated user
         */
        public quotasGet (extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/quotas';

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Unstar the selected catalogue
         * @param user ID of the user for who to unstar the catalogue
         * @param id ID (slug) of the catalogue to be unstared
         */
        public userCatalogueIdUnstarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogue/{id}/unstar'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userCatalogueIdUnstarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userCatalogueIdUnstarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain a list of all public catalogues for a user. If provided with an enabled API key for that user,   returns also the private catalogues.
         * @param user 
         */
        public userCataloguesGet (user: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userCataloguesGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Creates a new catalogue for the given user
         * @param user ID of the user for whom to obtain the catalogue
         * @param catalogue 
         */
        public userCataloguesPost (user: string, catalogue: Catalogue, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userCataloguesPost');
            }
            // verify required parameter 'catalogue' is set
            if (!catalogue) {
                throw new Error('Missing required parameter catalogue when calling userCataloguesPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain the attributes of the catalogue
         * @param user User that the catalogue belongs to
         * @param id ID (slug) of the catalogue to retrieve
         */
        public userCataloguesIdGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userCataloguesIdGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userCataloguesIdGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a catalogue (replace the currently stored one with the one provided in this call)
         * @param user User that the catalogue belongs to
         * @param id ID (slug) of the catalogue to replace
         * @param catalogue 
         */
        public userCataloguesIdPut (user: string, id: string, catalogue: Catalogue, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete a catalogue
         * @param user User that the catalogue belongs to*
         * @param id ID (slug) of the catalogue to delete
         */
        public userCataloguesIdDelete (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userCataloguesIdDelete');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userCataloguesIdDelete');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a catalogue (only change the properties provided in the call)
         * @param user User that the catalogue belongs to
         * @param id ID (slug) of the catalogue to change
         * @param catalogue 
         */
        public userCataloguesIdPatch (user: string, id: string, catalogue: Catalogue, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Star the selected catalogue
         * @param user ID of the user for who to star the catalogue
         * @param id ID (slug) of the catalogue to be stared
         */
        public userCataloguesIdStarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/catalogues/{id}/star'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userCataloguesIdStarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userCataloguesIdStarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain a list of all public data distributions for a user. If provided with an enabled API key for that user, returns also the private data distributions.
         * @param user 
         */
        public userDataDistributionsGet (user: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userDataDistributionsGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * TODO DUE TO SWAGGER BUG THIS NEEDS TO BE TESTED WITH THE AUTO-GENERATED CLIENTS! Create a new data distribution
         * @param user 
         * @param _public 
         * @param name 
         * @param code 
         * @param file 
         */
        public userDataDistributionsPost (user: string, _public?: boolean, name?: string, code?: string, file?: any, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            let formParams: any = {};

            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userDataDistributionsPost');
            }
            headerParams['Content-Type'] = 'application/x-www-form-urlencoded';

            formParams['public'] = _public;

            formParams['name'] = name;

            formParams['code'] = code;

            formParams['file'] = file;

            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain the attributes of a data distribution
         * @param user User that the data distribution belongs to
         * @param id ID (slug) of the data distribution to retrieve
         */
        public userDataDistributionsIdGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userDataDistributionsIdGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userDataDistributionsIdGet');
            }
            let httpRequestParams: any = {
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
        }
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
        public userDataDistributionsIdPut (user: string, id: string, _public: boolean, name: string, code: string, file: any, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            let formParams: any = {};

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

            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete a data distribution
         * @param user User that the data distribution belongs to
         * @param id ID (slug) of the data distribution to delete
         */
        public userDataDistributionsIdDelete (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userDataDistributionsIdDelete');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userDataDistributionsIdDelete');
            }
            let httpRequestParams: any = {
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
        }
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
        public userDataDistributionsIdPatch (user: string, id: string, _public: boolean, name?: string, code?: string, file?: any, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            let formParams: any = {};

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

            let httpRequestParams: any = {
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
        }
        /**
         * 
         * (NOT TESTED) Star the selected data distribution
         * @param user ID of the user for who to star the data distribution
         * @param id ID (slug) of the data distribution to be stared
         */
        public userDataDistributionsIdStarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions/{id}/star'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userDataDistributionsIdStarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userDataDistributionsIdStarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * (NOT TESTED) Unstar the selected data distribution
         * @param user ID of the user for who to unstar the data distribution
         * @param id ID (slug) of the data distribution to be unstared
         */
        public userDataDistributionsIdUnstarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/data_distributions/{id}/unstar'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userDataDistributionsIdUnstarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userDataDistributionsIdUnstarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain a list of all public queriable data for a user. If provided with an enabled API key for that user, returns also the private queriable data.
         * @param user ID of the user for whom to obtain the queriable data
         */
        public userQueriableDataStoresGet (user: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Create a new queriable data to be stored
         * @param user ID of the user for whom to obtain the quireable data
         * @param queriableDataStore 
         */
        public userQueriableDataStoresPost (user: string, queriableDataStore: QueriableData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresPost');
            }
            // verify required parameter 'queriableDataStore' is set
            if (!queriableDataStore) {
                throw new Error('Missing required parameter queriableDataStore when calling userQueriableDataStoresPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain the attributes of the given queriable data
         * @param user ID of the user for who to obtain the queriable data
         * @param id ID (slug) of the queriable data to retrieve
         */
        public userQueriableDataStoresIdGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresIdGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userQueriableDataStoresIdGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a queriable data (replace the currently stored one with the one provided in the call)
         * @param user ID of the user for who to obtain the queriable data
         * @param id ID (slug) of the queriable data to retrieve
         * @param queriableDataStore 
         */
        public userQueriableDataStoresIdPut (user: string, id: string, queriableDataStore: QueriableData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete a queriable data
         * @param user ID of the user who wants to delete the queriable data
         * @param id ID (slug) of the queriable data to delete
         */
        public userQueriableDataStoresIdDelete (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresIdDelete');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userQueriableDataStoresIdDelete');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a queriable data (only change the properties provided in the call)
         * @param user ID of the user for who to obtain the queriable data
         * @param id ID (slug) of the queriable data to retrieve
         * @param queriableDataStore 
         */
        public userQueriableDataStoresIdPatch (user: string, id: string, queriableDataStore: QueriableData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * NOT IMPLEMENTED?? Doesn&#39;t work... (Retrieve the code for the queriable data for edit)
         * @param user ID of the user for who to edit the queriable data
         * @param id ID (slug) of the queriable data to be edited
         */
        public userQueriableDataStoresIdEditGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}/edit'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresIdEditGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userQueriableDataStoresIdEditGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Star the selected queriable data
         * @param user ID of the user for who to star the queriable data
         * @param id ID (slug) of the queriable data to be stared
         */
        public userQueriableDataStoresIdStarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}/star'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresIdStarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userQueriableDataStoresIdStarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Unstar the selected queriable data
         * @param user ID of the user for who to unstar the queriable data
         * @param id ID (slug) of the queriable data to be unstared
         */
        public userQueriableDataStoresIdUnstarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}/unstar'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresIdUnstarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userQueriableDataStoresIdUnstarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * INVALID! Is this implemented?? (Retrieve versions of the queriable data)
         * @param user ID of the user for who to obtain the queriable data
         * @param id ID (slug) of the queriable data to retrieve
         */
        public userQueriableDataStoresIdVersionsGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/queriable_data_stores/{id}/versions'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userQueriableDataStoresIdVersionsGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userQueriableDataStoresIdVersionsGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain a list of all public transformations for a user. If provided with an enabled API key for that user, returns also the private transformations.
         * @param user ID of the user for whom to obtain the list
         */
        public userTransformationsGet (user: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Creates a new transformation for the given user.
         * @param user ID of the user for whom to obtain the list
         * @param transformation 
         */
        public userTransformationsPost (user: string, transformation: Transformation, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsPost');
            }
            // verify required parameter 'transformation' is set
            if (!transformation) {
                throw new Error('Missing required parameter transformation when calling userTransformationsPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain the attributes of a transformation
         * @param user User that the transformation belongs to
         * @param id ID (slug) of the transformation to retrieve
         */
        public userTransformationsIdGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsIdGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userTransformationsIdGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * TO BE IMPLEMENTED - USE PATCH! Update a transformation (replace the currently stored one with the one provided in the call)
         * @param user User that the transformation belongs to
         * @param id ID (slug) of the transformation to change
         * @param transformation 
         */
        public userTransformationsIdPut (user: string, id: string, transformation: Transformation, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete a transformation
         * @param user User that the transformation belongs to
         * @param id ID (slug) of the transformation to delete
         */
        public userTransformationsIdDelete (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsIdDelete');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userTransformationsIdDelete');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a transformation (only change the properties provided in the call)
         * @param user User that the transformation belongs to
         * @param id ID (slug) of the transformation to change
         * @param transformation 
         */
        public userTransformationsIdPatch (user: string, id: string, transformation: Transformation, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Retrieve meta data for the chosen transformation
         * @param user ID of the user for who to obtain the meta data for the transformation
         * @param id ID (slug) of the transformation for which to retrieve the meta data
         */
        public userTransformationsIdMetadataGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsIdMetadataGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userTransformationsIdMetadataGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Create meta data for the chosen transformation
         * @param user ID of the user for who to create the meta data for the transformation
         * @param id ID (slug) of the transformation for which to create the meta data
         * @param metadata 
         */
        public userTransformationsIdMetadataPost (user: string, id: string, metadata: MetaData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete meta data for the chosen transformation
         * @param user ID of the user for who to delete the meta data for the transformation
         * @param id ID (slug) of the transformation for which to delete the meta data
         */
        public userTransformationsIdMetadataDelete (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsIdMetadataDelete');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userTransformationsIdMetadataDelete');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Retrieve meta data according to the given key for the chosen transformation
         * @param user ID of the user for who to obtain the meta data for the transformation
         * @param id ID (slug) of the transformation for which to retrieve the meta data
         * @param key The key of the meta data field to obtain
         */
        public userTransformationsIdMetadataKeyGet (user: string, id: string, key: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id))
                .replace('{' + 'key' + '}', String(key));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a meta data field for the chosen transformation
         * @param user ID of the user for who to update the meta data for the transformation
         * @param id ID (slug) of the transformation for which to update the meta data
         * @param key The key of the meta data field to update
         * @param metadata 
         */
        public userTransformationsIdMetadataKeyPut (user: string, id: string, key: string, metadata: MetaData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id))
                .replace('{' + 'key' + '}', String(key));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Create a meta data field for the chosen transformation
         * @param user ID of the user for who to create the meta data for the transformation
         * @param id ID (slug) of the transformation for which to create the meta data
         * @param key Key of the metadata to create
         * @param metadata 
         */
        public userTransformationsIdMetadataKeyPost (user: string, id: string, key: string, metadata: MetaData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id))
                .replace('{' + 'key' + '}', String(key));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete a metadata field for the chosen transformation
         * @param user ID of the user for who to delete the meta data for the transformation
         * @param id ID (slug) of the transformation for which to delete the meta data
         * @param key The key of the meta data field to delete
         */
        public userTransformationsIdMetadataKeyDelete (user: string, id: string, key: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/metadata/{key}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id))
                .replace('{' + 'key' + '}', String(key));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Star the selected transformation
         * @param user ID of the user for who to star the transformation
         * @param id ID (slug) of the transformation to be stared
         */
        public userTransformationsIdStarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/star'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsIdStarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userTransformationsIdStarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Unstar the selected transformation
         * @param user ID of the user for who to unstar the transformation
         * @param id ID (slug) of the transformation to be unstared
         */
        public userTransformationsIdUnstarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/transformations/{id}/unstar'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userTransformationsIdUnstarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userTransformationsIdUnstarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain a list of all public utility functions for a user. If provided with an enabled API key for that user, returns also the private utility functions.
         * @param user ID of the user for whom to obtain the utility functions
         */
        public userUtilityFunctionsGet (user: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Create a new utility function
         * @param user ID of the user for whom to create the utility function
         * @param utilityFunction 
         */
        public userUtilityFunctionsPost (user: string, utilityFunction: UtilityFunction, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions'
                .replace('{' + 'user' + '}', String(user));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsPost');
            }
            // verify required parameter 'utilityFunction' is set
            if (!utilityFunction) {
                throw new Error('Missing required parameter utilityFunction when calling userUtilityFunctionsPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Obtain the attributes of the given utility function.
         * @param user ID of the user for who to obtain the utility function
         * @param id ID (slug) of the utility function to retrieve
         */
        public userUtilityFunctionsIdGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsIdGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userUtilityFunctionsIdGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a utility function by replacing the currently stored one with the one provided in this request
         * @param user ID of the user for who to update the utility function
         * @param id ID (slug) of the utility function to be updated
         * @param utilityFunction 
         */
        public userUtilityFunctionsIdPut (user: string, id: string, utilityFunction: UtilityFunction, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Delete the given utility function
         * @param user ID of the user for who to delete the utility function
         * @param id ID (slug) of the utility function to delete
         */
        public userUtilityFunctionsIdDelete (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsIdDelete');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userUtilityFunctionsIdDelete');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Update a utility function by replacing only the parts provided in this request
         * @param user ID of the user for who to update the utility function
         * @param id ID (slug) of the utility function to be updated
         * @param utilityFunction 
         */
        public userUtilityFunctionsIdPatch (user: string, id: string, utilityFunction: UtilityFunction, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Retrieve meta data for the chosen utility function
         * @param user ID of the user for who to obtain the meta data for the utility function
         * @param id ID (slug) of the utility function for which retrieve the meta data
         */
        public userUtilityFunctionsIdMetadataGet (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}/metadata'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsIdMetadataGet');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userUtilityFunctionsIdMetadataGet');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Create meta data for the given utility function
         * @param user ID of the user for who to create the meta data for the utility function
         * @param id ID (slug) of the utility function for which to create meta data
         * @param metadata 
         */
        public userUtilityFunctionsIdMetadataPost (user: string, id: string, metadata: MetaData, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}/metadata'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
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
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Star the selected utility function
         * @param user ID of the user for who to star the utility function
         * @param id ID (slug) of the utility function to be stared
         */
        public userUtilityFunctionsIdStarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}/star'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsIdStarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userUtilityFunctionsIdStarPost');
            }
            let httpRequestParams: any = {
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
        }
        /**
         * 
         * Unstar the selected utility function
         * @param user ID of the user for who to unstar the utility function
         * @param id ID (slut) of the utility function to be unstared
         */
        public userUtilityFunctionsIdUnstarPost (user: string, id: string, extraHttpRequestParams?: any ) : ng.IHttpPromise<{}> {
            const path = this.basePath + '/{user}/utility_functions/{id}/unstar'
                .replace('{' + 'user' + '}', String(user))
                .replace('{' + 'id' + '}', String(id));

            let queryParameters: any = {};
            let headerParams: any = this.extendObj({}, this.defaultHeaders);
            // verify required parameter 'user' is set
            if (!user) {
                throw new Error('Missing required parameter user when calling userUtilityFunctionsIdUnstarPost');
            }
            // verify required parameter 'id' is set
            if (!id) {
                throw new Error('Missing required parameter id when calling userUtilityFunctionsIdUnstarPost');
            }
            let httpRequestParams: any = {
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
        }
    }
}
