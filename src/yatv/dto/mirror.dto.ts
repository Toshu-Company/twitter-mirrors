import { ApiProperty } from '@nestjs/swagger';

export class MirrorDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  url!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  ['content-type']?: string;
}
