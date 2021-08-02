# create task
az acr task create --registry $ACR_NAME --name taskNodejsExpressTemplate --image nodejsexpress:{{.Run.ID}} --context https://github.com/wuhaibo/nodejs_express_template.git#master --file Dockerfile --git-access-token $GIT_PAT --resource-group erp_nodejs

# run build task
az acr task run --registry $ACR_NAME --name taskNodejsExpressTemplate --resource-group erp_nodejs

# list item in acr