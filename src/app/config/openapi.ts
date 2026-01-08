export const generateOpenApi = (): unknown => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Ultimate Trading Service API',
      version: '1.0.0'
    },
    paths: {},
    components: {}
  };
};

import { BaseDto } from '../modules/common/dto/base.dto.js';

export class OkResponseDto extends BaseDto {
  ok!: true;
  constructor(_params?: OkResponseDto) {
    super();
    this.ok = true;
  }
}
