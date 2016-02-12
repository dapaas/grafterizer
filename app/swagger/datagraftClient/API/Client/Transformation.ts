/// <reference path="api.d.ts" />

namespace API.Client {
    'use strict';

    export interface Transformation {

        name?: string;

        _public?: boolean;

        /**
         * JSON representation of a Grafterizer transformation
         */
        code?: string;
    }

}
