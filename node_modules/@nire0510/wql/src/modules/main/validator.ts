import Property from '../../models/property';
import Where from '../../models/where';

export function preValidate(ast: any, query: string): Validation {
  const astArray = Array.isArray(ast) ? ast : [ast];
  const validation: Validation = {
    valid: true,
    message: [],
  };

  astArray.forEach((astObject) => {
    Object.keys(astObject).forEach((key) => {
      switch (key) {
        case 'columns':
        case 'distinct':
        case 'into':
        case 'limit':
        case 'orderby':
        case 'union':
        case 'where':
        case 'from':
          if (!astObject.from) {
            validation.valid = false;
            validation.message.push('Missing from clause');
          } else if (astObject.from.length === 0) {
            validation.valid = false;
            validation.message.push('From clause must not be empty');
          } else {
            astObject.from.forEach((astObjectFrom: any) => {
              if (/https?:\/\//.test(astObjectFrom.table) === false) {
                validation.valid = false;
                validation.message.push('Invalid website URL');
              }
            });
          }
          break;
        case 'type':
          if (astObject.type !== 'select') {
            validation.valid = false;
            validation.message.push(`Unsupported query type: ${astObject.type}`);
          }
          break;
        default:
          if (!!astObject[key]) {
            validation.valid = false;
            validation.message.push(`Unsupported query clause: ${key}`);
          }
          break;
      }
    });
  });

  return validation;
}

export function postValidate(properties: Property[], where: Where): boolean {
  const specialPresets = ['emails', 'headers', 'images', 'links', 'scripts', 'stylesheets', 'tables'];
  const specialPresetsInUse = properties.filter((property: Property) => specialPresets.includes(property.name));

  if (specialPresetsInUse.length > 1) {
    throw new Error('Only one of scripts, links, images, stylesheets, emails, headers is supported');
  }

  if (specialPresetsInUse.length === 1 && where.selectors.length > 0) {
    throw new Error('Special presets and selectors are not supported together');
  }

  if (where.selectors.length > 1) {
    throw new Error('Only one selector is supported');
  }

  return true;
}
