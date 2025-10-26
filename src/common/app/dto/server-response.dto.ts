import { Expose, Type } from 'class-transformer';

export class MetaDto {
  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;

  @Expose()
  itemsPerPage: number;
}

export class ServerResponseDto<T = object> {
  @Expose()
  statusCode?: number;

  @Expose()
  success?: boolean;

  @Expose()
  message?: string;

  @Expose()
  @Type(() => Object)
  data?: T;
}

export class ServerPaginatedResponseDto<T = object> extends ServerResponseDto<
  Array<T>
> {
  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;
}
