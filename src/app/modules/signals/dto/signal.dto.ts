import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto.js';

export class CalculateSignalDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string;

  @IsInt()
  @IsOptional()
  timeframe?: number;
}

export class SignalsLatestQueryDto extends BaseDto {
  @IsString()
  @IsOptional()
  symbol?: string = 'BTCIDR';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tf?: number = 60;

}

export class SignalRowDto extends BaseDto {
  id?: number;
  symbol!: string;
  timeframeMin!: number;
  time!: Date;
  signal!: 'buy' | 'sell' | 'hold';
  predictedPrice!: number;
  strategyScores!: string;

 

  constructor(params: SignalRowDto) {
    super();
    const clean = SignalRowDto.sanitize(params);
    this.id = clean.id;
    this.symbol = clean.symbol;
    this.timeframeMin = clean.timeframeMin;
    this.time = clean.time;
    this.signal = clean.signal;
    this.predictedPrice = clean.predictedPrice;
    this.strategyScores = clean.strategyScores;
  }
}
