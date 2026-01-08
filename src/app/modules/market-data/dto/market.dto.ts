import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { BaseDto } from '../../common/dto/base.dto.js';

export class SyncOhlcvDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string;

  @IsInt()
  @IsOptional()
  timeframe?: number;
}

export class MarketLatestQueryDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string = 'BTCIDR';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tf?: number = 60;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  limit?: number = 10;
}

export class OhlcvRowDto extends BaseDto {
  id?: number;
  symbol!: string;
  timeframeMin!: number;
  time!: Date;
  open!: number;
  high!: number;
  low!: number;
  close!: number;
  volume!: number;

  constructor(params: OhlcvRowDto) {
    super();
    const clean = OhlcvRowDto.sanitize(params);
    this.id = clean.id;
    this.symbol = clean.symbol;
    this.timeframeMin = clean.timeframeMin;
    this.time = clean.time;
    this.open = clean.open;
    this.high = clean.high;
    this.low = clean.low;
    this.close = clean.close;
    this.volume = clean.volume;
  }
}
