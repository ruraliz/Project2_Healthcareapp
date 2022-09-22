'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.recipe.belongsTo(models.user)
      models.recipe.hasMany(models.comment)
      // define association here
    }
  }
  recipe.init({
    recipeUri: DataTypes.STRING,
    dishName: DataTypes.STRING,
    recipeTime: DataTypes.STRING,
    recipeCalories: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'recipe',
  });
  return recipe;
};