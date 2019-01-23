const { deleteBox, deleteAllBoxes } = require('./deleteBox');
const { createBox } = require('./createBox');
const { 
  fetchBox, 
  fetchAllBoxes, 
  fetchAllPublicBoxes, 
  fetchBoxesByCategory,
  fetchBoxByName
} = require('./readBox');
const { updateBox } = require( './updateBox');

const boxControllers = {
  deleteBox,
  createBox,
  fetchAllBoxes,
  fetchAllPublicBoxes,
  fetchBox,
  updateBox,
  deleteAllBoxes,
  fetchBoxesByCategory,
  fetchBoxByName
};

module.exports = boxControllers;
