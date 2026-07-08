FROM oven/bun:1-slim as base

ENV NODE_ENV production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install all dependencies including dev (needed for build)
FROM base as deps

WORKDIR /myapp

ADD package.json bun.lock ./
RUN bun install --frozen-lockfile

# Install production dependencies only
FROM base as production-deps

WORKDIR /myapp

ADD package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD src/prisma /myapp/prisma
RUN bunx prisma generate

ADD . .
RUN bun run build

# Final production image
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
ADD . .

CMD ["bun", "start"]
