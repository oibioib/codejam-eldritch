export const getRandomNum = (fromInclude, toInclude) => {
    const min = Math.ceil(fromInclude);
    const max = Math.floor(toInclude);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomNums = (fromInclude, toInclude, quantity) => {
    const nums = [];
    while (nums.length < quantity) {
        const rand = getRandomNum(fromInclude, toInclude - 1);
        if (!nums.includes(rand)) {
            nums.push(rand);
        }
    }
    return nums;
};
