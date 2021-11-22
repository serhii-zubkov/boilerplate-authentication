import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

const getSuccessResponse = (example?: any, description?: string) =>
  example
    ? {
        status: 200,
        description: description || 'Updated',
        schema: {
          example,
        },
      }
    : {
        status: 200,
        description: description || 'Updated',
      };

export const SwaggerAuthorizedPatchRequest = (
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
    ApiResponse({ status: 404, description: 'Not found' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
