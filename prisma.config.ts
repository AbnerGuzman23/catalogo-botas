import { defineConfig, env } from "prisma/config";

import "dotenv/config";

export default {};
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
