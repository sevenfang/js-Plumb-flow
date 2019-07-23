@echo off
@echo off
@echo off
@echo off

echo package
set package=yarn pub

echo login
set login=yarn login --registry  http://192.168.3.244:8081/repository/npm_hy/


echo publish
set publish=yarn publish --registry  http://192.168.3.244:8081/repository/npm_hy/

%package% && %login% && %publish%

echo finish
