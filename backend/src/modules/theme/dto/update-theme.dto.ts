import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateThemeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  background?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  foreground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  card?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cardForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  popover?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  popoverForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  muted?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mutedForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accentForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destructive?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destructiveForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  border?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ring?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gold?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  goldSoft?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  goldDark?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ivory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  onyx?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarPrimary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarPrimaryForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarAccent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarAccentForeground?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarBorder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sidebarRing?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iconColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayFont?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bodyFont?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buttonGradientStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buttonGradientEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buttonForeground?: string;
}
