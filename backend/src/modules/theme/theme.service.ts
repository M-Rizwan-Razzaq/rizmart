import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ThemeSettings, ThemeDocument } from "./schemas/theme.schema";
import { UpdateThemeDto } from "./dto/update-theme.dto";

@Injectable()
export class ThemeService {
  constructor(
    @InjectModel(ThemeSettings.name)
    private readonly themeModel: Model<ThemeDocument>,
  ) {}

  async getTheme(): Promise<ThemeSettings | null> {
    const theme = await this.themeModel
      .findOne({ key: "global" })
      .lean()
      .exec();
    if (!theme) return null;
    return this.stripBrandFields(theme);
  }

  async upsertTheme(dto: UpdateThemeDto): Promise<ThemeSettings> {
    const updated = await this.themeModel
      .findOneAndUpdate(
        { key: "global" },
        {
          $set: { key: "global", ...dto },
          $unset: {
            appName: "",
            contactEmail: "",
            contactPhone: "",
            atelier: "",
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException("Theme settings could not be saved");
    }

    return this.stripBrandFields(updated as ThemeSettings);
  }

  async deleteTheme(): Promise<{ deleted: boolean }> {
    const result = await this.themeModel.deleteOne({ key: "global" }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  private stripBrandFields(theme: ThemeSettings): ThemeSettings {
    const cleaned = { ...theme } as any;
    delete cleaned.appName;
    delete cleaned.contactEmail;
    delete cleaned.contactPhone;
    delete cleaned.atelier;
    return cleaned as ThemeSettings;
  }
}
