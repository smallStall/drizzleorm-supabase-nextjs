/* eslint-disable class-methods-use-this */
class Vars {
  get host () {
    return this.envHost || 'dbdocs.io';
  }

  get apiHost () {
    return this.envApiHost || `api.${this.host}`;
  }

  get hostUrl () {
    return this.host.startsWith('http') ? this.host : `https://${this.host}`;
  }

  get apiUrl () {
    return this.apiHost.startsWith('http') ? this.apiHost : `https://${this.apiHost}`;
  }

  get envHost () {
    return process.env.DBDOCS_HOST;
  }

  get envApiHost () {
    return process.env.DBDOCS_API_HOST;
  }
}

module.exports.Vars = Vars;
module.exports.vars = new Vars();
/* eslint-enable class-methods-use-this */
