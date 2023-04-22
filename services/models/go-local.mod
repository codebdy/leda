module codebdy.com/leda/services/models

go 1.18

require (
	github.com/gertd/go-pluralize v0.2.1
	github.com/google/uuid v1.3.0
	golang.org/x/crypto v0.8.0
)

require (
	github.com/artdarek/go-unzip v1.0.0
	github.com/go-sql-driver/mysql v1.7.0
	github.com/graph-gophers/dataloader v5.0.0+incompatible
	github.com/mitchellh/mapstructure v1.5.0
	github.com/spf13/viper v1.15.0
	github.com/thinkeridea/go-extend v1.3.2
)

require (
	github.com/fsnotify/fsnotify v1.6.0 // indirect
	github.com/graphql-go/graphql v0.8.1 // indirect
	github.com/hashicorp/hcl v1.0.0 // indirect
	github.com/magiconair/properties v1.8.7 // indirect
	github.com/opentracing/opentracing-go v1.2.0 // indirect
	github.com/pelletier/go-toml/v2 v2.0.6 // indirect
	github.com/spf13/afero v1.9.3 // indirect
	github.com/spf13/cast v1.5.0 // indirect
	github.com/spf13/jwalterweatherman v1.1.0 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
	github.com/subosito/gotenv v1.4.2 // indirect
	golang.org/x/sys v0.7.0 // indirect
	golang.org/x/text v0.9.0 // indirect
	gopkg.in/ini.v1 v1.67.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

require github.com/codebdy/entify v0.0.0
replace github.com/codebdy/entify => ../../../entify

require github.com/codebdy/entify-graphql-schema v0.0.0
replace github.com/codebdy/entify-graphql-schema => ../../../entify-graphql-schema