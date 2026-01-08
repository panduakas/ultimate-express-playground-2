import { IsOptional, IsString, IsInt } from 'class-validator';

import { BaseDto } from '../../common/dto/base.dto.js';

export class RunStrategiesDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string;

  @IsInt()
  @IsOptional()
  timeframe?: number;
}

export class StrategyResultDto extends BaseDto {
  name!: string;
  score!: number;
  signal!: 'buy' | 'sell' | 'hold';

  constructor(params: StrategyResultDto) {
    super();
    const clean = StrategyResultDto.sanitize(params);
    this.name = clean.name;
    this.score = clean.score;
    this.signal = clean.signal;
  }
}
