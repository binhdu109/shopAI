import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsIn,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';

export class ChatHistoryItemDto {
    @IsIn(['user', 'model'])
    role!: 'user' | 'model';

    @IsString()
    @MaxLength(4000)
    text!: string;
}

export class ChatDto {
    @IsString()
    @MinLength(1, { message: 'Tin nhắn không được để trống' })
    @MaxLength(500, { message: 'Tin nhắn tối đa 500 ký tự' })
    message!: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => ChatHistoryItemDto)
    history?: ChatHistoryItemDto[];
}
