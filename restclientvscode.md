@echo off
@hostname = localhost
@port = 8080
@host = {{hostname}}:{{port}}
@name = 'test'
@token = 'token'
# vscode中使用rest client的教程  安装插件  然后新建一个rest client文件 （.http 或.rest文件）  然后在文件中写请求  然后点击发送请求  就可以看到请求的结果了 
# https://github.com/Huachao/vscode-restclient
# https://zhuanlan.zhihu.com/p/335676036
# https://www.tpisoftware.com/tpu/articleDetails/2316
# https://www.pkslow.com/archives/vscode-rest-client


# 针对不同的环境可以设置 不一样的环境变量 vscode settings.json中配置
# {
#   "rest-client.environmentVariables": {
#     "$shared": {
#         "version": "v1"
#     },
#     "local": {
#         "version": "v2",
#         "host": "http://localhost:8000",
#         "token": "tokentokentokentoken1"
#     },
#     "prod": {
#         "host": "http://api.cloud-wave.cn",
#         "token": "tokentokentoken2"
#     }
# }
# }

# 定义请求头
# GET /api/v1/info HTTP/1.1



GET https://{{host}}/xxxx/bbbb HTTP/1.1
content-type: application/json
Authorization: Bearer {{token}}

### 请求获取token
# @name loginAuth
@token = {{loginAuth.response.headers.Authorization}}
curl 'http://27.17.60.122:46001/rest/userService/v1/user/userLogin' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: zh-CN' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -b 'sidebar_collapsed=false; syslang=zh; ORIGINURL=http://27.17.60.122:16688; remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ilcxc3pNbDBzSWlReVlTUXhNQ1J2V0dkSk1rOXZjR1paUjFaa05qZElNVGwwT1VoUElpd2lNVGMwTURNMk56ZzBOaTR3TnpRM05UUXlJbDA9IiwiZXhwIjoiMjAyNS0wMy0xMFQwMzozMDo0Ni4wNzRaIiwicHVyIjoiY29va2llLnJlbWVtYmVyX3VzZXJfdG9rZW4ifX0%3D--4c37ba651a956742f40621ef41587cb68222f9f3; _gitlab_session=9df1f76ed070085d6ab6f13aa8297421; event_filter=all; SESSION=MjEzNTg5NjctNTQ4OS00MTI0LWIyMTgtOGJiMjExNjZkYmU1' \
  -H 'Origin: http://27.17.60.122:46001' \
  -H 'Pragma: no-cache' \
  -H 'Proxy-Connection: keep-alive' \
  -H 'Referer: http://27.17.60.122:46001/' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36' \
  -H 'requestBybrowser: Y' \
  -H 'tyInjectParams: ff91abd051f680f1dbfbf8312d87e545edd76d0b923404cdac6376e424c64c76' \
  -H 'userID: null' \
  -H 'w3Auth: N' \
  --data-raw '{"name":"admin","password":"Ty#123456","appID":"Chrome(133.0.0.0)"}' \
  --insecure