import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto.js';

export class GenerateIndicatorsDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string;

  @IsInt()
  @IsOptional()
  timeframe?: number;
}

export class IndicatorSeriesQueryDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string = 'BTCIDR';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tf?: number = 60;

  @IsString()
  @IsOptional()
  name?: string = 'sma20';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  limit?: number = 10;

}

export class IndicatorRowDto extends BaseDto {
  id?: number;
  symbol!: string;
  timeframeMin!: number;
  time!: Date;
  name!: string;
  value!: number;

 

  constructor(params: IndicatorRowDto) {
    super();
    const clean = IndicatorRowDto.sanitize(params);
    this.id = clean.id;
    this.symbol = clean.symbol;
    this.timeframeMin = clean.timeframeMin;
    this.time = clean.time;
    this.name = clean.name;
    this.value = clean.value;
  }
}

 
