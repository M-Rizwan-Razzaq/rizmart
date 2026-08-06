import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
  Optional,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseObjectIdPipe } from "../../common/pipes/parse-object-id.pipe";
import { OrderStatus } from "./schemas/order.schema";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Place an order (guest or authenticated)" })
  @ApiResponse({ status: 201, description: "Order placed" })
  async create(@Body() dto: CreateOrderDto, @Request() req: any) {
    // Optional JWT — works for both guests and logged-in users
    const userId: string | undefined = req.user?.userId;
    return this.ordersService.create(dto, userId);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a manual order (admin)" })
  @ApiResponse({ status: 201, description: "Manual order created" })
  createManual(@Body() dto: CreateOrderDto) {
    return this.ordersService.createManual(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List all orders (admin)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, enum: OrderStatus })
  @ApiQuery({ name: "search", required: false, type: String })
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("status") status?: OrderStatus,
    @Query("search") search?: string,
  ) {
    return this.ordersService.findAll(page, limit, status, search);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user orders" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  findMyOrders(
    @CurrentUser() currentUser: any,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findByUser(
      currentUser.userId,
      page,
      limit,
      currentUser.email,
    );
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get order by id (admin or owner)" })
  @ApiResponse({ status: 404, description: "Not found" })
  findOne(
    @Param("id", ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.ordersService.findById(id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update order status (admin)" })
  updateStatus(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(":id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel own pending order (customer)" })
  cancel(
    @Param("id", ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.ordersService.cancel(id, currentUser.userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete an order (admin)" })
  @ApiResponse({ status: 200, description: "Order deleted" })
  deleteOrder(@Param("id", ParseObjectIdPipe) id: string) {
    return this.ordersService.delete(id);
  }
}
