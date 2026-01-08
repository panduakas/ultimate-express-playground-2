import { IsOptional, IsString } from 'class-validator';
import type mysql from 'mysql2/promise';
import { BaseDto } from '../../common/dto/base.dto.js';

export class TrainModelDto extends BaseDto {
  @IsOptional()
  connection?: mysql.Connection;
}

export class PredictPriceDto extends BaseDto {
  @IsOptional()
  connection?: mysql.Connection;

  @IsString()
  @IsOptional()
  symbol?: string;
}

export class AiPredictResponseDto extends BaseDto {
  predicted!: number;
  confidence!: number;

 

  constructor(params: AiPredictResponseDto) {
    super();
    const clean = AiPredictResponseDto.sanitize(params);
    this.predicted = clean.predicted;
    this.confidence = clean.confidence;
  }
}
