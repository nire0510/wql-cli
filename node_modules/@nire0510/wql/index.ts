import Response from './src/models/response';
import run from './src/modules/main';

export = function wql(query: string, options = {} as Options): Promise<Response[]> {
  return run(query, options);
}
