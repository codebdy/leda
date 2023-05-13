package server

// func init() {
// 	// add the configuration paramters for the start command
// 	startCmd.Flags().StringVarP(&Port, "port", "p", "4000", "the port to listen on.")

// 	startCmd.Flags().StringSliceVarP(&Services, "services", "s", []string{}, "Specify the services to wrap over")
// 	startCmd.MarkFlagRequired("services")

// 	// add the start command to the root executable
// 	rootCmd.AddCommand(startCmd)
// }

// StartServer begins an http server running the gateway
func StartServer(services []string) {
	// start the http service wrapping those services
	ListenAndServe(services)
}
