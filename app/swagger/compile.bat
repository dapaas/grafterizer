
REM this is a comment

java -jar ..\..\..\jarfter-swag\swagger-codegen-cli-215.jar generate -i datagraftAPI.yaml -l typescript-angular -o datagraftClient

tsc datagraftClient\API\Client\DefaultAPI.ts
