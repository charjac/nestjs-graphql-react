import { Errors } from '@shared/enums'
import { UnauthorizedException } from '@nestjs/common';

export class ExpiredAccessTokenException extends UnauthorizedException {
  code = Errors.ACCESS_TOKEN_EXPIRED;
  message = 'Access token expired';
}
