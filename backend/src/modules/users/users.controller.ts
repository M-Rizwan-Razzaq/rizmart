import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserDto, UpdateUserStatusDto } from "./dto/update-user.dto";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseObjectIdPipe } from "../../common/pipes/parse-object-id.pipe";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles("admin")
  @ApiOperation({ summary: "List all users (admin)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "Paginated user list" })
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ) {
    return this.usersService.findAll(page, limit, search);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by id (admin or own)" })
  @ApiResponse({ status: 200, description: "User details" })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(
    @Param("id", ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser.role !== "admin" && currentUser.userId !== id) {
      return this.usersService.findById(currentUser.userId);
    }
    return this.usersService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user profile (admin or own)" })
  @ApiResponse({ status: 200, description: "Updated user" })
  async update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    const targetId = currentUser.role === "admin" ? id : currentUser.userId;
    return this.usersService.update(targetId, dto);
  }

  @Patch("me/password")
  @ApiOperation({ summary: "Change current user password" })
  @ApiResponse({ status: 200, description: "Password updated successfully" })
  changePassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.changePassword(
      currentUser.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Patch(":id/block")
  @Roles("admin")
  @ApiOperation({ summary: "Block or unblock a user (admin)" })
  @ApiResponse({ status: 200, description: "Status updated" })
  updateStatus(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto.isBlocked);
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a user (admin)" })
  @ApiResponse({ status: 200, description: "User deleted" })
  remove(@Param("id", ParseObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }

  // ── Address endpoints (own account) ──────────────────────────────────────

  @Get("me/addresses")
  @ApiOperation({ summary: "Get current user addresses" })
  @ApiResponse({ status: 200, description: "List of addresses" })
  getAddresses(@CurrentUser() currentUser: any) {
    return this.usersService.getAddresses(currentUser.userId);
  }

  @Post("me/addresses")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add a new address" })
  @ApiResponse({ status: 201, description: "Updated address list" })
  addAddress(@Body() dto: CreateAddressDto, @CurrentUser() currentUser: any) {
    return this.usersService.addAddress(currentUser.userId, dto);
  }

  @Patch("me/addresses/:addressId")
  @ApiOperation({ summary: "Update an address" })
  @ApiResponse({ status: 200, description: "Updated address list" })
  updateAddress(
    @Param("addressId") addressId: string,
    @Body() dto: UpdateAddressDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.updateAddress(currentUser.userId, addressId, dto);
  }

  @Patch("me/addresses/:addressId/default")
  @ApiOperation({ summary: "Set address as default" })
  @ApiResponse({ status: 200, description: "Updated address list" })
  setDefaultAddress(
    @Param("addressId") addressId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.setDefaultAddress(currentUser.userId, addressId);
  }

  @Delete("me/addresses/:addressId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete an address" })
  @ApiResponse({ status: 200, description: "Updated address list" })
  deleteAddress(
    @Param("addressId") addressId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.deleteAddress(currentUser.userId, addressId);
  }
}
