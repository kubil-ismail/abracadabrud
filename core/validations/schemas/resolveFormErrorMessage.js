export const firstLetterToUpperCase = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const removeQuotes = (string) => string.replace(/"/g, '');

export const replaceUnderScoreWithSpace = (string) => string.replace(/_/g, ' ');

export const removeIdOrIdsWithSpaceOrUnderscore = (string) => {
  const stringArray = string.split(' ');
  const message = stringArray.map((word) => {
    if (word === 'ids' || word === 'id') {
      return '';
    }
    return word;
  });
  return message.join(' ');
};

export const cleanMessage = (message) =>
  firstLetterToUpperCase(
    removeIdOrIdsWithSpaceOrUnderscore(removeQuotes(replaceUnderScoreWithSpace(message)))
  );

const resolveFormErrorMessage = (error) => {
  if (error?.message) {
    return cleanMessage(error.message);
  }
  if (typeof error === 'string') {
    return cleanMessage(error);
  }
  return 'Something went wrong';
};

export default resolveFormErrorMessage;
