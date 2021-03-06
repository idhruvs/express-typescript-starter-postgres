import moduleAlias from 'module-alias';

const escapeRegex = (str: string) => str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
const removeLastSlash = (str: string) =>
  str.charAt(str.length - 1) === '/' ? str.substring(0, str.length - 1) : str;

export class CustomModuleLoader {
  config: any = require('../tsconfig.json');
  cOptions: any = this.config.compilerOptions;
  paths: any = this.cOptions.paths;

  constructor() {
    const aliasBuildPath = `${process.cwd()}/${this.cOptions.outDir}/${this.cOptions.baseUrl}`;
    const moduleAliasMap: any = {};
    for (const pathAlias of Object.keys(this.paths)) {
      const modulePath = this.paths[pathAlias][0];
      const segments = pathAlias.split(/\*/g);
      if (segments.length === 1 || segments.length === 2) {
        const escapedSeg = escapeRegex(segments[0]);
        const aliasKey = removeLastSlash(escapedSeg);
        const modulePathSegment = modulePath.split(/\*/g)[0];
        const tsPattern = /\.ts$/;
        const aliasValue = removeLastSlash(modulePathSegment).replace(tsPattern, '.js');
        moduleAliasMap[aliasKey] = `${aliasBuildPath}/${aliasValue}`;
      } else {
        console.warn('Multi start path is not supported.');
        continue;
      }
    }

    // if path aliases doesn't work, register it manually by using moduleAlias.addAliases method
    // moduleAlias.addAliases({
    //   '@appTypes': `${aliasBuildPath}/types`,
    //   '@constants': `${aliasBuildPath}/constants/index.js`,
    //   '@logger': `${aliasBuildPath}/config/logger.js`,
    //   '@utils': `${aliasBuildPath}/api/utils`,
    //   '@services': `${aliasBuildPath}/api/services`,
    //   '@repository/mongo': `${aliasBuildPath}/api/repository/mongo/collection`,
    // });
    moduleAlias.addAliases(moduleAliasMap);
  }
}
