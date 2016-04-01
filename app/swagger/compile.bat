
REM this is a comment

java -jar swagger-codegen-cli-215.jar generate -i datagraftAPI.yaml -l typescript-angular -o datagraftClient

REM To install tsc: npm install -g typescript
tsc datagraftClient\API\Client\DefaultAPI.ts
