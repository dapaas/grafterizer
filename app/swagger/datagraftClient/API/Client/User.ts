/// <reference path="api.d.ts" />

namespace API.Client {
    'use strict';

    export interface User {

        username?: string;

        email: string;

        /**
         * Name of the organisation the user belongs to
         */
        organization?: string;

        /**
         * Address of the user
         */
        place?: string;
    }

}
