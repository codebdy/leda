package camunda

import (
	"context"
	"fmt"
	"log"

	"github.com/camunda/zeebe/clients/go/v8/pkg/zbc"
	"rxdrag.com/entify/config"
)

func DeployProcess(xml string, id uint64) {
	client, err := zbc.NewClient(&zbc.ClientConfig{
		GatewayAddress:         config.ZeebeAddress(),
		UsePlaintextConnection: true,
	})

	if err != nil {
		panic(err)
	}

	ctx := context.Background()
	response, err := client.NewDeployResourceCommand().AddResource([]byte(xml), fmt.Sprintf("%d.bpmn", id)).Send(ctx)
	if err != nil {
		panic(err)
	}
	processId := response.Deployments[0].GetProcess().BpmnProcessId
	log.Println(response.String())

	// After the process is deployed.
	variables := make(map[string]interface{})
	variables["orderId"] = "31243"

	request, err := client.NewCreateInstanceCommand().BPMNProcessId(processId).LatestVersion().VariablesFromMap(variables)
	if err != nil {
		panic(err)
	}

	msg, err := request.Send(ctx)
	if err != nil {
		panic(err)
	}

	log.Println(msg.String())
}
