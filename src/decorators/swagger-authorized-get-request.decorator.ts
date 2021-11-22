import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export const SwaggerAuthorizedGetRequest = (example: any, ...args: string[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: {
        example,
      },
    }),
    ApiResponse({ status: 400, description: 'Validation error' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'Not found' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
