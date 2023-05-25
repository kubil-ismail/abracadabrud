export default function resolveResponseError({
  errors,
  firstError = true,
  message = 'Something went wrong'
}) {
  try {
    const keys = Object.keys(errors);
    if (keys.length === 0) {
      return message;
    }
    const key = firstError ? keys[0] : keys[keys.length - 1];

    const error = errors[key];

    if (typeof error === 'string') {
      return error;
    }

    if (Array.isArray(error)) {
      return error[0];
    }
  } catch (error) {
    return message;
  }
  return message;
}
