function runAPI {
  param(
    [Parameter(Mandatory)] [System.Collections.IDictionary] $Environment,
    [Parameter(Mandatory)] [scriptblock] $ScriptBlock
  )
  $htOrgEnv = @{}
  foreach ($kv in $Environment.GetEnumerator()) {
    $htOrgEnv[$kv.Key] = (Get-Item -EA SilentlyContinue "env:$($kv.Key)").Value
    Set-Item "env:$($kv.Key)" $kv.Value
  }
  try {
    & $ScriptBlock
  } finally {
    foreach ($kv in $Environment.GetEnumerator()) {
      Set-Item "env:$($kv.Key)" $htOrgEnv[$kv.Key]
    }
  }
}
$env = @{
  "NODE_ENV" = "debug-session-server"
  "OBA_EXPRESS_NAME" = "OBAExpressApi"
  "OBA_EXPRESS_MODE" = "init"
  "OBA_EXPRESS_HOST" = "oba-express-api.local"
  "OBA_EXPRESS_PORT" = "3001"
  "OBA_EXPRESS_ORIGINS" = "oba-dev-apps.com,oba-playground.app"
  "OBA_EXPRESS_CONSUMERS" = '{
    "oba-express":{"id":"00-obA-express","key":"1873487748","client":""}
  }'
  "OBA_EXPRESS_PROVIDERS" = '{
    "ip-data":{"id":"00-obA-express","key":"1873487748","client":""}
  }'
  "OBA_EXPRESS_MONGODB_LOCAL" = "mongodb://localhost:27017/oba-express-api"
  "OBA_EXPRESS_MONGODB_LIVE" = "mongodb+srv://ob-admin-jack:o2mdaFuGvJPQI1gs@cluster0.sueoh.mongodb.net/oba-express-api?retryWrites=true&w=majority"
  "OBA_EXPRESS_MONGODB_PROD" = "mongodb+srv://ob-admin-jack:o2mdaFuGvJPQI1gs@cluster0.sueoh.mongodb.net/oba-express-api?retryWrites=true&w=majority"
  "OBA_EXPRESS_EKEY" = "294194a295449d94d98e458f521f29a2c4b858903ec4246f4d1e2b5d1abca827"
  "OBA_EXPRESS_AUTH_COOKIE" = "_ob_auth_11"
  "OBA_EXPRESS_AUTH_SECRET" = "randomasssecret"
  "OBA_EXPRESS_SESSION_ID" = "_somesession"
  "OBA_EXPRESS_SESSION_SECRET" = "randomasssecret2"
}
$myscript = "/k code . && npm run watch-server"
runAPI $env {
  Set-Location "D:\oba\apps\oba-express-api"
  Start-Process "cmd" -ArgumentList "`"$myscript`""
}