import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

const getSuccessResponse = (example?: any, description?: string) =>
  example
    ? {
        status: 201,
        description: description || 'Created',
        schema: {
          example,
        },
      }
    : {
        status: 201,
        description: description || 'Created',
      };

export const SwaggerAuthorizedPostRequest = (
  example?: any,
  description?: string,
  ...args: string[]
) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiResponse(getSuccessResponse(example, description)),
    ApiResponse({ status: 400, description: 'Validation error' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
