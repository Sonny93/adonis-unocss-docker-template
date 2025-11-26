dev:
	@docker compose down
	@docker compose -f dev.compose.yml pull
	@docker compose -f dev.compose.yml up -d --wait
	@node ace migration:fresh
	@node ace db:seed --files "database/seeders/main/index_seeder.ts"
	@pnpm run dev

prod:
	@docker compose -f dev.compose.yml down
	@docker compose pull
	@docker compose up -d --build --wait

fresh:
	@node ace migration:fresh

seed:
	@node ace db:seed --files "database/seeders/main/index_seeder.ts"

down:
	@-docker compose down
	@-docker compose -f dev.compose.yml down

release:
	@npx release-it

mc-start:
	@docker run -d --name minecraft-server -p 25565:25565 --env-file minecraft-server.env itzg/minecraft-server

mc-stop:
	@-docker stop minecraft-server
	@-docker rm minecraft-server
