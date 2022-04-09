import randomInteger from "random-int";

const getRandomString = () => randomInteger(5);
const getRandomFret = () => randomInteger(24);

export { getRandomString, getRandomFret };
