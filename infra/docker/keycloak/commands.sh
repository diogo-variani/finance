# Export data
./standalone.sh -Dkeycloak.migration.realmName=finance \
				-Dkeycloak.migration.action=export \
				-Dkeycloak.migration.provider=singleFile \
				-Dkeycloak.migration.file=/tmp/keycloak-export/finance-full-realm.json \
				-Djboss.socket.binding.port-offset=100

# Import data
./standalone.sh -Dkeycloak.migration.action=import \
				-Dkeycloak.migration.provider=singleFile \
				-Dkeycloak.migration.file=/tmp/keycloak-export/finance-full-realm.json
				-Dkeycloak.migration.strategy=OVERWRITE_EXISTING