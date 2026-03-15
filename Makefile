.PHONY: run dev build start install lint format typecheck test test-e2e clean

# Start frontend + backend for development
run: install
	npx concurrently "npx vite" "npx tsx watch server/index.ts"

dev: run

# Production build
build: install
	npx vite build
	npx tsc -p tsconfig.server.json

# Run production server
start: build
	node dist-server/index.js

# Install dependencies
install:
	npm install

# Code quality
lint:
	npx eslint src/ server/

format:
	npx prettier --write .

typecheck:
	npx tsc --noEmit
	npx tsc -p tsconfig.server.json --noEmit

# Testing — runs lint, typecheck, unit tests
test: lint typecheck
	npx vitest run

test-e2e:
	npx playwright test

# Cleanup
clean:
	rm -rf dist dist-server node_modules
