export const passwordMinLength = 8;
export const passwordMaxLength = 50;
export const criteriaWeights = {
    minLenght: 7 / 10,
    maxLenght: 0, 
    oneDigit: 1 / 10,
    oneUppercase: 1 / 10,
    oneSpecialCharacter: 1 / 10
};

export function getCriteriaSatisfactionObject(password: string): { [key: string]: boolean } {
    const criteria = {
        minLenght: password.length >= passwordMinLength,
        maxLenght: password.length <= passwordMaxLength,
        oneDigit: /\d/.test(password),
        oneUppercase: /[A-Z]/.test(password),
        oneSpecialCharacter: /[^a-zA-Z0-9]/.test(password),
    };

    return criteria;
}

export function isPasswordValid(password: string): boolean {
    const criteria = getCriteriaSatisfactionObject(password);
    return Object.values(criteria).every((criterion) => criterion);
}

export const calculatePasswordProgress = (password: string): number => {
    const criteriaSatisfactionObject = getCriteriaSatisfactionObject(password);
    let basePercentage = 0;
  
    if (password.length >= passwordMinLength) {
      basePercentage = criteriaWeights.minLenght * 100;
    } else {
      basePercentage = (password.length / passwordMinLength) * 50;
    }
  
    for (const key in criteriaSatisfactionObject) {
      if (key !== 'maxLenght' && key !== 'minLenght') {
        basePercentage += criteriaSatisfactionObject[key] ? criteriaWeights[key as keyof typeof criteriaWeights] * 100 : 0;
      }
    }
  
    return basePercentage;
};
