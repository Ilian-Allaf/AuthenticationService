"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePasswordProgress = exports.isPasswordValid = exports.getCriteriaSatisfactionObject = exports.criteriaWeights = exports.passwordMaxLength = exports.passwordMinLength = void 0;
exports.passwordMinLength = 8;
exports.passwordMaxLength = 50;
exports.criteriaWeights = {
    minLenght: 7 / 10,
    maxLenght: 0,
    oneDigit: 1 / 10,
    oneUppercase: 1 / 10,
    oneSpecialCharacter: 1 / 10
};
function getCriteriaSatisfactionObject(password) {
    const criteria = {
        minLenght: password.length >= exports.passwordMinLength,
        maxLenght: password.length <= exports.passwordMaxLength,
        oneDigit: /\d/.test(password),
        oneUppercase: /[A-Z]/.test(password),
        oneSpecialCharacter: /[^a-zA-Z0-9]/.test(password),
    };
    return criteria;
}
exports.getCriteriaSatisfactionObject = getCriteriaSatisfactionObject;
function isPasswordValid(password) {
    const criteria = getCriteriaSatisfactionObject(password);
    return Object.values(criteria).every((criterion) => criterion);
}
exports.isPasswordValid = isPasswordValid;
const calculatePasswordProgress = (password) => {
    const criteriaSatisfactionObject = getCriteriaSatisfactionObject(password);
    let basePercentage = 0;
    if (password.length >= exports.passwordMinLength) {
        basePercentage = exports.criteriaWeights.minLenght * 100;
    }
    else {
        basePercentage = (password.length / exports.passwordMinLength) * 50;
    }
    for (const key in criteriaSatisfactionObject) {
        if (key !== 'maxLenght' && key !== 'minLenght') {
            basePercentage += criteriaSatisfactionObject[key] ? exports.criteriaWeights[key] * 100 : 0;
        }
    }
    return basePercentage;
};
exports.calculatePasswordProgress = calculatePasswordProgress;
