import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  BrandSettings,
  BrandSettingsDocument,
} from "./schemas/brand-settings.schema";
import { UpdateBrandSettingsDto } from "./dto/update-brand-settings.dto";

@Injectable()
export class BrandSettingsService {
  constructor(
    @InjectModel(BrandSettings.name)
    private readonly brandSettingsModel: Model<BrandSettingsDocument>,
  ) {}

  async getBrandSettings(): Promise<BrandSettings | null> {
    return this.brandSettingsModel.findOne({ key: "global" }).lean().exec();
  }

  async upsertBrandSettings(
    dto: UpdateBrandSettingsDto,
  ): Promise<BrandSettings> {
    const updated = await this.brandSettingsModel
      .findOneAndUpdate(
        { key: "global" },
        { $set: { key: "global", ...dto } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException("Brand settings could not be saved");
    }

    return updated as BrandSettings;
  }
}
