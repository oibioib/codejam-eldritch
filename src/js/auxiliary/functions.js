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

export const isAllBoolenTrue = (...args) => args.every((arg) => !!arg);

export const arrayShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export const loadImg = (imgSrc) => new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.addEventListener('load', () => resolve(imgSrc));
    img.addEventListener('error', reject);
});
