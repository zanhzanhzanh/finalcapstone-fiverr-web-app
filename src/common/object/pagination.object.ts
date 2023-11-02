import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class Pagination {
    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    pageIndex: number;
    
    @ApiPropertyOptional({ example: 2 })
    @IsNumber()
    pageSize: number;
    
    @ApiPropertyOptional({ example: 'email'})
    propertyKey: string;
    
    @ApiPropertyOptional({ example: '@example'})
    keyQuery: string;
}