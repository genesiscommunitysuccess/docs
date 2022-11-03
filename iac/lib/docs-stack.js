"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DocsStack = void 0;
var cdk = require("aws-cdk-lib");
var aws_cdk_lib_1 = require("aws-cdk-lib");
var BUCKET_ID = 'test-bucket-1';
var DocsStack = /** @class */ (function (_super) {
    __extends(DocsStack, _super);
    function DocsStack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        new aws_cdk_lib_1.aws_s3.Bucket(_this, BUCKET_ID, {
            versioned: true
        });
        return _this;
    }
    return DocsStack;
}(cdk.Stack));
exports.DocsStack = DocsStack;
