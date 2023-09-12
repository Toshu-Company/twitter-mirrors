import { ApiProperty } from '@nestjs/swagger';

export class DetailDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'URL',
  })
  url!: string;
}
