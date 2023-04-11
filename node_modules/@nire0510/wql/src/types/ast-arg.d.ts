interface AstArg {
  type: string;
  column: string;
  name: string;
  args: AstArgArg;
  value: string;
}

interface AstArgArg {
  value: any;
}
