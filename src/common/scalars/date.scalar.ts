import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<Date, Date> {
  name = 'Date';
  description = 'Date custom scalar type';

  parseValue(value: number): Date {
    return new Date(value);
  }

  serialize(value: Date): Date {
    return value;
  }

  parseLiteral(ast: ValueNode): Date {
    return ast.kind === Kind.INT ? new Date(ast.value) : null;
  }
}
