import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const dbState = this.connection.readyState;
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
      99: "uninitialized",
    };
    return {
      status: dbState === 1 ? "ok" : "error",
      db: dbStates[dbState as keyof typeof dbStates] ?? "unknown",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
