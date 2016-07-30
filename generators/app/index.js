'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = yeoman.generators.Base.extend({
  prompting: function () {

    var done = this.async();

    // Have Yeoman greet the user

    this.log(yosay(
      'Bienvenido al generador de proyectos: ' + chalk.red('generator-tutorial')
    ));

    var prompts = [
      {
        type: 'confirm',
        name: 'isGenerator',
        message: 'Hola, ¿Quieres generar un proyecto?',
        default: true
      },
      {
        type    : 'input',
        name    : 'name',
        message : '¿Cómo se llama tu proyecto?',
        default : this.appname // Default to current folder name
      },
      {
        type    : 'input',
        name    : 'version',
        message : '¿Cual es la versión del proyecto?',
        default : '1.0.0' // Default version
      },
      {
        type    : 'input',
        name    : 'description',
        message : 'Descripción del proyecto',
        default : 'Proyecto generado con: generator-tutorial' // Default description
      },
      {
        type    : 'input',
        name    : 'author',
        message : '¿Cómo te llamas?',
        default : 'Anonymous' // Default anonymous
      }, 
      {
        type: 'checkbox',
        name: 'features',
        message: '¿Qué dependencias necesitas?',
        choices: [{
            name: 'jQuery',
            value: 'jQueryDependency',
            checked: true
        }, {
            name: 'bootstrap',
            value: 'bootstrapDependency',
            checked: false
        }, {
            name: 'angular',
            value: 'angularDependency',
            checked: false
        }]
      },
      {
        type    : 'input',
        name    : 'gitRepository',
        message : '¿Tienes repositorio git?'
      }
    ];

    this.prompt(prompts, function (answers) {

      this.props = answers;

      var features = answers.features;

      function hasFeatures(feat) {
          return features.indexOf(feat) !== -1;
      }

      // Name out spaces

      this.props.name = slugify(answers.name);

      // Dependencies bower

      this.props.features.jquery = hasFeatures('jQueryDependency');
      this.props.features.bootstrap = hasFeatures('bootstrapDependency');
      this.props.features.angular = hasFeatures('angularDependency');

      done();
    }.bind(this));
  },

  writing: function () {
    this.log(this.props.name);
    this.fs.copyTpl(
      this.templatePath('app/index.html'),
      this.destinationPath('app/index.html'), {
        name: this.props.name
      }
    );
    this.fs.copy(
      this.templatePath('app/static/css/styles.css'),
      this.destinationPath('app/static/css/styles.css'), {
        name: this.props.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'), {
          name: this.props.name,
          author: this.props.author,
          version: this.props.version,
          jquery: this.props.features.jquery,
          bootstrap: this.props.features.bootstrap,
          angular: this.props.features.angular
      }
    );
    this.fs.copy(
      this.templatePath('bowerrc'),
      this.destinationPath('.bowerrc')
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'), {
          name: this.props.name,
          version: this.props.version,
          author: this.props.author,
          description: this.props.description,
          gitRepository: this.props.gitRepository
      }
    );
  },

  install: function () {
    this.installDependencies();
  }
});
