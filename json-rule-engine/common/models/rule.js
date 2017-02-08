import { ruleEngine } from '../../rules';

module.exports = function (Rule) {
  Rule.observe('after save', (ctx, next) => {
    if (ctx.instance) {
      console.log('Saved %s#%s, Restarting Rule Engine', ctx.Model.modelName, ctx.instance.id);
      ruleEngine.restartRuleEngine();
    } else {
      console.log('Updated %s matching %j',
        ctx.Model.pluralModelName,
        ctx.where);
    }
    next();
  });
};
