import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<PaginatedResponse<UserDocument>> {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).lean().exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data: data as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return user as any;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password")
      .exec();
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (exists) throw new ConflictException("Email already registered");
    const created = new this.userModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    await this.findById(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();

    return updated as any;
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).select("+password").exec();

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return { message: "Password updated successfully" };
  }

  async updateStatus(id: string, isBlocked: boolean): Promise<UserDocument> {
    await this.findById(id);
    const updated = await this.userModel
      .findByIdAndUpdate(id, { isBlocked }, { new: true })
      .lean()
      .exec();
    return updated as any;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.userModel.findByIdAndDelete(id);
    return { message: "User deleted successfully" };
  }

  // ── Addresses ──────────────────────────────────────────────────────────────

  async getAddresses(userId: string): Promise<any[]> {
    const user = await this.userModel
      .findById(userId)
      .select("addresses")
      .lean()
      .exec();
    if (!user) throw new NotFoundException("User not found");
    return (user as any).addresses ?? [];
  }

  async addAddress(userId: string, dto: CreateAddressDto): Promise<any[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    const newAddr: any = {
      _id: new Types.ObjectId(),
      ...dto,
      isDefault: (user.addresses ?? []).length === 0, // first address is default
    };

    // If this is marked default, clear existing default
    if (newAddr.isDefault) {
      (user.addresses ?? []).forEach((a: any) => {
        a.isDefault = false;
      });
    }

    user.addresses = [...(user.addresses ?? []), newAddr];
    await user.save();
    return user.addresses;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<any[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    const idx = (user.addresses ?? []).findIndex(
      (a: any) => a._id.toString() === addressId,
    );
    if (idx === -1) throw new NotFoundException("Address not found");

    Object.assign(user.addresses[idx], dto);
    await user.save();
    return user.addresses;
  }

  async deleteAddress(userId: string, addressId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    const wasDefault = (user.addresses ?? []).find(
      (a: any) => a._id.toString() === addressId,
    )?.isDefault;

    user.addresses = (user.addresses ?? []).filter(
      (a: any) => a._id.toString() !== addressId,
    );

    // Reassign default to first remaining address
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return user.addresses;
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    const found = (user.addresses ?? []).find(
      (a: any) => a._id.toString() === addressId,
    );
    if (!found) throw new NotFoundException("Address not found");

    (user.addresses ?? []).forEach((a: any) => {
      a.isDefault = a._id.toString() === addressId;
    });

    await user.save();
    return user.addresses;
  }
}
